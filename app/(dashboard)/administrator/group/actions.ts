"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"

export interface Group {
  id: string
  name: string
  description?: string | null
  avatar_url?: string | null
  cover_url?: string | null
  creator_id: string
  invite_code: string
  slug?: string | null
  members?: Record<string, unknown>[] | null
  settings?: Record<string, unknown> | null
  created_at?: string | null
  creator?: {
    fullname: string | null
    email: string | null
    avatar_url: string | null
  } | null
}

export interface GroupsResponse {
  data: Group[]
  totalCount: number
  totalPages: number
}

interface FetchGroupsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export async function fetchGroups({
  page = 1,
  limit = 12,
  search = "",
  status = "all",
}: FetchGroupsParams): Promise<GroupsResponse> {
  const supabase = await getSupabaseServerClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("groups")
    .select("*, creator:profiles!groups_creator_id_fkey(fullname, email, avatar_url)", { count: "exact" })

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (status && status !== "all") {
    query = query.eq("settings->>status", status)
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching groups:", error)
    return { data: [], totalCount: 0, totalPages: 0 }
  }

  return {
    data: data ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function updateGroupAction(id: string, updates: Partial<Group>) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("groups")
    .update(updates)
    .eq("id", id)

  if (error) {
    console.error("Error updating group:", error)
    return { error: error.message }
  }

  return { error: null }
}

export async function deleteGroupAction(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting group:", error)
    return { error: error.message }
  }

  return { error: null }
}
