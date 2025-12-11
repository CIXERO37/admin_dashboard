"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"

export interface Profile {
  id: string
  username?: string | null
  email?: string | null
  fullname?: string | null
  avatar_url?: string | null
  role?: string | null
  last_active?: string | null
  is_blocked?: boolean | null
  organization?: string | null
  phone?: string | null
  address?: string | null
  birthdate?: string | null
  following_count?: number
  followers_count?: number
  friends_count?: number
  country_id?: number | null
  state_id?: number | null
  city_id?: number | null
  country?: { id: number; name: string; latitude: number | null; longitude: number | null } | null
  state?: { id: number; name: string; latitude: number | null; longitude: number | null } | null
  city?: { id: number; name: string; latitude: number | null; longitude: number | null } | null
}

export async function fetchProfileById(id: string): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    return { data: null, error: error.message }
  }

  // Check if counts are stored directly in profiles table
  let following_count = data.following_count ?? data.followings_count ?? 0
  let followers_count = data.followers_count ?? data.follower_count ?? 0
  let friends_count = data.friends_count ?? data.friend_count ?? 0

  // If not in profiles, try relationship tables
  if (following_count === 0 && followers_count === 0) {
    // Try follows table with different column name patterns
    const { count: followingCount, error: followingError } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", id)
    
    if (!followingError && followingCount !== null) {
      following_count = followingCount
    }

    const { count: followersCount, error: followersError } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", id)
    
    if (!followersError && followersCount !== null) {
      followers_count = followersCount
    }
  }

  // Try friendships table if friends_count is still 0
  if (friends_count === 0) {
    const { count: friendsCount, error: friendsError } = await supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .or(`user_id.eq.${id},friend_id.eq.${id}`)
      .eq("status", "accepted")
    
    if (!friendsError && friendsCount !== null) {
      friends_count = friendsCount
    }
  }

  let country = null
  let state = null
  let city = null

  if (data.country_id) {
    const { data: countryData } = await supabase
      .from("countries")
      .select("id, name, latitude, longitude")
      .eq("id", data.country_id)
      .single()
    country = countryData
  }

  if (data.state_id) {
    const { data: stateData } = await supabase
      .from("states")
      .select("id, name, latitude, longitude")
      .eq("id", data.state_id)
      .single()
    state = stateData
  }

  if (data.city_id) {
    const { data: cityData } = await supabase
      .from("cities")
      .select("id, name, latitude, longitude")
      .eq("id", data.city_id)
      .single()
    city = cityData
  }

  return {
    data: {
      ...data,
      following_count,
      followers_count,
      friends_count,
      country,
      state,
      city,
    },
    error: null,
  }
}
