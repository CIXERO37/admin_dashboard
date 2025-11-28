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
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, category, questions, is_hidden, is_public, created_at, language")
        .order("created_at", { ascending: false })
        .abortSignal(controller.signal)

      if (error) {
        setError(error.message)
        setData([])
      } else {
        setData(data ?? [])
      }

      setLoading(false)
    }

    fetchQuizzes()

    return () => controller.abort()
  }, [])

  return { data, loading, error }
}

