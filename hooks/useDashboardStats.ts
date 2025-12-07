"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

interface DashboardStats {
  totalUsers: number
  totalAdmins: number
  totalQuizzes: number
  pendingReports: number
  activeUsers: number
  blockedUsers: number
}

interface RecentActivity {
  id: string
  action: string
  user: string
  time: string
  type: "user" | "content" | "support" | "billing"
}

interface UserGrowthData {
  month: string
  users: number
}

export function useDashboardStats() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<Record<string, unknown>[]>([])
  const [quizzes, setQuizzes] = useState<{ id: string; created_at: string | null; title: string | null }[]>([])
  const [reports, setReports] = useState<{ id: string; status: string | null; created_at: string | null; title: string | null; reporter?: { fullname: string | null; username: string | null } | null }[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const supabase = getSupabaseBrowserClient()

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const [profilesRes, quizzesRes, reportsRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .abortSignal(controller.signal),
          supabase
            .from("quizzes")
            .select("id, created_at, title")
            .abortSignal(controller.signal),
          supabase
            .from("reports")
            .select("id, status, created_at, title, reporter:profiles!reports_reporter_id_fkey(fullname, username)")
            .order("created_at", { ascending: false })
            .abortSignal(controller.signal),
        ])

        if (profilesRes.error) throw profilesRes.error
        if (quizzesRes.error) throw quizzesRes.error
        if (reportsRes.error) throw reportsRes.error

        setProfiles(profilesRes.data ?? [])
        setQuizzes(quizzesRes.data ?? [])
        setReports(
          (reportsRes.data ?? []).map((r) => ({
            ...r,
            reporter: Array.isArray(r.reporter) ? r.reporter[0] : r.reporter,
          }))
        )
        setLoading(false)
      } catch (err) {
        if (err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"))) {
          return
        }
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [])

  const stats = useMemo<DashboardStats>(() => {
    const totalUsers = profiles.length
    const totalAdmins = profiles.filter((p) => {
      const role = p.role as string | null
      return role === "admin" || role === "Admin"
    }).length
    const activeUsers = profiles.filter((p) => !p.is_blocked).length
    const blockedUsers = profiles.filter((p) => p.is_blocked === true).length
    const totalQuizzes = quizzes.length
    const pendingReports = reports.filter((r) => r.status === "pending" || r.status === "Pending").length

    return {
      totalUsers,
      totalAdmins,
      totalQuizzes,
      pendingReports,
      activeUsers,
      blockedUsers,
    }
  }, [profiles, quizzes, reports])

  const recentActivity = useMemo<RecentActivity[]>(() => {
    const activities: RecentActivity[] = []

    // Get recent reports
    reports.slice(0, 3).forEach((report) => {
      const reporterName = report.reporter?.fullname || report.reporter?.username || "Unknown"
      activities.push({
        id: `report-${report.id}`,
        action: report.title || "Report submitted",
        user: reporterName,
        time: formatTimeAgo(report.created_at),
        type: "support",
      })
    })

    // Get recent quizzes
    quizzes
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 2)
      .forEach((quiz) => {
        activities.push({
          id: `quiz-${quiz.id}`,
          action: `Quiz created: ${quiz.title || "Untitled"}`,
          user: "Creator",
          time: formatTimeAgo(quiz.created_at),
          type: "content",
        })
      })

    // Get recent users
    profiles
      .filter((p) => p.last_active)
      .sort((a, b) => new Date((b.last_active as string) || 0).getTime() - new Date((a.last_active as string) || 0).getTime())
      .slice(0, 2)
      .forEach((profile, index) => {
        activities.push({
          id: `user-${index}`,
          action: "User active",
          user: (profile.fullname as string) || (profile.username as string) || (profile.email as string) || "Unknown",
          time: formatTimeAgo(profile.last_active as string | null),
          type: "user",
        })
      })

    return activities.slice(0, 5)
  }, [profiles, quizzes, reports])

  const userGrowthData = useMemo<UserGrowthData[]>(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const last6Months: UserGrowthData[] = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = monthNames[date.getMonth()]

      const usersInMonth = profiles.filter((p) => {
        if (!p.last_active) return false
        const activeDate = new Date(p.last_active as string)
        const activeMonthKey = `${activeDate.getFullYear()}-${String(activeDate.getMonth() + 1).padStart(2, "0")}`
        return activeMonthKey === monthKey
      }).length

      last6Months.push({
        month: monthName,
        users: usersInMonth,
      })
    }

    return last6Months
  }, [profiles])

  return { stats, recentActivity, userGrowthData, loading, error }
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Unknown"

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}
