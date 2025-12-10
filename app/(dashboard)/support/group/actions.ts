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

export interface GroupMember {
  user_id: string
  username: string | null
  fullname: string | null
  avatar_url: string | null
  role: string
  joined_at: string
}

export interface GroupDetail extends Group {
  members_data?: GroupMember[]
  member_count?: number
}

export async function fetchGroupById(id: string): Promise<{ data: GroupDetail | null; error: string | null }> {
  const supabase = await getSupabaseServerClient()

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*, creator:profiles!groups_creator_id_fkey(fullname, email, avatar_url)")
    .eq("id", id)
    .single()

  if (groupError) {
    console.error("Error fetching group:", groupError)
    return { data: null, error: groupError.message }
  }

  // Members are stored as JSONB array in groups.members field
  const rawMembers = (group.members as GroupMember[]) ?? []
  
  // Enrich members data from profiles if missing
  const userIds = rawMembers.map((m) => m.user_id).filter(Boolean)
  let profilesMap: Record<string, { fullname: string | null; username: string | null; avatar_url: string | null }> = {}
  
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, fullname, username, avatar_url")
      .in("id", userIds)
    
    if (profiles) {
      profilesMap = profiles.reduce((acc, p) => {
        acc[p.id] = { fullname: p.fullname, username: p.username, avatar_url: p.avatar_url }
        return acc
      }, {} as typeof profilesMap)
    }
  }

  const members = rawMembers.map((m) => ({
    ...m,
    fullname: m.fullname || profilesMap[m.user_id]?.fullname || null,
    username: m.username || profilesMap[m.user_id]?.username || null,
    avatar_url: m.avatar_url || profilesMap[m.user_id]?.avatar_url || null,
  }))

  return {
    data: {
      ...group,
      members_data: members,
      member_count: members.length,
    },
    error: null,
  }
}

export interface FetchMembersParams {
  groupId: string
  page?: number
  limit?: number
  search?: string
  role?: string
}

export interface MembersResponse {
  data: GroupMember[]
  totalCount: number
  totalPages: number
}

export async function fetchGroupMembers({
  groupId,
  page = 1,
  limit = 10,
  search = "",
  role = "all",
}: FetchMembersParams): Promise<MembersResponse> {
  const supabase = await getSupabaseServerClient()
  const offset = (page - 1) * limit

  // Fetch group with members JSONB
  const { data: group, error } = await supabase
    .from("groups")
    .select("members")
    .eq("id", groupId)
    .single()

  if (error || !group) {
    console.error("Error fetching group members:", error)
    return { data: [], totalCount: 0, totalPages: 0 }
  }

  const rawMembers = (group.members as GroupMember[]) ?? []

  // Enrich members data from profiles if missing
  const userIds = rawMembers.map((m) => m.user_id).filter(Boolean)
  let profilesMap: Record<string, { fullname: string | null; username: string | null; avatar_url: string | null }> = {}
  
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, fullname, username, avatar_url")
      .in("id", userIds)
    
    if (profiles) {
      profilesMap = profiles.reduce((acc, p) => {
        acc[p.id] = { fullname: p.fullname, username: p.username, avatar_url: p.avatar_url }
        return acc
      }, {} as typeof profilesMap)
    }
  }

  let members = rawMembers.map((m) => ({
    ...m,
    fullname: m.fullname || profilesMap[m.user_id]?.fullname || null,
    username: m.username || profilesMap[m.user_id]?.username || null,
    avatar_url: m.avatar_url || profilesMap[m.user_id]?.avatar_url || null,
  }))

  // Filter by role
  if (role && role !== "all") {
    members = members.filter((m) => m.role === role)
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    members = members.filter((member) =>
      member.fullname?.toLowerCase().includes(searchLower) ||
      member.username?.toLowerCase().includes(searchLower)
    )
  }

  // Sort by joined_at descending
  members.sort((a, b) => {
    const dateA = a.joined_at ? new Date(a.joined_at).getTime() : 0
    const dateB = b.joined_at ? new Date(b.joined_at).getTime() : 0
    return dateB - dateA
  })

  const totalCount = members.length
  const totalPages = Math.ceil(totalCount / limit)

  // Paginate
  const paginatedMembers = members.slice(offset, offset + limit)

  return {
    data: paginatedMembers,
    totalCount,
    totalPages,
  }
}

export async function removeGroupMember(groupId: string, userId: string) {
  const supabase = await getSupabaseServerClient()

  // Fetch current members
  const { data: group, error: fetchError } = await supabase
    .from("groups")
    .select("members")
    .eq("id", groupId)
    .single()

  if (fetchError || !group) {
    console.error("Error fetching group:", fetchError)
    return { error: fetchError?.message || "Group not found" }
  }

  const members = (group.members as GroupMember[]) ?? []
  const updatedMembers = members.filter((m) => m.user_id !== userId)

  const { error } = await supabase
    .from("groups")
    .update({ members: updatedMembers })
    .eq("id", groupId)

  if (error) {
    console.error("Error removing member:", error)
    return { error: error.message }
  }

  return { error: null }
}

export async function updateMemberRole(groupId: string, userId: string, role: string) {
  const supabase = await getSupabaseServerClient()

  // Fetch current members
  const { data: group, error: fetchError } = await supabase
    .from("groups")
    .select("members")
    .eq("id", groupId)
    .single()

  if (fetchError || !group) {
    console.error("Error fetching group:", fetchError)
    return { error: fetchError?.message || "Group not found" }
  }

  const members = (group.members as GroupMember[]) ?? []
  const updatedMembers = members.map((m) =>
    m.user_id === userId ? { ...m, role } : m
  )

  const { error } = await supabase
    .from("groups")
    .update({ members: updatedMembers })
    .eq("id", groupId)

  if (error) {
    console.error("Error updating member role:", error)
    return { error: error.message }
  }

  return { error: null }
}
