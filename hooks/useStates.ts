"use client"

import { useEffect, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export interface State {
  id: number
  name: string
  native: string | null
  country_id: number | null
  country_code: string | null
  iso2: string | null
  type: string | null
  latitude: number | null
  longitude: number | null
}

export function useStates() {
  const [data, setData] = useState<State[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const supabase = getSupabaseBrowserClient()

    async function fetchStates() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("states")
          .select("id, name, native, country_id, country_code, iso2, type, latitude, longitude")
          .order("name", { ascending: true })
          .abortSignal(controller.signal)

        if (error) {
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
        if (err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"))) {
          return
        }
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchStates()

    return () => controller.abort()
  }, [])

  return { data, loading, error }
}
