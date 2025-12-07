"use client"

import { Search } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { DataTable } from "@/components/dashboard/data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Country, fetchCountryById } from "./actions"

interface CountryTableProps {
  initialData: Country[]
  totalPages: number
  currentPage: number
  regions: string[]
  searchQuery: string
  regionFilter: string
}

export function CountryTable({
  initialData,
  totalPages,
  currentPage,
  regions,
  searchQuery,
  regionFilter,
}: CountryTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchInput, setSearchInput] = useState(searchQuery)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [loadingCountry, setLoadingCountry] = useState(false)

  const regionOptions = [
    { value: "all", label: "All Regions" },
    ...regions.map((region) => ({ value: region, label: region })),
  ]

  const updateUrl = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })

    startTransition(() => {
      router.push(`?${newParams.toString()}`)
    })
  }

  const handleSearch = () => {
    updateUrl({ search: searchInput, page: 1 })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleRegionChange = (value: string) => {
    updateUrl({ region: value, page: 1 })
  }

  const handlePageChange = (page: number) => {
    updateUrl({ page, search: searchQuery, region: regionFilter })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleIdClick = (countryCode: string) => {
    router.push(`/master/address/state?country=${countryCode}`)
  }

  const handleNameClick = async (id: number) => {
    setLoadingCountry(true)
    const country = await fetchCountryById(id)
    setSelectedCountry(country)
    setLoadingCountry(false)
  }

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
          disabled={loadingCountry}
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
  ]

  const tableData = initialData.map((country) => ({
    id: country.id,
    name: country.name,
    native: country.native,
    region: country.region,
    iso2: country.iso2,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Countries</h1>
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
            <Button size="icon" onClick={handleSearch} disabled={isPending}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Combobox
            options={regionOptions}
            value={regionFilter}
            onValueChange={handleRegionChange}
            placeholder="Region"
            searchPlaceholder="Search region..."
            emptyText="No region found."
          />
        </div>
      </div>

      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        <DataTable
          columns={columns}
          data={tableData as Record<string, unknown>[]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

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
  )
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  )
}
