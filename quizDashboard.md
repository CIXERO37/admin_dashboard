## Gambaran Umum Dashboard Quiz

**Dashboard Quiz** berfungsi sebagai pusat analitik untuk konten quiz. Halaman ini menampilkan jumlah quiz, distribusi visibilitas, jumlah approval tertunda, dan visualisasi statistik berdasarkan periode.

### Bagian-Bagian Utama

1. **Filter Rentang Waktu** - Select menyediakan pilihan `this-year`, `last-year`, dan `all`. Filter dipakai untuk menyaring quiz berdasarkan `created_at`.

2. **Kartu Statistik Quiz** - Kartu menampilkan total quiz, quiz publik, quiz pending approval, dan quiz private. Setiap kartu memakai `StatCard` dan sebagian memiliki link ke halaman operasional terkait.

3. **Perhitungan Data Client-Side** - Data quiz berasal dari `useDashboardData`, sementara jumlah sesi game tambahan berasal dari `useGameStats`. Halaman menggabungkan loading state dari dua sumber ini.

4. **Chart Statistik Quiz** - `QuizStatsCharts` menerima quiz terfilter, profil pengguna, jumlah sesi, dan status loading untuk menampilkan visualisasi lanjutan.

### Struktur File & Penghubungan

- **Halaman Dashboard Quiz** - `src/app/(dashboard)/quiz/dashboard/page.tsx`.
- **Hook Statistik Game Quiz** - `src/features/quiz/dashboard/_hooks/useGameStats.ts`.
- **Store Dashboard** - `contexts/dashboard-store`.
- **Stat Card** - `src/components/dashboard/stat-card.tsx`.
- **Chart Quiz** - `src/components/dashboard/quiz-stats-charts.tsx`.

Contoh penghubungan utama:

```tsx
import { useDashboardData } from "@/contexts/dashboard-store";
import { QuizStatsCharts } from "@/components/dashboard/quiz-stats-charts";
```

### Menambahkan Metrik Baru

Tambahkan perhitungan dari `filteredQuizzes` atau hook data baru, lalu render melalui `StatCard` atau `QuizStatsCharts`. Jika metrik bergantung pada periode, gunakan helper tanggal yang sama agar hasilnya konsisten.

---
*Deskripsi ini menjelaskan sumber data, perhitungan statistik, dan visualisasi utama dashboard quiz.*
