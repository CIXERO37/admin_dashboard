"use client"

import { Download } from "lucide-react"
import { format } from "date-fns"

import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { useReports } from "@/hooks/useReports"

export default function SupportQuizPage() {
  const { data: reports, loading, error } = useReports({ contentType: "quiz" })

  const columns = [
    { key: "id", label: "ID" },
    { key: "quizTitle", label: "Quiz Title" },
    { key: "reporter", label: "Reporter" },
    { key: "reason", label: "Reason" },
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
        <h1 className="text-3xl font-bold text-foreground">Reported Quizzes</h1>
        <p className="mt-1 text-muted-foreground">Review quizzes that have been flagged by users</p>
      </div>

      <SectionHeader
        title="All Reported Quizzes"
        description={`${reports.length} reported quizzes`}
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
          data={
            (loading
              ? []
              : reports.map((report) => ({
                  id: report.id,
                  quizTitle: report.quiz?.title ?? report.reported_content_id ?? "-",
                  reporter: report.reporter?.username || report.reporter?.fullname || "Unknown",
                  reason: report.report_type ?? report.title ?? "-",
                  status: formatStatus(report.status),
                  date: report.created_at ? format(new Date(report.created_at), "dd MMM yyyy") : "-",
                }))) as Record<string, unknown>[]
          }
        />
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading reported quizzes...</p>}
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
