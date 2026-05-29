## Gambaran Umum Dashboard Global

**Dashboard Global** berfungsi sebagai pusat kendali utama bagi administrator untuk memantau kesehatan, kinerja, dan metrik penting seluruh ekosistem aplikasi secara real‑time. Dashboard menggabungkan data dari Supabase (auth, storage, edge function), lapisan otentikasi, dan bucket storage, menampilkannya melalui visualisasi yang kuat serta shortcut akses cepat.

### Bagian‑Bagian Utama

1. **Panel Akses Cepat** – Kumpulan ubin (tile) kompak yang menautkan langsung ke halaman admin yang paling sering digunakan (misalnya Manajemen Pengguna, Matriks Peran & Izin, Feature Flags, dan Log Sistem). Setiap ubin menampilkan label singkat, ikon intuitif, dan badge yang menandakan tindakan atau peringatan tertunda. Ubin‑ubin tersebut didefinisikan di `src/app/(dashboard)/quick-access.tsx` dan di‑render oleh komponen `QuickAccess` yang berada di direktori `components/quick-access`.

2. **Ringkasan Statistik** – Kartu metrik yang menarik nilai teragregasi dari tabel Supabase menggunakan klien `supabase-js`. Kartu standar meliputi:
   - **Pengguna Aktif** – Jumlah unik `auth.users` dengan `last_sign_in_at` dalam 24 jam terakhir.
   - **Registrasi Baru (24h)** – Jumlah insert baru pada `auth.users` selama satu hari terakhir.
   - **Total Penyimpanan Terpakai** – Penjumlahan `size` pada `storage.objects` di semua bucket.
   - **Pemanggilan Edge Function** – Jumlah invokasi yang tercatat di tabel `edge_function_logs` bulan ini.
   - **Tingkat Kesalahan** – Persentase permintaan API yang mengembalikan status 5xx, dihitung dari tabel `logs.api`.
   Kartu‑kartu ini di‑render oleh komponen `StatCard` di `components/stat-card`, sementara logika pengambilan data berada di hook `hooks/useDashboardStats.ts`.

3. **Chart Analitik** – Visualisasi interaktif berbasis **Recharts** yang memberikan insight lebih dalam:
   - **Grafik Pertumbuhan Pengguna** – Diagram garis yang menampilkan jumlah registrasi harian selama 30 hari terakhir (sumber: `auth.users` dengan `created_at`).
   - **Distribusi Penyimpanan** – Donat chart yang memecah konsumsi penyimpanan per bucket (sumber: `storage.objects` dikelompokkan berdasarkan `bucket_id`).
   - **Heatmap Latensi API** – Heatmap yang menampilkan rata‑rata waktu respons per endpoint per jam (sumber: `logs.api` yang di‑aggregate pada `endpoint` dan jam).
   - **Adopsi Feature Flag** – Bar chart horizontal yang menampilkan persentase pengguna yang terkena tiap flag aktif (sumber: tabel `feature_flags` yang di‑join dengan `auth.users`).
   Semua komponen chart berada di direktori `components/charts/*` dan mengambil data melalui hook `useChartData`.

### Struktur File & Penghubungan

- **Halaman Dashboard Global** – `src/app/(dashboard)/dashboard/page.tsx` (sudah ada).
- **Komponen Akses Cepat** – `src/components/quick-access/QuickAccess.tsx` – di‑import pada halaman dashboard.
- **Komponen Kartu Statistik** – `src/components/stat-card/StatCard.tsx` – dipakai untuk setiap metrik.
- **Komponen Chart** – Direktori `src/components/charts/` berisi `UserGrowthChart.tsx`, `StorageDonutChart.tsx`, `LatencyHeatmap.tsx`, dan `FeatureFlagBarChart.tsx`.
- **Hook Data** – `src/hooks/useDashboardStats.ts` dan `src/hooks/useChartData.ts` menyediakan query Supabase dan transformasi data.

Setiap komponen diekspor sebagai named export dan direferensikan lewat import relatif di `page.tsx`. Contoh penggunaan:

```tsx
import { QuickAccess } from '@/components/quick-access/QuickAccess';
import { StatCard } from '@/components/stat-card/StatCard';
import { UserGrowthChart } from '@/components/charts/UserGrowthChart';
```

### Menambahkan Statistik atau Chart Baru

Untuk menambah metrik atau chart baru, buat hook terkait di `src/hooks/`, komponen visual di sub‑folder yang sesuai, lalu daftarkan pada `page.tsx`. Pastikan query Supabase mematuhi kebijakan RLS yang dijelaskan pada **Project Governance**.

---
*Deskripsi ini memberikan narasi tingkat tinggi, menyebutkan sumber data spesifik untuk setiap statistik dan chart, serta menjelaskan lokasi file dan cara menghubungkannya dalam proyek.*