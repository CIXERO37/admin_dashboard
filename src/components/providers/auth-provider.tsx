"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

interface Profile {
  id: string
  username: string
  email: string
  role: string
  fullname?: string
  avatar_url?: string
}

interface AuthContextType {
  user: any | null
  profile: Profile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const pathname = usePathname()

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .single()

    if (error || !data) return null
    return data as Profile
  }

  const checkAdminAccess = (profile: Profile | null) => {
    // Only check access if we are not on the login page
    if (pathname === "/login") return true

    const isAdmin = profile?.role?.toLowerCase() === "admin"
    if (!isAdmin) {
      console.warn("Akses ditolak: User bukan admin")
      supabase.auth.signOut().then(() => {
        router.push("/login")
      })
      return false
    }
    return true
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        
        if (currentUser) {
          const userProfile = await loadProfile(currentUser.id)
          if (checkAdminAccess(userProfile)) {
            setUser(currentUser)
            setProfile(userProfile)
          }
        } else if (pathname !== "/login") {
          router.push("/login")
        }
      } catch (err) {
        console.error("Auth init error:", err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Sync antar tab (ketika user kembali ke tab ini)
    const handleSync = async () => {
      if (document.visibilityState === 'visible') {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session && pathname !== "/login") {
          router.push("/login")
          router.refresh()
        }
      }
    }

    window.addEventListener('visibilitychange', handleSync)
    window.addEventListener('focus', handleSync)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const userProfile = await loadProfile(session.user.id)
        if (checkAdminAccess(userProfile)) {
          setUser(session.user)
          setProfile(userProfile)
          if (pathname === "/login") {
            router.push("/dashboard")
            router.refresh()
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        if (pathname !== "/login") {
          router.push("/login")
          router.refresh()
        }
      } else if (event === "USER_UPDATED" && session) {
        setUser(session.user)
        const userProfile = await loadProfile(session.user.id)
        setProfile(userProfile)
      }
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('visibilitychange', handleSync)
      window.removeEventListener('focus', handleSync)
    }
  }, [pathname, router]) // supabase is stable, no need to include

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
