"use client"

import { useEffect, useMemo, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import type { Profile } from "@/types/supabase"

export function useProfiles() {
  const [data, setData] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const supabase = getSupabaseBrowserClient()

    async function fetchProfiles() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("profiles")
          .select(
            "id, username, email, fullname, avatar_url, country, address, latitude, longitude, role, last_active, is_blocked, phone, organization, birthdate",
          )
          .order("last_active", { ascending: false, nullsFirst: false })
          .abortSignal(controller.signal)

        if (error) {
          // Ignore abort errors - they happen when component unmounts
          if (error.message.includes("aborted") || error.name === "AbortError") {
            return
          }
          setError(error.message)
          setData([])
        } else {
          setData(data ?? [])
        }

        setLoading(false)
      } catch (err) {
        // Catch any other errors (like network errors)
        // Ignore abort errors
        if (err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"))) {
          return
        }
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchProfiles()

    return () => controller.abort()
  }, [])

  const aggregates = useMemo(() => {
    const countriesMap = new Map<
      string,
      { code: string; name: string; users: number; avgLatitude: number | null; avgLongitude: number | null }
    >()

    data.forEach((profile) => {
      if (!profile.country) return
      const key = profile.country.trim()
      if (!countriesMap.has(key)) {
        countriesMap.set(key, {
          code: key.slice(0, 3).toUpperCase(),
          name: key,
          users: 0,
          avgLatitude: null,
          avgLongitude: null,
        })
      }

      const current = countriesMap.get(key)!
      current.users += 1

      if (profile.latitude !== null && profile.longitude !== null) {
        if (current.avgLatitude === null || current.avgLongitude === null) {
          current.avgLatitude = profile.latitude
          current.avgLongitude = profile.longitude
        } else {
          const lat = current.avgLatitude
          const lon = current.avgLongitude
          const count = current.users
          current.avgLatitude = lat + (profile.latitude - lat) / count
          current.avgLongitude = lon + (profile.longitude - lon) / count
        }
      }
    })

    const provinces = data
      .filter((profile) => profile.address)
      .map((profile) => ({
        id: profile.id,
        name: profile.address ?? "-",
        country: profile.country ?? "-",
        latitude: profile.latitude,
        longitude: profile.longitude,
        user: profile.username ?? profile.fullname ?? profile.email ?? "Unknown",
      }))

    return {
      countries: Array.from(countriesMap.values()),
      provinces,
    }
  }, [data])

  const updateProfile = async (id: string, updates: Partial<Profile>) => {
    const supabase = getSupabaseBrowserClient()

    // Optimistic update
    setData((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))

    const { error } = await supabase.from("profiles").update(updates).eq("id", id)

    if (error) {
      console.error("Error updating profile:", error)
      return { error }
    }

    return { error: null }
  }

  const deleteProfile = async (id: string) => {
    const supabase = getSupabaseBrowserClient()

    // Optimistic update
    setData((prev) => prev.filter((p) => p.id !== id))

    const { error } = await supabase.from("profiles").delete().eq("id", id)

    if (error) {
      console.error("Error deleting profile:", error)
      return { error }
    }

    return { error: null }
  }

  return { data, loading, error, aggregates, updateProfile, deleteProfile }
}

