"use client";

import { Search } from "lucide-react";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { DataTable } from "@/components/dashboard/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCities, type City } from "@/hooks/useCities";

const ITEMS_PER_PAGE = 15;

function CityPageContent() {
  const searchParams = useSearchParams();
  const { data: cities, loading, error } = useCities();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    const country = searchParams.get("country");
    const state = searchParams.get("state");
    if (country) {
      setCountryFilter(country);
    }
    if (state) {
      setStateFilter(state);
    }
  }, [searchParams]);

  const countryOptions = useMemo(() => {
    const countrySet = new Set<string>();
    cities.forEach((city) => {
      if (city.country_code) countrySet.add(city.country_code);
    });
    const sorted = Array.from(countrySet).sort();
    return [
      { value: "all", label: "All Countries" },
      ...sorted.map((code) => ({ value: code, label: code })),
    ];
  }, [cities]);

  const stateOptions = useMemo(() => {
    const stateSet = new Set<string>();
    const filteredCities = countryFilter === "all" 
      ? cities 
      : cities.filter((city) => city.country_code === countryFilter);
    filteredCities.forEach((city) => {
      if (city.state_code) stateSet.add(city.state_code);
    });
    const sorted = Array.from(stateSet).sort();
    return [
      { value: "all", label: "All States" },
      ...sorted.map((code) => ({ value: code, label: code })),
    ];
  }, [cities, countryFilter]);

  const handleSearch = () => {
    setSearchQuery(searchInput.toLowerCase());
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNameClick = (id: number) => {
    const city = cities.find((c) => c.id === id);
    if (city) {
      setSelectedCity(city);
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value: unknown) => (
        <span className="font-mono text-sm text-muted-foreground">
          {value as number}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value: unknown, row: Record<string, unknown>) => (
        <button
          onClick={() => handleNameClick(row.id as number)}
          className="font-medium text-primary hover:underline text-left cursor-pointer"
        >
          {value as string}
        </button>
      ),
    },
    {
      key: "native",
      label: "Native Name",
      render: (value: unknown) => (
        <span className="text-muted-foreground">{(value as string) || "—"}</span>
      ),
    },
    {
      key: "state_code",
      label: "State",
      render: (value: unknown) => (
        <span className="font-mono text-sm">{(value as string) || "—"}</span>
      ),
    },
    {
      key: "country_code",
      label: "Country",
      render: (value: unknown) => (
        <span className="font-mono text-sm font-medium">
          {(value as string) || "—"}
        </span>
      ),
    },
  ];

  const tableData = useMemo(() => {
    let filtered = cities;

    if (searchQuery) {
      filtered = filtered.filter((city) => {
        const searchableFields = [
          city.name,
          city.native,
          city.state_code,
          city.country_code,
        ];
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchQuery)
        );
      });
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter((city) => city.country_code === countryFilter);
    }

    if (stateFilter !== "all") {
      filtered = filtered.filter((city) => city.state_code === stateFilter);
    }

    return filtered.map((city) => ({
      id: city.id,
      name: city.name,
      native: city.native,
      state_code: city.state_code,
      country_code: city.country_code,
    }));
  }, [cities, searchQuery, countryFilter, stateFilter]);

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cities</h1>
          <p className="mt-1 text-muted-foreground">
            {cities.length} total cities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search city..."
                className="pl-10 w-64 bg-background border-border"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Combobox
            options={countryOptions}
            value={countryFilter}
            onValueChange={(value) => {
              setCountryFilter(value);
              setStateFilter("all");
              setCurrentPage(1);
            }}
            placeholder="Country"
            searchPlaceholder="Search country..."
            emptyText="No country found."
          />

          <Combobox
            options={stateOptions}
            value={stateFilter}
            onValueChange={(value) => {
              setStateFilter(value);
              setCurrentPage(1);
            }}
            placeholder="State"
            searchPlaceholder="Search state..."
            emptyText="No state found."
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={loading ? [] : (paginatedData as Record<string, unknown>[])}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">Loading cities...</p>
      )}

      <Dialog open={!!selectedCity} onOpenChange={() => setSelectedCity(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedCity?.name}</DialogTitle>
          </DialogHeader>
          {selectedCity && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <DetailItem label="Native Name" value={selectedCity.native} />
              <DetailItem label="State" value={selectedCity.state_code} />
              <DetailItem label="Country" value={selectedCity.country_code} />
              <DetailItem 
                label="Coordinates" 
                value={selectedCity.latitude && selectedCity.longitude 
                  ? `${selectedCity.latitude}, ${selectedCity.longitude}` 
                  : null} 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

export default function CityPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CityPageContent />
    </Suspense>
  );
}
