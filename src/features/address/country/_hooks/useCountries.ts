"use client"

import { useEffect, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export interface Country {
  id: number
  name: string
  native: string | null
  region: string | null
  subregion: string | null
  iso2: string | null
  iso3: string | null
  phonecode: string | null
  capital: string | null
  currency: string | null
  currency_symbol: string | null
  emoji: string | null
  latitude: number | null
  longitude: number | null
}

export function useCountries() {
  const [data, setData] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const supabase = getSupabaseBrowserClient()

    async function fetchCountries() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("countries")
          .select("id, name, native, region, subregion, iso2, iso3, phonecode, capital, currency, currency_symbol, emoji, latitude, longitude")
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

    fetchCountries()

    return () => controller.abort()
  }, [])

  return { data, loading, error }
}
