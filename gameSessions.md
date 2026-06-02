## Gambaran Umum Game Sessions

**Game Sessions** merupakan modul halaman untuk mengaudit log sesi kuis permainan yang pernah dibuat maupun yang tengah berstatus berjalan (*ongoing*). Modul ini membekali administrator kapabilitas inspeksi daftar sesi melalui filter status, nama aplikasi, jumlah kuis, kategori, dan rentang durasi.

### Bagian-Bagian Utama

1. **Data Source (Server-Side Fetching)** - Data riwayat tabel sesi game diload (diambil) dari Supabase menggunakan fungsi utilitas `fetchGameSessions` pada saat proses SSR. Resolusi datanya dipotong menggunakan page size sebesar 15 record per kueri. Objek *response* mengembalikan agregasi yang mencakup total rekaman, total halaman, daftar sesi, serta indikator state *current page*.

2. **Komponen Tabel & Navigasi**
   - **Tabel Sesi Game (`GameSessionsTable`)** - Komponen antarmuka yang mengelola daftar row kuis yang dimuat. Melalui modul komponen ini, parameter data awal (`initialData`) dan filter turunan diproses sebelum di-render sebagai tabel interaktif.
   - **URL Query Parameters** - Parameter pelacak kondisi halaman bersifat dependen sepenuhnya dengan query parameter URL (`page`, `search`, `status`, `application`, `questions`, `duration`, `sort`, `category`). Saat filter disetel lewat interaksi UI di komponen tabel, nilainya disinkronisasi ke string *searchParams* URL.
   - **Navigasi Detail** - Tautan ID record yang ada pada baris tabel bertindak sebagai parameter dinamis untuk melompat navigasinya ke halaman rincian (`game-sessions/[id]`), di mana admin bisa memantau statistik dan peringkat nilai pemain (leaderboard).

### Struktur File & Penghubungan

- **Halaman Game Sessions** - `src/app/(dashboard)/game-sessions/page.tsx`
- **Server Actions** - `src/features/game-sessions/actions.ts` - menaungi fungsionalitas fetch dan type agregasi sesi Supabase.
- **Tabel Sesi** - `src/features/game-sessions/game-sessions-table.tsx` - abstraksi form dan grid daftar interaktif di client-side.
- **Kolom Tabel** - `src/features/game-sessions/_components/game-session-columns.tsx` - struktur array pengaturan properti setiap tipe kolom.
- **Hook Tabel** - `src/features/game-sessions/_hooks/use-game-sessions-table.ts`
- **Tipe Data** - `src/features/game-sessions/types/game-session.ts`

Contoh sintaks penghubung fungsi fetch data utama ke dalam tabel:

```tsx
import { fetchGameSessions } from "@/src/features/game-sessions/actions";
import { GameSessionsTable } from "@/src/features/game-sessions/game-sessions-table";
```

### Menambahkan Filter Baru

Untuk mengakomodasi kriteria penyaringan ekstra (seperti filter pembuat/host kuis), sisipkan tipe parameter baru di interface `PageProps`, oper parameter tersebut ke logika *query* pembangun pada `fetchGameSessions`, lalu perbaiki state form kontrol filter pada reaktivitas komponen `GameSessionsTable`. Sediakan fallback nilai properti (default) guna menghindari inkonsistensi saat URL diakses terpisah tanpa parameter pelacak.

---
*Deskripsi ini menegaskan pemanfaatan URL state pelacak serta interaktivitas rekapitulasi data array pada halaman histori sesi.*
