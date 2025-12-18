import { Suspense } from "react"
import { CountryTable } from "./country-table"
import { fetchCountries } from "./actions"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    region?: string
  }>
}

export default async function CountryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const region = params.region || "all"

  const { data, totalPages, regions } = await fetchCountries({
    page,
    limit: 15,
    search,
    region,
  })

  return (
    <Suspense fallback={<CountryTableSkeleton />}>
      <CountryTable
        initialData={data}
        totalPages={totalPages}
        currentPage={page}
        regions={regions}
        searchQuery={search}
        regionFilter={region}
      />
    </Suspense>
  )
}

function CountryTableSkeleton() {
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
