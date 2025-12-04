"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

interface CurrentUser {
  id: string
  email: string | null
  username: string | null
  fullname: string | null
  avatar_url: string | null
  role: string | null
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    async function fetchUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          setUser(null)
          setLoading(false)
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, username, fullname, avatar_url, role")
          .eq("id", authUser.id)
          .single()

        if (profile) {
          setUser(profile)
        } else {
          setUser({
            id: authUser.id,
            email: authUser.email ?? null,
            username: null,
            fullname: null,
            avatar_url: null,
            role: null,
          })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
