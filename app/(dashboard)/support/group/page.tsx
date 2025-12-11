import { fetchGroups, fetchCountries } from "./actions"
import { GroupTable } from "./group-table"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

export default async function GroupPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const status = params.status || "all"

  // Fetch groups and countries in parallel for faster loading
  const [{ data, totalPages }, countries] = await Promise.all([
    fetchGroups({
      page,
      limit: 8,
      search,
      status,
    }),
    fetchCountries(),
  ])

  return (
    <GroupTable
      initialData={data}
      totalPages={totalPages}
      currentPage={page}
      searchQuery={search}
      statusFilter={status}
      countries={countries}
    />
  )
}
