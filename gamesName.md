## Gambaran Umum Detail Game

**Detail Game** berfungsi sebagai halaman analitik per aplikasi game. Halaman ini menampilkan statistik sesi, top quizzes, status sesi, demografi pemain, lokasi, edukasi, dan daftar sesi terkait game tersebut.

### Bagian-Bagian Utama

1. **Parameter Nama Game** - Route membaca `name` dari URL dan mendecode-nya menjadi `appName`.

2. **Filter Waktu Detail** - Select menyediakan filter seperti today, yesterday, this week, this month, this year, dan all time. Helper `getDateRange` mengubah filter menjadi `start` dan `end`.

3. **Fetch Detail Game** - `fetchGameDetail` mengambil statistik dan daftar sesi, sedangkan `fetchPlayerDemographics` mengambil data demografi pemain.

4. **Kartu Statistik** - Menampilkan total sessions, players, completion rate, dan average duration.

5. **Insight Game** - Halaman menampilkan top quizzes, session status, gender distribution, player locations, education distribution, dan tabel sesi dengan pencarian lokal.

### Struktur File & Penghubungan

- **Halaman Detail Game** - `src/app/(dashboard)/games/[name]/page.tsx`.
- **Actions Detail Game** - `src/features/games/[name]/actions.ts`.
- **Player Map** - `src/features/games/[name]/player-map.tsx`.
- **Stat Card** - `src/components/dashboard/stat-card.tsx`.
- **Halaman Games** - `src/app/(dashboard)/games/page.tsx`.

Contoh penghubungan utama:

```tsx
import { fetchGameDetail, fetchPlayerDemographics } from "@/src/features/games/[name]/actions";
```

### Menambahkan Insight Baru

Tambahkan agregasi di action detail game, perluas tipe `GameDetailStats` atau `PlayerDemographics`, lalu render section baru di halaman detail. Pastikan filter waktu dipakai pada query baru.

---
*Deskripsi ini menjelaskan halaman detail game sebagai pusat analitik mendalam per aplikasi.*
