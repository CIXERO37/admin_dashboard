## Gambaran Umum Game Sessions

**Game Sessions** berfungsi sebagai halaman daftar sesi game yang pernah dibuat atau sedang berjalan. Administrator dapat memantau sesi berdasarkan status, aplikasi, jumlah pertanyaan, durasi, kategori, pencarian, dan urutan data.

### Bagian-Bagian Utama

1. **Query Parameter Halaman** - Halaman membaca `page`, `search`, `status`, `application`, `questions`, `duration`, `sort`, dan `category` dari `searchParams`.

2. **Server-Side Fetching** - Data sesi diambil lewat `fetchGameSessions` dengan `pageSize` 15. Hasilnya mencakup data sesi, total halaman, halaman aktif, dan total record.

3. **Tabel Sesi Game** - `GameSessionsTable` menerima data awal dan state filter aktif, lalu menampilkan daftar sesi beserta kontrol pagination dan filter.

4. **Navigasi Detail** - Setiap record sesi dapat diarahkan ke halaman detail `game-sessions/[id]` untuk melihat leaderboard dan statistik sesi.

### Struktur File & Penghubungan

- **Halaman Game Sessions** - `src/app/(dashboard)/game-sessions/page.tsx`.
- **Server Actions** - `src/features/game-sessions/actions.ts`.
- **Tabel Sesi** - `src/features/game-sessions/game-sessions-table.tsx`.
- **Kolom Tabel** - `src/features/game-sessions/_components/game-session-columns.tsx`.
- **Hook Tabel** - `src/features/game-sessions/_hooks/use-game-sessions-table.ts`.
- **Tipe Data** - `src/features/game-sessions/types/game-session.ts`.

Contoh penghubungan utama:

```tsx
import { fetchGameSessions } from "@/src/features/game-sessions/actions";
import { GameSessionsTable } from "@/src/features/game-sessions/game-sessions-table";
```

### Menambahkan Filter Baru

Tambahkan parameter baru di `PageProps`, teruskan ke `fetchGameSessions`, lalu perbarui query action dan kontrol filter di `GameSessionsTable`. Pastikan nilai default tetap stabil agar URL tanpa query tetap valid.

---
*Deskripsi ini menjelaskan alur daftar sesi game dari query URL sampai render tabel dan navigasi detail.*
