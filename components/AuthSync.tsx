"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export function AuthSync() {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let currentUserId: string | null | undefined = undefined;

    // Ambil ID awal saat komponen pertama kali mount
    supabase.auth.getUser().then(({ data }) => {
      currentUserId = data.user?.id || null;
    });

    // Cek apakah ada perubahan session (terutama karena beda subdomain)
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const newUserId = user?.id || null;

        // Jika currentUserId sudah terinisiasi (bukan undefined) dan ID-nya berubah
        if (currentUserId !== undefined && newUserId !== currentUserId) {
          console.log("[AuthSync] Session change detected across tabs/subdomains! Reloading...");
          window.location.reload();
        }
      } catch (err) {
        console.error("[AuthSync] Error checking session:", err);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", checkSession);

    // Tetap listen untuk event di subdomain yang sama
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        checkSession();
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", checkSession);
    };
  }, []);

  return null;
}
