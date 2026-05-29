## Gambaran Umum Detail Game Session

**Detail Game Session** berfungsi sebagai halaman hasil dan metadata satu sesi game. Halaman ini menampilkan host, aplikasi, PIN, kategori, status, statistik sesi, dan leaderboard peserta.

### Bagian-Bagian Utama

1. **Parameter Session ID** - Route membaca `id` dari path `game-sessions/[id]`.

2. **Fetch Detail Sesi** - Data sesi diambil melalui `getGameSessionById(id)`.

3. **Debug Not Found** - Jika sesi tidak ditemukan, halaman menampilkan panel debug berisi ID yang dicari dan kemungkinan penyebab.

4. **Metadata Sesi** - Header menampilkan quiz title, host, application, game PIN, category, created date, dan badge status.

5. **Session Stats** - `SessionStats` menampilkan total players, average score, max score, jumlah pertanyaan, dan durasi sesi.

6. **Leaderboard Peserta** - Peserta diurutkan berdasarkan skor tertinggi dan durasi tercepat, lalu ditampilkan dalam tabel rank, player, time, dan score.

### Struktur File & Penghubungan

- **Halaman Detail Session** - `src/app/(dashboard)/game-sessions/[id]/page.tsx`.
- **Actions Session** - `src/features/game-sessions/actions.ts`.
- **Session Stats** - `src/features/game-sessions/[id]/session-stats.tsx`.
- **Statistic Button** - `src/features/game-sessions/[id]/statistic-button.tsx`.
- **Tabel UI** - `src/components/ui/table.tsx`.

Contoh penghubungan utama:

```tsx
import { getGameSessionById } from "@/src/features/game-sessions/actions";
import { SessionStats } from "@/src/features/game-sessions/[id]/session-stats";
```

### Menambahkan Data Detail Baru

Perluas query `getGameSessionById`, hitung nilai turunan di halaman atau helper, lalu tampilkan pada metadata, stats, atau tabel. Untuk data peserta, pertahankan sorting leaderboard agar ranking tetap deterministik.

---
*Deskripsi ini menjelaskan detail sesi game sebagai halaman hasil, statistik, dan leaderboard.*
