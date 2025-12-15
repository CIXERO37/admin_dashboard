"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export interface Quiz {
  id: string
  title: string
  description: string | null
  category: string | null
  questions: unknown[] | null
  is_hidden: boolean | null
  is_public: boolean | null
  created_at: string | null
  language: string | null
  status: string | null
  creator?: {
    id: string | null
    username: string | null
    email: string | null
    fullname: string | null
    avatar_url: string | null
  } | null
}

export interface QuizzesResponse {
  data: Quiz[]
  totalCount: number
  totalPages: number
  categories: string[]
}

interface FetchQuizzesParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  visibility?: string
}

export async function fetchQuizzes({
  page = 1,
  limit = 15,
  search = "",
  category = "all",
  visibility = "all",
}: FetchQuizzesParams): Promise<QuizzesResponse> {
  const supabase = getSupabaseAdminClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("quizzes")
    .select("id, title, description, category, questions, is_hidden, is_public, created_at, language, status, creator:profiles!creator_id(id, email, username, fullname, avatar_url)", { count: "exact" })
    .is("deleted_at", null)

  if (search) {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`)
  }

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (visibility && visibility !== "all") {
    if (visibility === "publik" || visibility === "private") {
      query = query.eq("is_public", visibility === "publik")
    } else if (visibility === "active") {
      query = query.or("status.is.null,status.neq.block")
    } else if (visibility === "block") {
      query = query.eq("status", "block")
    }
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching quizzes:", error)
    return { data: [], totalCount: 0, totalPages: 0, categories: [] }
  }

  const { data: allCategories } = await supabase
    .from("quizzes")
    .select("category")
    .is("deleted_at", null)
    .not("category", "is", null)

  const uniqueCategories = [...new Set(allCategories?.map((q) => q.category).filter(Boolean) as string[])].sort()

  const transformedData: Quiz[] = (data ?? []).map((item) => ({
    ...item,
    creator: Array.isArray(item.creator) ? item.creator[0] ?? null : item.creator,
  }))

  return {
    data: transformedData,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
    categories: uniqueCategories,
  }
}

export async function updateQuizVisibility(id: string, isPublic: boolean) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("quizzes")
    .update({ is_public: isPublic })
    .eq("id", id)

  if (error) {
    console.error("Error updating quiz:", error)
    return { error: error.message }
  }

  revalidatePath("/master/quiz")
  return { error: null }
}

export async function blockQuizAction(id: string) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("quizzes")
    .update({ status: "block" })
    .eq("id", id)

  if (error) {
    console.error("Error blocking quiz:", error)
    return { error: error.message }
  }

  revalidatePath("/master/quiz")
  return { error: null }
}

export async function fetchQuizById(id: string): Promise<{ data: Quiz | null; error: string | null }> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("quizzes")
    .select("id, title, description, category, questions, is_hidden, is_public, created_at, language, status, creator:profiles!creator_id(id, email, username, fullname, avatar_url)")
    .eq("id", id)
    .is("deleted_at", null)
    .single()

  if (error) {
    console.error("Error fetching quiz:", error)
    return { data: null, error: error.message }
  }

  const transformedData: Quiz = {
    ...data,
    creator: Array.isArray(data.creator) ? data.creator[0] ?? null : data.creator,
  }

  return { data: transformedData, error: null }
}

export async function deleteQuizAction(id: string) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("quizzes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error deleting quiz:", error)
    return { error: error.message }
  }

  revalidatePath("/master/quiz")
  revalidatePath("/trash-bin")
  return { error: null }
}
