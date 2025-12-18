import { notFound } from "next/navigation"
import { fetchGroupById, fetchGroupMembers } from "../actions"
import { GroupDetailClient } from "./group-detail-client"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
  }>
}

export default async function GroupDetailPage({ searchParams, params }: PageProps) {
  const { id } = await params
  const search = await searchParams
  
  const page = Number(search.page) || 1
  const searchQuery = search.search || ""
  const roleFilter = search.role || "all"

  const { data: group, error } = await fetchGroupById(id)

  if (error || !group) {
    notFound()
  }

  const { data: members, totalPages } = await fetchGroupMembers({
    groupId: id,
    page,
    limit: 10,
    search: searchQuery,
    role: roleFilter,
  })

  return (
    <GroupDetailClient
      group={group}
      members={members}
      totalPages={totalPages}
      currentPage={page}
      searchQuery={searchQuery}
      roleFilter={roleFilter}
    />
  )
}
