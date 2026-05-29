## Gambaran Umum Dashboard Game

**Dashboard Game** berfungsi sebagai pusat pemantauan performa seluruh aktivitas game. Halaman ini menampilkan ringkasan statistik sesi berdasarkan rentang waktu yang dipilih dan membantu administrator melihat tren penggunaan game secara cepat.

### Bagian-Bagian Utama

1. **Filter Rentang Waktu** - Parameter `timeRange` dibaca dari query string dan memiliki nilai default `this-year`. Filter ini diteruskan ke server action untuk mengambil agregasi sesuai periode.

2. **Ringkasan Statistik Game** - Data statistik diambil melalui `getGameDashboardStats(range)` dari modul feature game dashboard. Statistik mencakup performa sesi, jumlah pemain, penyelesaian game, dan metrik agregat lain yang dibutuhkan dashboard.

3. **Wrapper Client Dashboard** - Komponen `GameDashboardWrapper` menerima `initialData` dari server dan mengelola tampilan client-side. Saat data sedang diproses, halaman memakai `GameDashboardSkeleton` sebagai fallback.

4. **Visualisasi Dashboard** - Komponen dashboard feature menampilkan kartu metrik, chart, dan insight yang relevan untuk memantau aktivitas game dalam periode aktif.

### Struktur File & Penghubungan

- **Halaman Dashboard Game** - `src/app/(dashboard)/game/dashboard/page.tsx`.
- **Server Action Statistik** - `src/features/game/dashboard/actions.ts`.
- **Wrapper Client** - `src/features/game/dashboard/game-dashboard-wrapper.tsx`.
- **Client UI & Skeleton** - `src/features/game/dashboard/game-dashboard-client.tsx`.
- **Filter Dashboard** - `src/features/game/dashboard/dashboard-filter.tsx`.

Contoh penghubungan utama:

```tsx
import { getGameDashboardStats } from "@/src/features/game/dashboard/actions";
import { GameDashboardWrapper } from "@/src/features/game/dashboard/game-dashboard-wrapper";
```

### Menambahkan Statistik atau Chart Baru

Tambahkan query agregasi di `actions.ts`, perluas tipe data statistik, lalu render metrik baru di komponen client dashboard. Pastikan filter `timeRange` tetap diteruskan konsisten agar semua visual mengikuti periode yang sama.

---
*Deskripsi ini menjelaskan fungsi, sumber data, dan titik integrasi utama untuk halaman dashboard game.*
