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
          .select("*")
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
    return {
      countries: [],
      provinces: [],
    }
  }, [])

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

