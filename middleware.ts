import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const host = request.headers.get("host") || "";
  const isProdDomain = host.endsWith("gameforsmart.com");
  const isVercel = host.endsWith(".vercel.app");
  const isNgrok = host.includes("ngrok-free.app") || host.includes("ngrok.io");
  const isSecureContext = isProdDomain || isVercel || isNgrok;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              secure: isSecureContext,
              sameSite: "lax" as const,
              ...(isProdDomain && { domain: ".gameforsmart.com" }),
            };
            supabaseResponse.cookies.set(name, value, cookieOptions)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false;
  if (user) {
    // Verifikasi role user di database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .single()

    if (profile && (profile.role === "admin" || profile.role === "Admin")) {
      isAdmin = true;
    }
  }

  const isLoginPage = request.nextUrl.pathname === "/login"
  const isWebhook = request.nextUrl.pathname.startsWith("/api/githubWebhook")
  const isPaymentWebhook = request.nextUrl.pathname.startsWith("/api/payment/webhook") 
  const isCreateInvoice = request.nextUrl.pathname.startsWith("/api/payment/create-invoice")

  // If not logged in and not on login page (and not webhook), redirect to login
  if (!user && !isLoginPage && !isWebhook && !isPaymentWebhook && !isCreateInvoice) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    // Opsional: tambahkan param error biar bisa ditangkap oleh UI (jika ada)
    url.searchParams.set("error", "unauthorized")
    return NextResponse.redirect(url)
  }

  // Jika sudah admin dan di halaman login -> langsung masuk dashboard
  if (isAdmin && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/githubWebhook|api/payment/webhook|api/payment/create-invoice|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
