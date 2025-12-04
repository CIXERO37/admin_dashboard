"use client";

import { Search } from "lucide-react";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
import { useStates, type State } from "@/hooks/useStates";

const ITEMS_PER_PAGE = 15;

function StatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: states, loading, error } = useStates();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<State | null>(null);

  useEffect(() => {
    const country = searchParams.get("country");
    if (country) {
      setCountryFilter(country);
    }
  }, [searchParams]);

  const countryOptions = useMemo(() => {
    const countrySet = new Set<string>();
    states.forEach((state) => {
      if (state.country_code) countrySet.add(state.country_code);
    });
    const sorted = Array.from(countrySet).sort();
    return [
      { value: "all", label: "All Countries" },
      ...sorted.map((code) => ({ value: code, label: code })),
    ];
  }, [states]);

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
    const state = states.find((s) => s.id === id);
    if (state) {
      setSelectedState(state);
    }
  };

  const handleIdClick = (stateCode: string, countryCode: string) => {
    router.push(`/master/address/city?state=${stateCode}&country=${countryCode}`);
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value: unknown, row: Record<string, unknown>) => (
        <button
          onClick={() => handleIdClick(row.iso2 as string, row.country_code as string)}
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
      key: "country_code",
      label: "Country",
      render: (value: unknown) => (
        <span className="font-mono text-sm">{(value as string) || "—"}</span>
      ),
    },
    {
      key: "iso2",
      label: "State Code",
      render: (value: unknown) => (
        <span className="font-mono text-sm font-medium">
          {(value as string) || "—"}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: unknown) => (
        <span className="text-sm text-muted-foreground">
          {(value as string) || "—"}
        </span>
      ),
    },
  ];

  const tableData = useMemo(() => {
    let filtered = states;

    if (searchQuery) {
      filtered = filtered.filter((state) => {
        const searchableFields = [
          state.name,
          state.native,
          state.country_code,
          state.iso2,
          state.type,
        ];
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchQuery)
        );
      });
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter((state) => state.country_code === countryFilter);
    }

    return filtered.map((state) => ({
      id: state.id,
      name: state.name,
      native: state.native,
      country_code: state.country_code,
      iso2: state.iso2,
      type: state.type,
    }));
  }, [states, searchQuery, countryFilter]);

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
          <h1 className="text-3xl font-bold text-foreground">States</h1>
          <p className="mt-1 text-muted-foreground">
            {states.length} total states
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search state..."
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
              setCurrentPage(1);
            }}
            placeholder="Country"
            searchPlaceholder="Search country..."
            emptyText="No country found."
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
        <p className="text-sm text-muted-foreground">Loading states...</p>
      )}

      <Dialog open={!!selectedState} onOpenChange={() => setSelectedState(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedState?.name}</DialogTitle>
          </DialogHeader>
          {selectedState && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <DetailItem label="Native Name" value={selectedState.native} />
              <DetailItem label="State Code" value={selectedState.iso2} />
              <DetailItem label="Country" value={selectedState.country_code} />
              <DetailItem label="Type" value={selectedState.type} />
              <DetailItem 
                label="Coordinates" 
                value={selectedState.latitude && selectedState.longitude 
                  ? `${selectedState.latitude}, ${selectedState.longitude}` 
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

export default function StatePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <StatePageContent />
    </Suspense>
  );
}
