 "use client"

import { Download } from "lucide-react"

import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { useProfiles } from "@/hooks/useProfiles"

export default function MasterProvincePage() {
  const { aggregates, loading, error } = useProfiles()

  const columns = [
    { key: "name", label: "Location" },
    { key: "country", label: "Country" },
    { key: "user", label: "Profile" },
    {
      key: "latitude",
      label: "Latitude",
      render: (value: unknown) => (value !== null && value !== undefined ? (value as number).toFixed(4) : "-"),
    },
    {
      key: "longitude",
      label: "Longitude",
      render: (value: unknown) => (value !== null && value !== undefined ? (value as number).toFixed(4) : "-"),
    },
  ]

  const tableData = aggregates?.provinces ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Location Data</h1>
        <p className="mt-1 text-muted-foreground">Latest profile locations with coordinates</p>
      </div>

      <SectionHeader
        title="Profiles with location info"
        description={`${tableData.length} locations`}
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
        <DataTable columns={columns} data={(loading ? [] : (tableData as Record<string, unknown>[]))} />
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading profile locations...</p>}
    </div>
  )
}
