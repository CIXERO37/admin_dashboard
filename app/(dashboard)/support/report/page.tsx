import { Suspense } from "react"
import { ReportTable } from "./report-table"
import { fetchReports } from "./actions"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    type?: string
  }>
}

export default async function SupportReportPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const status = params.status || "all"
  const type = params.type || "all"

  const { data, totalPages, stats } = await fetchReports({
    page,
    limit: 15,
    search,
    status,
    type,
  })

  return (
    <Suspense fallback={<ReportTableSkeleton />}>
      <ReportTable
        initialData={data}
        totalPages={totalPages}
        currentPage={page}
        stats={stats}
        searchQuery={search}
        statusFilter={status}
        typeFilter={type}
      />
    </Suspense>
  )
}

function ReportTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
