"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"

export interface GameDetailSession {
    id: string
    quiz_id: string | null
    quiz_title: string | null
    quiz_category: string | null
    host_id: string | null
    game_pin: string | null
    status: string
    difficulty: string | null
    total_time_minutes: number | null
    participant_count: number
    created_at: string
    started_at: string | null
    ended_at: string | null
}

export interface GameDetailStats {
    total_sessions: number
    total_players: number
    unique_hosts: number
    finished_sessions: number
    active_sessions: number
    waiting_sessions: number
    avg_players_per_session: number
    avg_duration_minutes: number
    top_quizzes: { title: string; category: string | null; count: number }[]
    top_hosts: { id: string; count: number }[]
    difficulty_breakdown: { difficulty: string; count: number }[]
}

export interface PlayerLocationData {
    country: string
    iso3: string
    numeric_code: string | null
    latitude: number
    longitude: number
    count: number
}

export interface PlayerDemographics {
    locations: PlayerLocationData[]
    grades: { grade: string; count: number }[]
    genders: { gender: string; count: number }[]
}

export async function fetchGameDetail(
    appName: string,
    startDate?: string,
    endDate?: string
): Promise<{
    stats: GameDetailStats
    sessions: GameDetailSession[]
    error: string | null
}> {
    const supabase = await getSupabaseServerClient()

    let query = supabase
        .from("game_sessions")
        .select("id, quiz_id, host_id, game_pin, status, difficulty, total_time_minutes, participants, quiz_detail, created_at, started_at, ended_at")
        .eq("application", appName)

    if (startDate) query = query.gte("created_at", startDate)
    if (endDate) query = query.lte("created_at", endDate)

    const { data: sessions, error } = await query.order("created_at", { ascending: false })

    if (error) {
        return {
            stats: emptyStats(),
            sessions: [],
            error: error.message,
        }
    }

    // Aggregate stats
    let totalPlayers = 0
    let finishedCount = 0
    let activeCount = 0
    let waitingCount = 0
    const hosts = new Set<string>()
    let totalDuration = 0
    let durationCount = 0
    const quizMap = new Map<string, { title: string; category: string | null; count: number }>()
    const hostCountMap = new Map<string, number>()
    const difficultyMap = new Map<string, number>()

    const mappedSessions: GameDetailSession[] = []

    for (const s of sessions || []) {
        const participants = s.participants as unknown[]
        const pCount = Array.isArray(participants) ? participants.length : 0
        totalPlayers += pCount

        if (s.status === "finished") finishedCount++
        if (s.status === "active") activeCount++
        if (s.status === "waiting") waitingCount++

        if (s.host_id) {
            hosts.add(s.host_id)
            hostCountMap.set(s.host_id, (hostCountMap.get(s.host_id) || 0) + 1)
        }

        if (s.started_at && s.ended_at) {
            const dur = (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 60000
            if (dur > 0 && dur < 600) {
                totalDuration += dur
                durationCount++
            }
        }

        const quizDetail = s.quiz_detail as Record<string, unknown> | null
        const quizTitle = (quizDetail?.title as string) || "Unknown Quiz"
        const quizCategory = (quizDetail?.category as string) || null
        const quizId = s.quiz_id as string || quizTitle

        const existing = quizMap.get(quizId)
        if (existing) {
            existing.count++
        } else {
            quizMap.set(quizId, { title: quizTitle, category: quizCategory, count: 1 })
        }

        const diff = (s.difficulty as string) || "unknown"
        difficultyMap.set(diff, (difficultyMap.get(diff) || 0) + 1)

        mappedSessions.push({
            id: s.id,
            quiz_id: s.quiz_id,
            quiz_title: quizTitle,
            quiz_category: quizCategory,
            host_id: s.host_id,
            game_pin: s.game_pin,
            status: s.status,
            difficulty: s.difficulty,
            total_time_minutes: s.total_time_minutes,
            participant_count: pCount,
            created_at: s.created_at,
            started_at: s.started_at,
            ended_at: s.ended_at,
        })
    }

    const total = sessions?.length || 0

    const topQuizzes = Array.from(quizMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    const topHosts = Array.from(hostCountMap.entries())
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    const difficultyBreakdown = Array.from(difficultyMap.entries())
        .map(([difficulty, count]) => ({ difficulty, count }))
        .sort((a, b) => b.count - a.count)

    return {
        stats: {
            total_sessions: total,
            total_players: totalPlayers,
            unique_hosts: hosts.size,
            finished_sessions: finishedCount,
            active_sessions: activeCount,
            waiting_sessions: waitingCount,
            avg_players_per_session: total > 0 ? Math.round(totalPlayers / total) : 0,
            avg_duration_minutes: durationCount > 0 ? Math.round(totalDuration / durationCount) : 0,
            top_quizzes: topQuizzes,
            top_hosts: topHosts,
            difficulty_breakdown: difficultyBreakdown,
        },
        sessions: mappedSessions,
        error: null,
    }
}

export async function fetchPlayerDemographics(
    appName: string,
    startDate?: string,
    endDate?: string
): Promise<PlayerDemographics> {
    const supabase = await getSupabaseServerClient()

    // 1) Get all sessions for this app in the date range
    let query = supabase
        .from("game_sessions")
        .select("participants")
        .eq("application", appName)

    if (startDate) query = query.gte("created_at", startDate)
    if (endDate) query = query.lte("created_at", endDate)

    const { data: sessions } = await query

    // 2) Extract unique user IDs from participants
    const userIds = new Set<string>()
    for (const s of sessions || []) {
        const participants = s.participants as Array<{ user_id?: string }> | null
        if (Array.isArray(participants)) {
            for (const p of participants) {
                if (p.user_id) userIds.add(p.user_id)
            }
        }
    }

    if (userIds.size === 0) {
        return { locations: [], grades: [], genders: [] }
    }

    // 3) Fetch profiles with country info for those users (batch in chunks of 200)
    const userIdArr = Array.from(userIds)
    const allProfiles: Array<{
        country_id: number | null
        grade: string | null
        gender: string | null
    }> = []

    for (let i = 0; i < userIdArr.length; i += 200) {
        const chunk = userIdArr.slice(i, i + 200)
        const { data: profiles } = await supabase
            .from("profiles")
            .select("country_id, grade, gender")
            .in("id", chunk)
        if (profiles) allProfiles.push(...profiles)
    }

    // 4) Get country data for all country_ids found
    const countryIds = [...new Set(allProfiles.filter(p => p.country_id).map(p => p.country_id!))]
    const countryMap = new Map<number, { name: string; iso3: string; numeric_code: string | null; lat: number; lng: number }>()

    if (countryIds.length > 0) {
        const { data: countries } = await supabase
            .from("countries")
            .select("id, name, iso3, numeric_code, latitude, longitude")
            .in("id", countryIds)

        for (const c of countries || []) {
            countryMap.set(c.id, {
                name: c.name,
                iso3: c.iso3,
                numeric_code: c.numeric_code ? String(c.numeric_code).padStart(3, "0") : null,
                lat: c.latitude,
                lng: c.longitude,
            })
        }
    }

    // 5) Aggregate location counts
    const locationCounts = new Map<number, number>()
    const gradeMap = new Map<string, number>()
    const genderMap = new Map<string, number>()

    for (const p of allProfiles) {
        if (p.country_id) {
            locationCounts.set(p.country_id, (locationCounts.get(p.country_id) || 0) + 1)
        }
        const grade = p.grade || "Unknown"
        gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1)

        const gender = p.gender || "Unknown"
        genderMap.set(gender, (genderMap.get(gender) || 0) + 1)
    }

    const locations: PlayerLocationData[] = []
    for (const [countryId, count] of locationCounts) {
        const country = countryMap.get(countryId)
        if (country) {
            locations.push({
                country: country.name,
                iso3: country.iso3,
                numeric_code: country.numeric_code,
                latitude: country.lat,
                longitude: country.lng,
                count,
            })
        }
    }
    locations.sort((a, b) => b.count - a.count)

    const grades = Array.from(gradeMap.entries())
        .map(([grade, count]) => ({ grade, count }))
        .sort((a, b) => b.count - a.count)

    const genders = Array.from(genderMap.entries())
        .map(([gender, count]) => ({ gender, count }))
        .sort((a, b) => b.count - a.count)

    return { locations, grades, genders }
}

function emptyStats(): GameDetailStats {
    return {
        total_sessions: 0,
        total_players: 0,
        unique_hosts: 0,
        finished_sessions: 0,
        active_sessions: 0,
        waiting_sessions: 0,
        avg_players_per_session: 0,
        avg_duration_minutes: 0,
        top_quizzes: [],
        top_hosts: [],
        difficulty_breakdown: [],
    }
}
