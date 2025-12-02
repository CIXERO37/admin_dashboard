"use client"

import { useEffect, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import type { Quiz } from "@/types/supabase"

export function useQuizzes() {
  const [data, setData] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const supabase = getSupabaseBrowserClient()

    async function fetchQuizzes() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("quizzes")
          .select("id, title, category, questions, is_hidden, is_public, created_at, language, creator:profiles!creator_id(email, fullname, avatar_url)")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal)

        if (error) {
          if (error.message.includes("aborted") || error.name === "AbortError") {
            return
          }
          setError(error.message)
          setData([])
        } else {
          setData(
            (data ?? []).map((quiz) => ({
              ...quiz,
              creator: Array.isArray(quiz.creator) ? quiz.creator[0] : quiz.creator,
            }))
          )
        }

        setLoading(false)
      } catch (err) {
        if (err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"))) {
          return
        }
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchQuizzes()

    return () => controller.abort()
  }, [])

  const updateQuiz = async (id: string, updates: Partial<Quiz>) => {
    const supabase = getSupabaseBrowserClient()

    // Optimistic update
    setData((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))

    const { error } = await supabase.from("quizzes").update(updates).eq("id", id)

    if (error) {
      console.error("Error updating quiz:", error)
      return { error }
    }

    return { error: null }
  }

  const deleteQuiz = async (id: string) => {
    const supabase = getSupabaseBrowserClient()

    // Optimistic update
    setData((prev) => prev.filter((q) => q.id !== id))

    const { error } = await supabase.from("quizzes").delete().eq("id", id)

    if (error) {
      console.error("Error deleting quiz:", error)
      return { error }
    }

    return { error: null }
  }

  return { data, loading, error, updateQuiz, deleteQuiz }
}

