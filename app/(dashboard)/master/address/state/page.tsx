import { Suspense } from "react"
import { StateTable } from "./state-table"
import { fetchStates } from "./actions"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    country?: string
  }>
}

export default async function StatePage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const country = params.country || "all"

  const { data, totalPages, countries } = await fetchStates({
    page,
    limit: 15,
    search,
    country,
  })

  return (
    <Suspense fallback={<StateTableSkeleton />}>
      <StateTable
        initialData={data}
        totalPages={totalPages}
        currentPage={page}
        countries={countries}
        searchQuery={search}
        countryFilter={country}
      />
    </Suspense>
  )
}

function StateTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
