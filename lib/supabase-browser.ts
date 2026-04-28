"use client"

import { createBrowserClient } from "@supabase/ssr"

export const getSupabaseBrowserClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  const isProd = typeof window !== "undefined" && window.location.hostname.endsWith("gameforsmart.com");

  return createBrowserClient(url, key, {
      cookieOptions: {
          domain: isProd ? ".gameforsmart.com" : undefined,
          path: "/",
          sameSite: "lax",
          secure: isProd,
      }
  })
}

