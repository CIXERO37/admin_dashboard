"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface Quiz {
  id: string
  title: string
  category: string | null
  questions: unknown[] | null
  is_hidden: boolean | null
  is_public: boolean | null
  created_at: string | null
  language: string | null
  creator?: {
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
  const supabase = await getSupabaseServerClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("quizzes")
    .select("id, title, category, questions, is_hidden, is_public, created_at, language, creator:profiles!creator_id(email, fullname, avatar_url)", { count: "exact" })

  if (search) {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`)
  }

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (visibility && visibility !== "all") {
    query = query.eq("is_public", visibility === "publik")
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
    .not("category", "is", null)

  const uniqueCategories = [...new Set(allCategories?.map((q) => q.category).filter(Boolean) as string[])].sort()

  return {
    data: data ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
    categories: uniqueCategories,
  }
}

export async function updateQuizVisibility(id: string, isPublic: boolean) {
  const supabase = await getSupabaseServerClient()

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

export async function deleteQuizAction(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting quiz:", error)
    return { error: error.message }
  }

  revalidatePath("/master/quiz")
  return { error: null }
}
