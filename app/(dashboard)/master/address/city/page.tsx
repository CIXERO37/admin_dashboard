import { Suspense } from "react"
import { CityTable } from "./city-table"
import { fetchCities } from "./actions"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    country?: string
    state?: string
  }>
}

export default async function CityPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const country = params.country || "all"
  const state = params.state || "all"

  const { data, totalPages, countries, states } = await fetchCities({
    page,
    limit: 15,
    search,
    country,
    state,
  })

  return (
    <Suspense fallback={<CityTableSkeleton />}>
      <CityTable
        initialData={data}
        totalPages={totalPages}
        currentPage={page}
        countries={countries}
        states={states}
        searchQuery={search}
        countryFilter={country}
        stateFilter={state}
      />
    </Suspense>
  )
}

function CityTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
