"use client"

import { useEffect, useMemo, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import type { Report } from "@/types/supabase"

interface UseReportsOptions {
  contentType?: string
}

export function useReports(options?: UseReportsOptions) {
  const [data, setData] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const supabase = getSupabaseBrowserClient()

    async function fetchReports() {
      setLoading(true)
      setError(null)

      const query = supabase
        .from("reports")
        .select(
          `
          id,
          report_type,
          reported_content_type,
          reported_content_id,
          reporter_id,
          reported_user_id,
          title,
          description,
          status,
          created_at,
          reporter:profiles!reports_reporter_id_fkey (
            id,
            username,
            email,
            fullname
          ),
          reported_user:profiles!reports_reported_user_id_fkey (
            id,
            username
          ),
          quiz:quizzes!reports_reported_content_id_fkey (
            id,
            title
          )
        `
        )
        .order("created_at", { ascending: false })
        .abortSignal(controller.signal)

      if (options?.contentType) {
        query.eq("reported_content_type", options.contentType)
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
        setData([])
      } else {
        setData(data ?? [])
      }

      setLoading(false)
    }

    fetchReports()

    return () => controller.abort()
  }, [options?.contentType])

  const stats = useMemo(() => {
    const total = data.length
    const pending = data.filter((r) => r.status === "pending" || r.status === "Pending").length
    const inProgress = data.filter((r) => r.status === "in_progress" || r.status === "In Progress").length
    const resolved = data.filter((r) => r.status === "resolved" || r.status === "Resolved").length

    return { total, pending, inProgress, resolved }
  }, [data])

  return { data, loading, error, stats }
}

