"use server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export interface GameSession {
  id: string;
  game_pin: string;
  host_id: string;
  quiz_id: string;
  quiz_title: string;
  status: string;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  participants: Array<{
    user_id?: string;
    nickname?: string;
    score?: number;
    avatar_url?: string; // Added avatar_url
  }> | null;
  participant_count: number;
  host?: {
    id: string;
    fullname: string;
    username: string;
    avatar_url: string;
  } | null;
  duration_minutes?: number;
  total_questions: number;
  application?: string;
}

interface FetchGameSessionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  application?: string;
  questions?: string; // "lt_10", "10_20", "gt_20"
  duration?: string; // "lt_5", "5_15", "gt_15"
  sort?: string; // "newest", "oldest", "duration_desc", "duration_asc"
}

export async function fetchGameSessions({
  page = 1,
  pageSize = 10,
  search = "",
  status = "all",
  application = "all",
  questions = "all",
  duration = "all",
  sort = "newest",
}: FetchGameSessionsParams = {}) {
  const supabase = await getSupabaseServerClient();

  try {
    let query = supabase
      .from("game_sessions")
      .select("*", { count: "exact" });

    // Apply Sorting
    switch (sort) {
        case "oldest":
            query = query.order("created_at", { ascending: true });
            break;
        case "duration_desc":
            query = query.order("duration_minutes", { ascending: false });
            break;
        case "duration_asc":
            query = query.order("duration_minutes", { ascending: true });
            break;
        case "questions_desc":
            query = query.order("total_questions", { ascending: false });
            break;
        case "newest":
        default:
            query = query.order("created_at", { ascending: false });
    }

    if (search) {
       query = query.ilike("game_pin", `%${search}%`);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (application && application !== "all") {
      query = query.ilike("application", `%${application}%`);
    }

    // Filter Questions
    if (questions && questions !== "all") {
        // Assume exact number for specific options like "5", "10"
        query = query.eq("total_questions", Number(questions));
    }

    // Filter Duration
    if (duration && duration !== "all") {
         // Assume exact number
         query = query.eq("duration_minutes", Number(duration));
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: sessions, error, count } = await query;

    if (error) throw error;

    if (!sessions || sessions.length === 0) {
      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        error: null,
      };
    }

    // Get host profiles
    const hostIds = new Set(sessions.map((s) => s.host_id).filter(Boolean));
    
    // Get participant user IDs
    const participantUserIds = new Set<string>();
    sessions.forEach(session => {
        if (Array.isArray(session.participants)) {
            session.participants.forEach((p: any) => {
                if (p.user_id) participantUserIds.add(p.user_id);
            });
        }
    });

    const allUserIds = [...new Set([...hostIds, ...participantUserIds])];

    const { data: profiles } = allUserIds.length > 0 
      ? await supabase
        .from("profiles")
        .select("id, fullname, username, avatar_url")
        .in("id", allUserIds)
      : { data: [] };

    const profileMap = new Map(profiles?.map((p) => [p.id, p]));

    const mappedSessions: GameSession[] = sessions.map((session) => {
      const rawParticipants = session.participants as any[];
      let participants: GameSession["participants"] = null;

      if (Array.isArray(rawParticipants)) {
          participants = rawParticipants.map(p => ({
              user_id: p.user_id,
              nickname: p.nickname,
              score: p.score,
              // Map avatar from profile if exists
              avatar_url: p.user_id ? profileMap.get(p.user_id)?.avatar_url : null
          }));
      }
      
      const quizTitle = session.quiz_detail?.title || "Untitled Quiz";
      let durationMinutes = session.total_time_minutes;
      
      if (!durationMinutes && session.started_at && session.ended_at) {
        const start = new Date(session.started_at);
        const end = new Date(session.ended_at);
        durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
        if (durationMinutes === 0) durationMinutes = 1;
      }

      // Calculate total questions from current_questions array
      const currentQuestions = session.current_questions as any[];
      const totalQuestions = Array.isArray(currentQuestions) ? currentQuestions.length : 0;

      return {
        id: session.id,
        game_pin: session.game_pin,
        host_id: session.host_id,
        quiz_id: session.quiz_id,
        quiz_title: quizTitle,
        status: session.status || "unknown",
        created_at: session.created_at,
        started_at: session.started_at,
        ended_at: session.ended_at,
        participants: participants,
        participant_count: Array.isArray(participants) ? participants.length : 0,
        host: profileMap.get(session.host_id) || null,
        duration_minutes: durationMinutes,
        total_questions: totalQuestions,
        application: session.application,
      };
    });

    return {
      data: mappedSessions,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
      currentPage: page,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching game sessions:", error);
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      error: "Failed to fetch game sessions",
    };
  }
}
