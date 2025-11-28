"use client"

import { Plus, Download } from "lucide-react"
import { format } from "date-fns"

import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuizzes } from "@/hooks/useQuizzes"

const visibilityColors: Record<string, string> = {
  Visible: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  Private: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
}

export default function MasterQuizPage() {
  const { data: quizzes, loading, error } = useQuizzes()

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "questions", label: "Questions" },
    {
      key: "language",
      label: "Language",
    },
    {
      key: "difficulty",
      label: "Visibility",
      render: (value: unknown) => {
        const status = value as string
        return (
          <Badge variant="outline" className={visibilityColors[status] ?? "bg-secondary text-secondary-foreground"}>
            {status}
          </Badge>
        )
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
    { key: "createdAt", label: "Created" },
  ]

  const tableData =
    quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      category: quiz.category ?? "-",
      questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
      language: quiz.language ?? "ID",
      difficulty: quiz.is_public ? "Visible" : "Private",
      status: quiz.is_hidden ? "Hidden" : "Active",
      createdAt: quiz.created_at ? format(new Date(quiz.created_at), "dd MMM yyyy") : "-",
    })) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quiz Data</h1>
        <p className="mt-1 text-muted-foreground">Manage all quiz content and settings</p>
      </div>

      <SectionHeader
        title="All Quizzes"
        description={`${quizzes.length} total quizzes`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add Quiz
            </Button>
          </div>
        }
      />

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <DataTable columns={columns} data={(loading ? [] : (tableData as Record<string, unknown>[]))} />
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading quizzes...</p>}
    </div>
  )
}
