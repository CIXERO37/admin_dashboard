"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

// Fetch group category distribution
export async function fetchGroupCategoryCounts() {
  const supabase = getSupabaseAdminClient()
  
  // Fetch all groups categories
  const { data, error } = await supabase
    .from("groups")
    .select("category")
    .is("deleted_at", null)

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
