import { Suspense } from "react"
import { UserTable } from "./user-table"
import { fetchProfiles } from "./actions"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
    status?: string
  }>
}

export default async function AdministratorUserPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const role = params.role || "all"
  const status = params.status || "all"

  const { data, totalPages } = await fetchProfiles({
    page,
    limit: 15,
    search,
    role,
    status,
  })

  return (
    <Suspense fallback={<UserTableSkeleton />}>
      <UserTable
        initialData={data}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={search}
        roleFilter={role}
        statusFilter={status}
      />
    </Suspense>
  )
}

function UserTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-40" />
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
