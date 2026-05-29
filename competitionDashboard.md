## Gambaran Umum Dashboard Competition

**Dashboard Competition** berfungsi sebagai pusat analitik kompetisi. Halaman ini mengambil statistik kompetisi dari server dan menampilkan insight operasional melalui client dashboard khusus.

### Bagian-Bagian Utama

1. **Server-Side Statistik** - Data dashboard diambil dengan `getCompetitionDashboardStats` sebelum render.

2. **Client Dashboard** - `CompetitionDashboardClient` menerima `initialData` dan bertanggung jawab atas tampilan kartu statistik, chart, serta ringkasan kompetisi.

3. **Metrik Kompetisi** - Statistik dapat mencakup jumlah kompetisi, status publikasi, peserta, pembayaran, dan tren performa kompetisi sesuai implementasi feature.

4. **Navigasi Operasional** - Metrik dashboard dapat diarahkan ke halaman `manage-competitions` untuk tindakan lanjutan.

### Struktur File & Penghubungan

- **Halaman Dashboard Competition** - `src/app/(dashboard)/competition/dashboard/page.tsx`.
- **Server Actions** - `src/features/competition/dashboard/actions.ts`.
- **Client Dashboard** - `src/features/competition/dashboard/competition-dashboard-client.tsx`.
- **Manage Competitions** - `src/app/(dashboard)/manage-competitions/page.tsx`.

Contoh penghubungan utama:

```tsx
import { getCompetitionDashboardStats } from "@/src/features/competition/dashboard/actions";
import { CompetitionDashboardClient } from "@/src/features/competition/dashboard/competition-dashboard-client";
```

### Menambahkan Metrik Baru

Perluas payload dari `getCompetitionDashboardStats`, tambahkan tipe data jika tersedia, lalu render metrik baru di `CompetitionDashboardClient`. Pertahankan query agregasi di server agar halaman tetap ringan.

---
*Deskripsi ini menjelaskan pola server-to-client pada dashboard kompetisi dan lokasi pengembangan statistik baru.*
