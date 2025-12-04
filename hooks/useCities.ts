"use client"

import { useEffect, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export interface City {
  id: number
  name: string
  native: string | null
  state_id: number | null
  state_code: string | null
  country_id: number | null
  country_code: string | null
  latitude: number | null
  longitude: number | null
}

export function useCities() {
  const [data, setData] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const supabase = getSupabaseBrowserClient()

    async function fetchCities() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("cities")
          .select("id, name, native, state_id, state_code, country_id, country_code, latitude, longitude")
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

    fetchCities()

    return () => controller.abort()
  }, [])

  return { data, loading, error }
}
