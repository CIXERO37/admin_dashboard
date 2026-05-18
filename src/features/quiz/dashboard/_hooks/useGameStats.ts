"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export function useGameStats() {
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({})
  const [topPlayers, setTopPlayers] = useState<
    { name: string; value: number }[]
  >([])
  const [topHosts, setTopHosts] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    async function fetchStats() {
      try {
        // Updated query with correct column 'host_id'
        const { data: sessions, error } = await supabase
          .from("game_sessions")
          .select("quiz_id, host_id, participants")

        if (error) throw error

        const counts: Record<string, number> = {}
        const playerCounts: Record<string, number> = {}
        const hostCounts: Record<string, number> = {}
        const nicknameMap: Record<string, string> = {}

        sessions?.forEach((session) => {
          // 1. Session Counts per Quiz
          if (session.quiz_id) {
            counts[session.quiz_id] = (counts[session.quiz_id] || 0) + 1
          }

          // 2. Top Hosts
          if (session.host_id) {
            const hostId = session.host_id
            hostCounts[hostId] = (hostCounts[hostId] || 0) + 1
          }

          // 3. Top Players
          const participants = session.participants as any[]
          if (Array.isArray(participants)) {
            participants.forEach((p) => {
              if (p.user_id) {
                playerCounts[p.user_id] = (playerCounts[p.user_id] || 0) + 1
                // Capture nickname as fallback if profile not found
                if (p.nickname) {
                  nicknameMap[p.user_id] = p.nickname
                }
              }
            })
          }
        })

        setSessionCounts(counts)

        // Helper to get top 5 descending
        const getTopIds = (stats: Record<string, number>) => {
          return Object.entries(stats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map((e) => e[0])
        }

        const topHostIds = getTopIds(hostCounts)
        const topPlayerIds = getTopIds(playerCounts)

        const allUserIds = [...new Set([...topHostIds, ...topPlayerIds])]

        if (allUserIds.length > 0) {
          // Fetch Names for IDs
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, fullname, username, email")
            .in("id", allUserIds)

          const profileMap = new Map()
          profiles?.forEach((p) => {
            const displayName =
              p.fullname || p.username || p.email || "Unknown User"
            profileMap.set(p.id, displayName)
          })

          setTopHosts(
            topHostIds.map((id) => ({
              name: profileMap.get(id) || nicknameMap[id] || "Unknown Host",
              value: hostCounts[id],
            }))
          )

          setTopPlayers(
            topPlayerIds.map((id) => ({
              name: profileMap.get(id) || nicknameMap[id] || "Unknown Player",
              value: playerCounts[id],
            }))
          )
        } else {
            setTopHosts([])
            setTopPlayers([])
        }

      } catch (error) {
        console.error("Error fetching game stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { sessionCounts, topPlayers, topHosts, loading }
}
