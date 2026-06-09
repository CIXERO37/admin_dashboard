"use client" // Error components must be Client Components
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error ini ke service error monitoring seperti Sentry jika ada,
    // atau sekadar console.error agar developer bisa melihat akar masalahnya
    console.error("Dashboard Global Error Boundary Caught:", error)
  }, [error])

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Icon Wrapper dengan efek warna Error */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
      </div>
      
      {/* Pesan Teks */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Ups, Terjadi Kesalahan!</h2>
        <p className="max-w-[500px] text-muted-foreground mx-auto">
          Sistem mendapati masalah saat mencoba memuat atau memproses halaman ini. Hal ini mungkin disebabkan oleh gangguan koneksi atau *query* database yang gagal.
        </p>
      </div>

      {/* Aksi/Tombol */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button onClick={() => reset()} size="lg" className="gap-2 w-full sm:w-auto">
          <RefreshCcw className="h-4 w-4" />
          Coba Muat Ulang
        </Button>
        
        <Button asChild variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
      
      {/* (Opsional) Mode Developer: Tampilkan error message detail hanya di lokal */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 max-w-[600px] p-4 bg-muted/50 rounded-lg border text-left overflow-auto text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">Developer Logs:</p>
          <code className="break-words">
            {error.message || "Unknown error occurred"}
          </code>
        </div>
      )}
    </div>
  )
}
