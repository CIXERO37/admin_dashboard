"use client"

import { FileText, HelpCircle, AlertTriangle, Clock, CheckCircle } from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { ActionCard } from "@/components/dashboard/action-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge, PriorityBadge } from "@/components/dashboard/data-table"
import { useReports } from "@/hooks/useReports"
import { format } from "date-fns"

export default function SupportDashboardPage() {
  const { data: reports, loading, error, stats } = useReports()
  const quizReports = reports.filter((report) => report.reported_content_type === "quiz")

  const recentReportsColumns = [
    { key: "user", label: "User" },
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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage user reports and support tickets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Reports" value={stats.total} icon={FileText} />
        <StatCard
          title="Pending"
          value={stats.pending}
          change="Requires attention"
          changeType="neutral"
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          change="Being processed"
          changeType="neutral"
          icon={AlertTriangle}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          change="Completed"
          changeType="increase"
          icon={CheckCircle}
        />
      </div>

      {/* Quick Access */}
      <div>
        <SectionHeader title="Support Modules" description="Access different support features" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ActionCard
            title="User Reports"
            description="View and manage all user submitted reports"
            href="/support/report"
            icon={FileText}
            stats={`${stats.total} reports`}
          />
          <ActionCard
            title="Reported Quizzes"
            description="Review quizzes flagged by users"
            href="/support/quiz"
            icon={HelpCircle}
            stats={`${quizReports.length} quizzes`}
          />
        </div>
      </div>

      {/* Recent Reports Table */}
      <div>
        <SectionHeader title="Recent Reports" description="Latest user submitted reports" />
        <div className="mt-4">
          {error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : (
            <DataTable
              columns={recentReportsColumns}
              data={
                (loading ? [] : reports.slice(0, 5).map((report) => ({
                  user: report.reporter?.username || report.reporter?.fullname || report.reporter?.email || "Unknown",
                  type: report.report_type ?? "-",
                  priority: report.priority ?? "Medium",
                  status: formatStatus(report.status),
                  date: report.created_at ? format(new Date(report.created_at), "dd MMM yyyy") : "-",
                }))) as Record<string, unknown>[]
              }
            />
          )}
          {loading && <p className="text-sm text-muted-foreground">Fetching latest reports...</p>}
        </div>
      </div>
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
