"use client"

import { Plus, Download } from "lucide-react"
import { format } from "date-fns"

import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge, PriorityBadge } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { useReports } from "@/hooks/useReports"

export default function SupportReportPage() {
  const { data: reports, loading, error } = useReports()

  const columns = [
    { key: "id", label: "ID" },
    { key: "user", label: "User" },
    { key: "email", label: "Email" },
    { key: "type", label: "Type" },
    {
      key: "priority",
      label: "Priority",
      render: (value: unknown) => <PriorityBadge priority={value as string} />,
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
    { key: "date", label: "Date" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Reports</h1>
        <p className="mt-1 text-muted-foreground">View and manage all user submitted reports</p>
      </div>

      <SectionHeader
        title="All Reports"
        description={`${reports.length} total reports`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
          </div>
        }
      />

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={
            (loading
              ? []
              : reports.map((report) => ({
                  id: report.id,
                  user: report.reporter?.username || report.reporter?.fullname || "Unknown",
                  email: report.reporter?.email || "-",
                  type: report.report_type ?? "-",
                  priority: report.priority ?? "Medium",
                  status: formatStatus(report.status),
                  date: report.created_at ? format(new Date(report.created_at), "dd MMM yyyy") : "-",
                }))) as Record<string, unknown>[]
          }
        />
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading reports...</p>}
    </div>
  )
}

function formatStatus(status: string | null) {
  if (!status) return "Pending"
  const normalized = status.toLowerCase()
  if (normalized === "pending") return "Pending"
  if (normalized === "in_progress" || normalized === "in progress") return "In Progress"
  if (normalized === "resolved") return "Resolved"
  return status
}
