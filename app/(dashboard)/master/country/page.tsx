"use client"

import { Download } from "lucide-react"

import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { useProfiles } from "@/hooks/useProfiles"

const numberFormatter = new Intl.NumberFormat("en-US")

export default function MasterCountryPage() {
  const { aggregates, loading, error } = useProfiles()

  const columns = [
    { key: "code", label: "Code" },
    { key: "name", label: "Country" },
    {
      key: "users",
      label: "Users",
      render: (value: unknown) => numberFormatter.format(value as number),
    },
    {
      key: "latitude",
      label: "Avg Latitude",
      render: (value: unknown) => (value ? (value as number).toFixed(2) : "-"),
    },
    {
      key: "longitude",
      label: "Avg Longitude",
      render: (value: unknown) => (value ? (value as number).toFixed(2) : "-"),
    },
  ]

  const tableData =
    aggregates?.countries.map((country) => ({
      code: country.code,
      name: country.name,
      users: country.users,
      latitude: country.avgLatitude,
      longitude: country.avgLongitude,
    })) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Country Data</h1>
        <p className="mt-1 text-muted-foreground">Aggregated user locations per country</p>
      </div>

      <SectionHeader
        title="All Countries"
        description={`${tableData.length} countries`}
        action={
          <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={(loading ? [] : (tableData as Record<string, unknown>[]))}
        />
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading country list...</p>}
    </div>
  )
}
