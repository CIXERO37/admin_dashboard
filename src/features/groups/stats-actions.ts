"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

// Fetch group category distribution
export async function fetchGroupCategoryCounts(timeRange: "this-year" | "last-year" | "all" = "all") {
  const supabase = getSupabaseAdminClient()
  
  // Fetch all groups categories
  let query = supabase
    .from("groups")
    .select("category")
    .is("deleted_at", null)

  if (timeRange !== "all") {
    const now = new Date()
    const currentYear = now.getFullYear()
    
    if (timeRange === "this-year") {
      const startOfYear = new Date(currentYear, 0, 1).toISOString()
      const endOfYear = new Date(currentYear + 1, 0, 1).toISOString()
      query = query.gte("created_at", startOfYear).lt("created_at", endOfYear)
    } else if (timeRange === "last-year") {
      const startOfLastYear = new Date(currentYear - 1, 0, 1).toISOString()
      const endOfLastYear = new Date(currentYear, 0, 1).toISOString()
      query = query.gte("created_at", startOfLastYear).lt("created_at", endOfLastYear)
    }
  }

  const { data, error } = await query

  if (error || !data) {
    console.error("Error fetching group categories:", error)
    return []
  }

  // categoryMapping for normalization (copied from fetchGroups logic)
  const categoryMapping: Record<string, string> = {
    "Kampus": "Campus",
    "Kantor": "Office",
    "Keluarga": "Family",
    "Komunitas": "Community",
    "Masjid": "Mosque",
    "Musholla": "Mosque",
    "Pesantren": "Islamic Boarding School",
    "Sekolah": "School",
    "Umum": "General",
    "Lainnya": "Other"
  }

  const counts: Record<string, number> = {}

  data.forEach((group: { category: string | null }) => {
    let cat = group.category || "Other"
    // Normalize if needed (optional, but good for consistency)
    // For now simple aggregation, assuming data is mostly clean or English
    // Checking if simple mapping exists
    if (categoryMapping[cat]) {
      cat = categoryMapping[cat]
    }
    counts[cat] = (counts[cat] || 0) + 1
  })

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5
}
