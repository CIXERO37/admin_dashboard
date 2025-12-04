"use client";

import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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
import { useCountries, type Country } from "@/hooks/useCountries";

const ITEMS_PER_PAGE = 15;

export default function CountryPage() {
  const router = useRouter();
  const { data: countries, loading, error } = useCountries();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleIdClick = (countryCode: string) => {
    router.push(`/master/address/state?country=${countryCode}`);
  };

  const regionOptions = useMemo(() => {
    const regionSet = new Set<string>();
    countries.forEach((country) => {
      if (country.region) regionSet.add(country.region);
    });
    const sorted = Array.from(regionSet).sort();
    return [
      { value: "all", label: "All Regions" },
      ...sorted.map((region) => ({ value: region, label: region })),
    ];
  }, [countries]);

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
    const country = countries.find((c) => c.id === id);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value: unknown, row: Record<string, unknown>) => (
        <button
          onClick={() => handleIdClick(row.iso2 as string)}
          className="font-mono text-sm text-primary hover:underline cursor-pointer"
        >
          {value as number}
        </button>
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
      key: "region",
      label: "Region",
      render: (value: unknown) => (
        <span className="text-sm">{(value as string) || "—"}</span>
      ),
    },
    {
      key: "iso2",
      label: "Code",
      render: (value: unknown) => (
        <span className="font-mono text-sm font-medium">
          {(value as string) || "—"}
        </span>
      ),
    },
  ];

  const tableData = useMemo(() => {
    let filtered = countries;

    if (searchQuery) {
      filtered = filtered.filter((country) => {
        const searchableFields = [
          country.name,
          country.native,
          country.region,
          country.iso2,
          country.capital,
        ];
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchQuery)
        );
      });
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter((country) => country.region === regionFilter);
    }

    return filtered.map((country) => ({
      id: country.id,
      name: country.name,
      native: country.native,
      region: country.region,
      iso2: country.iso2,
    }));
  }, [countries, searchQuery, regionFilter]);

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
          <h1 className="text-3xl font-bold text-foreground">Countries</h1>
          <p className="mt-1 text-muted-foreground">
            {countries.length} total countries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search country..."
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
            options={regionOptions}
            value={regionFilter}
            onValueChange={(value) => {
              setRegionFilter(value);
              setCurrentPage(1);
            }}
            placeholder="Region"
            searchPlaceholder="Search region..."
            emptyText="No region found."
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
        <p className="text-sm text-muted-foreground">Loading countries...</p>
      )}

      <Dialog open={!!selectedCountry} onOpenChange={() => setSelectedCountry(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedCountry?.emoji && <span className="text-2xl">{selectedCountry.emoji}</span>}
              {selectedCountry?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCountry && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <DetailItem label="Native Name" value={selectedCountry.native} />
              <DetailItem label="ISO Code" value={`${selectedCountry.iso2} / ${selectedCountry.iso3}`} />
              <DetailItem label="Capital" value={selectedCountry.capital} />
              <DetailItem label="Phone Code" value={selectedCountry.phonecode ? `+${selectedCountry.phonecode}` : null} />
              <DetailItem label="Region" value={selectedCountry.region} />
              <DetailItem label="Subregion" value={selectedCountry.subregion} />
              <DetailItem label="Currency" value={selectedCountry.currency ? `${selectedCountry.currency} (${selectedCountry.currency_symbol})` : null} />
              <DetailItem 
                label="Coordinates" 
                value={selectedCountry.latitude && selectedCountry.longitude 
                  ? `${selectedCountry.latitude}, ${selectedCountry.longitude}` 
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
