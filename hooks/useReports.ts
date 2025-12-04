"use client"

import { useEffect, useMemo, useState, useCallback } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import type { Report } from "@/types/supabase"

interface UseReportsOptions {
  contentType?: string
}

export function useReports(options?: UseReportsOptions) {
  const [data, setData] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
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
        admin_notes,
        evidence_url,
        resolved_at,
        resolved_by,
        created_at,
        updated_at,
        reporter:profiles!reports_reporter_id_fkey (
          id,
          username,
          email,
          fullname,
          avatar_url
        ),
        reported_user:profiles!reports_reported_user_id_fkey (
          id,
          username,
          fullname
        ),
        quiz:quizzes!reports_reported_content_id_fkey (
          id,
          title
        )
      `
      )
      .order("created_at", { ascending: false })

    if (options?.contentType) {
      query.eq("reported_content_type", options.contentType)
    }

    const { data, error } = await query

    if (error) {
      setError(error.message)
      setData([])
    } else {
      // Transform array relations to single objects
      const transformedData = (data ?? []).map((item) => ({
        ...item,
        reporter: Array.isArray(item.reporter) ? item.reporter[0] : item.reporter,
        reported_user: Array.isArray(item.reported_user) ? item.reported_user[0] : item.reported_user,
        quiz: Array.isArray(item.quiz) ? item.quiz[0] : item.quiz,
      })) as Report[]
      setData(transformedData)
    }

    setLoading(false)
  }, [options?.contentType])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const updateReport = useCallback(async (id: string, updates: Partial<Report>) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("reports")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (!error) {
      setData((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, ...updates } : report
        )
      )
    }

    return { error }
  }, [])

  const deleteReport = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("reports").delete().eq("id", id)

    if (!error) {
      setData((prev) => prev.filter((report) => report.id !== id))
    }

    return { error }
  }, [])

  const stats = useMemo(() => {
    const total = data.length
    const pending = data.filter((r) => r.status === "pending" || r.status === "Pending").length
    const inProgress = data.filter((r) => r.status === "in_progress" || r.status === "In Progress").length
    const resolved = data.filter((r) => r.status === "resolved" || r.status === "Resolved").length

    return { total, pending, inProgress, resolved }
  }, [data])

  return { data, loading, error, stats, updateReport, deleteReport, refetch: fetchReports }
}

