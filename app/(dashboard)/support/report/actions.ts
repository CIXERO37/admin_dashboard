"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface ReportProfile {
  id: string
  username: string | null
  email: string | null
  fullname: string | null
  avatar_url: string | null
}

export interface Report {
  id: string
  report_type: string | null
  reported_content_type: string | null
  reported_content_id: string | null
  reporter_id: string | null
  reported_user_id: string | null
  status: string | null
  priority?: string | null
  created_at: string | null
  updated_at?: string | null
  title: string | null
  description: string | null
  admin_notes?: string | null
  evidence_url?: string | null
  resolved_at?: string | null
  resolved_by?: string | null
  reporter?: ReportProfile | null
  reported_user?: ReportProfile | null
}

export interface ReportsResponse {
  data: Report[]
  totalCount: number
  totalPages: number
  stats: {
    total: number
    pending: number
    inProgress: number
    resolved: number
  }
}

interface FetchReportsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  type?: string
}

export async function fetchReports({
  page = 1,
  limit = 15,
  search = "",
  status = "all",
  type = "all",
}: FetchReportsParams): Promise<ReportsResponse> {
  const supabase = await getSupabaseServerClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("reports")
    .select("*", { count: "exact" })

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (status && status !== "all") {
    query = query.ilike("status", status)
  }

  if (type && type !== "all") {
    query = query.ilike("report_type", type)
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching reports:", error)
    return { data: [], totalCount: 0, totalPages: 0, stats: { total: 0, pending: 0, inProgress: 0, resolved: 0 } }
  }

  // Get unique profile IDs from reports
  const reporterIds = [...new Set((data ?? []).map(r => r.reporter_id).filter(Boolean))] as string[]
  const reportedUserIds = [...new Set((data ?? []).map(r => r.reported_user_id).filter(Boolean))] as string[]
  const allProfileIds = [...new Set([...reporterIds, ...reportedUserIds])]

  // Fetch profiles
  let profilesMap: Record<string, ReportProfile> = {}
  if (allProfileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, email, fullname, avatar_url")
      .in("id", allProfileIds)

    if (profiles) {
      profilesMap = profiles.reduce((acc, p) => {
        acc[p.id] = p
        return acc
      }, {} as Record<string, ReportProfile>)
    }
  }

  // Get stats
  const { data: allReports } = await supabase
    .from("reports")
    .select("status")

  const stats = {
    total: allReports?.length ?? 0,
    pending: allReports?.filter(r => r.status?.toLowerCase() === "pending").length ?? 0,
    inProgress: allReports?.filter(r => r.status?.toLowerCase() === "in progress").length ?? 0,
    resolved: allReports?.filter(r => r.status?.toLowerCase() === "resolved").length ?? 0,
  }

  // Combine reports with profiles
  const processedData: Report[] = (data ?? []).map(report => ({
    ...report,
    reporter: report.reporter_id ? profilesMap[report.reporter_id] || null : null,
    reported_user: report.reported_user_id ? profilesMap[report.reported_user_id] || null : null,
  }))

  return {
    data: processedData,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
    stats,
  }
}

export async function updateReportAction(id: string, updates: Record<string, unknown>) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("reports")
    .update(updates)
    .eq("id", id)

  if (error) {
    console.error("Error updating report:", error)
    return { error: error.message }
  }

  revalidatePath("/support/report")
  return { error: null }
}

export async function deleteReportAction(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting report:", error)
    return { error: error.message }
  }

  revalidatePath("/support/report")
  return { error: null }
}
