"use server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function getGameDashboardStats(timeRange: string = "this-year") {
  const supabase = await getSupabaseServerClient();

  // Date Logic
  const now = new Date();
  const currentYear = now.getFullYear();

  let startDate: string | undefined;
  let endDate: string | undefined;

  if (timeRange === "this-year") {
    startDate = new Date(currentYear, 0, 1).toISOString();
  } else if (timeRange === "last-year") {
    startDate = new Date(currentYear - 1, 0, 1).toISOString();
    endDate = new Date(currentYear, 0, 1).toISOString();
  }
  // 'all-time' or others: no filter

  // 1. Fetch sessions data (added quiz_id)
  let query = supabase
    .from("game_sessions")
    .select("created_at, total_time_minutes, application, host_id, participants, current_questions, quiz_id")
    .eq("status", "finished");

  if (startDate) {
    query = query.gte("created_at", startDate);
  }
  if (endDate) {
    query = query.lt("created_at", endDate);
  }

  const { data: sessions, error } = await query;

  // 2. Fetch Recent Activities (Last 5 finished sessions)
  const { data: recentSessions } = await supabase
    .from("game_sessions")
    .select(`
      id,
      created_at,
      quiz_title,
      total_questions,
      host:host_id (
        fullname,
        username,
        avatar_url
      )
    `)
    .eq("status", "finished")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching game stats:", error);
    return null;
  }

  // Calculate High Level Stats
  const totalSessions = sessions.length;

  let totalParticipants = 0;
  let totalDurationMinutes = 0;
  let totalQuestionsCount = 0;

  const sessionsByApp: Record<string, number> = {};
  const sessionsByDate: Record<string, number> = {};
  const hostCounts: Record<string, number> = {};
  const quizIdCounts: Record<string, number> = {};

  sessions.forEach(session => {
    // Participants
    const participants = session.participants as any[];
    if (Array.isArray(participants)) {
      totalParticipants += participants.length;
    }

    // Duration
    if (session.total_time_minutes) {
      totalDurationMinutes += session.total_time_minutes;
    }

    // Questions (Calculate from current_questions array length)
    const currentQuestions = session.current_questions as any[];
    if (Array.isArray(currentQuestions)) {
      totalQuestionsCount += currentQuestions.length;
    }

    // By App
    let app = session.application || "Unknown";
    app = app.replace(/\.com$/i, "").toUpperCase(); // Clean app name
    sessionsByApp[app] = (sessionsByApp[app] || 0) + 1;

    // By Date (Last 30 days filter could be applied here or in query)
    const date = new Date(session.created_at).toISOString().split('T')[0];
    sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;

    // Host
    if (session.host_id) {
      hostCounts[session.host_id] = (hostCounts[session.host_id] || 0) + 1;
    }

    // Quiz ID for category counting
    if (session.quiz_id) {
      quizIdCounts[session.quiz_id] = (quizIdCounts[session.quiz_id] || 0) + 1;
    }
  });

  const avgDuration = totalSessions > 0 ? Math.round(totalDurationMinutes / totalSessions) : 0;
  const avgQuestions = totalSessions > 0 ? Math.round(totalQuestionsCount / totalSessions) : 0;

  // Format Charts Data

  // 1. Trends (Last 7 Days for nicer view, or 30)
  // Let's create an array of last 7 days dates to ensure continuity
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    trendData.push({
      date: dateStr,
      count: sessionsByDate[dateStr] || 0
    });
  }

  // 2. Apps Distribution
  const appDistributionData = Object.entries(sessionsByApp).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  // 3. Top Hosts (Need to fetch names)
  const topHostIds = Object.entries(hostCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id);

  let topHosts: Array<{
    id: string;
    fullname: string;
    username: string;
    avatar_url: string;
    count: number;
  }> = [];

  // Collect all host IDs from sessions for location lookup
  const allHostIds = Object.keys(hostCounts);
  const hostLocationCounts: Record<string, { stateId: string | null; cityId: string | null; count: number }> = {};

  if (topHostIds.length > 0) {
    const { data: hosts } = await supabase
      .from("profiles")
      .select("id, fullname, username, avatar_url")
      .in("id", topHostIds);

    if (hosts) {
      topHosts = hosts.map(h => ({
        ...h,
        count: hostCounts[h.id]
      })).sort((a, b) => b.count - a.count);
    }
  }

  // 4. Top Categories (Fetch quiz categories based on quiz_ids)
  const quizIds = Object.keys(quizIdCounts);
  const categoryCounts: Record<string, number> = {};

  if (quizIds.length > 0) {
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("id, category")
      .in("id", quizIds);

    if (quizzes) {
      quizzes.forEach(quiz => {
        const category = quiz.category || "Uncategorized";
        // Count based on how many sessions used this quiz
        categoryCounts[category] = (categoryCounts[category] || 0) + (quizIdCounts[quiz.id] || 0);
      });
    }
  }

  const topCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 5. Top States & Top Cities (Based on host locations)
  const stateCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};

  if (allHostIds.length > 0) {
    // Fetch host profiles with their state and city
    const { data: hostProfiles } = await supabase
      .from("profiles")
      .select(`
        id,
        state:state_id (id, name),
        city:city_id (id, name),
        country:country_id (id, name)
      `)
      .in("id", allHostIds);

    if (hostProfiles) {
      hostProfiles.forEach((profile: any) => {
        const sessionCount = hostCounts[profile.id] || 0;

        // Count by state
        if (profile.state?.name) {
          stateCounts[profile.state.name] = (stateCounts[profile.state.name] || 0) + sessionCount;
        }

        // Count by city
        if (profile.city?.name) {
          cityCounts[profile.city.name] = (cityCounts[profile.city.name] || 0) + sessionCount;
        }

        // Count by country
        if (profile.country?.name) {
          countryCounts[profile.country.name] = (countryCounts[profile.country.name] || 0) + sessionCount;
        }
      });
    }
  }

  const topStates = Object.entries(stateCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCities = Object.entries(cityCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    kpi: {
      totalSessions,
      totalParticipants,
      avgDuration,
      avgQuestions
    },
    charts: {
      trend: trendData,
      apps: appDistributionData,
      topHosts,
      recentActivity: recentSessions || [],
      topCategories,
      topStates,
      topCities,
      topCountries
    }
  };
}
