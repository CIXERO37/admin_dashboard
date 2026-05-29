"use server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function getCompetitionDashboardStats() {
  try {
    const supabase = await getSupabaseServerClient();
    
    // 1. Fetch competitions
    const { data: competitions, error: compError } = await supabase
      .from("competitions")
      .select("id, title, status, category, registration_start_date, registration_end_date, final_end_date, poster_url")
      .order("created_at", { ascending: false });

    if (compError) throw compError;

    // 2. Fetch categories
    const { data: categories, error: catError } = await supabase
      .from("competition_categories")
      .select("id, name, status");

    if (catError) throw catError;

    // 3. Fetch participants
    const { data: participantsData, count: participantsCount, error: partError } = await supabase
      .from("competition_participants")
      .select("competition_id", { count: "exact" });

    if (partError) throw partError;

    // Calculate metrics
    const totalCompetitions = competitions?.length || 0;
    const publishedCompetitions = competitions?.filter(c => c.status === "published").length || 0;
    const draftCompetitions = competitions?.filter(c => c.status === "draft").length || 0;

    const totalCategories = categories?.length || 0;
    const activeCategories = categories?.filter(c => c.status === "active").length || 0;
    const inactiveCategories = categories?.filter(c => c.status === "inactive").length || 0;

    const now = new Date().getTime();

    const ongoingCompetitions = competitions?.filter(c => {
      if (!c.registration_start_date) return false;
      const start = new Date(c.registration_start_date).getTime();
      const end = c.final_end_date ? new Date(c.final_end_date).getTime() : 
                  (c.registration_end_date ? new Date(c.registration_end_date).getTime() : null);
      if (!end) return start <= now;
      return start <= now && end >= now;
    }) || [];

    const comingSoonCompetitions = competitions?.filter(c => {
      if (!c.registration_start_date) return false;
      const start = new Date(c.registration_start_date).getTime();
      return start > now;
    }) || [];

    const completedCompetitions = competitions?.filter(c => {
      const end = c.final_end_date ? new Date(c.final_end_date).getTime() : 
                  (c.registration_end_date ? new Date(c.registration_end_date).getTime() : null);
      if (!end) return false;
      return end < now;
    }) || [];

    const participantsByComp = (participantsData || []).reduce((acc: any, p: any) => {
      acc[p.competition_id] = (acc[p.competition_id] || 0) + 1;
      return acc;
    }, {});

    const participantsChartData = (competitions || [])
      .map(c => ({
        title: c.title,
        participants: participantsByComp[c.id] || 0
      }))
      .filter(item => item.participants > 0)
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 5);

    const categoriesChartData = (categories || []).map(cat => {
      let count = 0;
      (competitions || []).forEach(c => {
        if (c.category) {
          const usedCats = c.category.split(",").map((s: string) => s.trim().toLowerCase());
          if (usedCats.includes(cat.name.toLowerCase())) {
            count++;
          }
        }
      });
      return { name: cat.name, count };
    }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

    return {
      stats: {
        totalCompetitions,
        publishedCompetitions,
        draftCompetitions,
        totalCategories,
        activeCategories,
        inactiveCategories,
        totalParticipants: participantsCount || 0,
        ongoingCount: ongoingCompetitions.length,
      },
      chartData: {
        categoriesChart: categoriesChartData,
        participantsChart: participantsChartData,
      },
      lists: {
        ongoing: ongoingCompetitions,
        comingSoon: comingSoonCompetitions,
        completed: completedCompetitions,
      },
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching competition dashboard stats:", error);
    return { stats: null, lists: null, error: error.message };
  }
}
