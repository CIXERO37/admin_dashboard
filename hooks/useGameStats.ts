"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export function useGameStats() {
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from("game_sessions")
          .select("quiz_id")
        
        if (error) throw error

        const counts: Record<string, number> = {}
        data?.forEach((session) => {
          if (session.quiz_id) {
            counts[session.quiz_id] = (counts[session.quiz_id] || 0) + 1
          }
        })

        setSessionCounts(counts)
      } catch (error) {
        console.error("Error fetching game stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { sessionCounts, loading }
}
