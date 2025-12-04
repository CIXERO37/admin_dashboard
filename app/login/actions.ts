"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function login(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const emailOrUsername = formData.get("email") as string
  const password = formData.get("password") as string

  if (!emailOrUsername || !password) {
    return { error: "Email/username dan password harus diisi" }
  }

  let email = emailOrUsername

  // Check if input is username (not email format)
  if (!emailOrUsername.includes("@")) {
    // Look up email by username
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", emailOrUsername)
      .single()

    if (!profile?.email) {
      return { error: "Username tidak ditemukan" }
    }
    email = profile.email
  }

  // Attempt login
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return { error: "Email/username atau password salah" }
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", email)
    .single()

  if (!profile || (profile.role !== "admin" && profile.role !== "Admin")) {
    // Sign out non-admin users
    await supabase.auth.signOut()
    return { error: "Akses ditolak. Hanya admin yang dapat masuk." }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function logout() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
