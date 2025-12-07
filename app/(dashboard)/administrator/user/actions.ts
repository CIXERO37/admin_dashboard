"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface Profile {
  id: string
  username?: string | null
  email?: string | null
  fullname?: string | null
  avatar_url?: string | null
  role?: string | null
  last_active?: string | null
  is_blocked?: boolean | null
}

export interface ProfilesResponse {
  data: Profile[]
  totalCount: number
  totalPages: number
}

interface FetchProfilesParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

export async function fetchProfiles({
  page = 1,
  limit = 15,
  search = "",
  role = "all",
  status = "all",
}: FetchProfilesParams): Promise<ProfilesResponse> {
  const supabase = await getSupabaseServerClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })

  if (search) {
    query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,fullname.ilike.%${search}%`)
  }

  if (role && role !== "all") {
    query = query.ilike("role", role)
  }

  if (status && status !== "all") {
    if (status === "blocked") {
      query = query.eq("is_blocked", true)
    } else if (status === "active") {
      query = query.or("is_blocked.is.null,is_blocked.eq.false")
    }
  }

  const { data, count, error } = await query
    .order("last_active", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching profiles:", error)
    return { data: [], totalCount: 0, totalPages: 0 }
  }

  return {
    data: data ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function updateProfileAction(id: string, updates: Partial<Profile>) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)

  if (error) {
    console.error("Error updating profile:", error)
    return { error: error.message }
  }

  revalidatePath("/administrator/user")
  return { error: null }
}

export async function deleteProfileAction(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting profile:", error)
    return { error: error.message }
  }

  revalidatePath("/administrator/user")
  return { error: null }
}
