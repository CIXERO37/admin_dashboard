## Gambaran Umum Reports

**Reports** berfungsi sebagai halaman daftar laporan pengguna. Administrator dapat memantau laporan, memfilter status atau jenis laporan, dan membuka detail percakapan untuk tindak lanjut.

### Bagian-Bagian Utama

1. **Data dari Dashboard Store** - Halaman mengambil `reports` dan `isLoading` dari `useDashboardData`.

2. **Skeleton Loading** - Jika laporan belum tersedia saat loading, halaman menampilkan skeleton header, filter, dan tabel.

3. **Tabel Report** - `ReportTable` menerima `initialData` dan menangani tampilan daftar report beserta aksi terkait.

4. **Navigasi Detail** - Setiap laporan dapat dibuka ke `reports/[id]` untuk melihat informasi laporan dan percakapan dengan pengguna.

### Struktur File & Penghubungan

- **Halaman Reports** - `src/app/(dashboard)/reports/page.tsx`.
- **Tabel Reports** - `src/features/reports/report-table.tsx`.
- **Kolom Reports** - `src/features/reports/_components/report-columns.tsx`.
- **Dialog Reports** - `src/features/reports/_components/report-dialogs.tsx`.
- **Hook Tabel** - `src/features/reports/_hooks/use-reports-table.ts`.
- **Actions Reports** - `src/features/reports/actions.ts`.
- **Tipe Report** - `src/features/reports/types/report.ts`.

Contoh penghubungan utama:

```tsx
import { ReportTable } from "@/src/features/reports/report-table";
import { useDashboardData } from "@/contexts/dashboard-store";
```

### Menambahkan Status atau Aksi Baru

Perbarui tipe report, action Supabase, kolom tabel, dan dialog. Jika aksi mengubah status report, pastikan detail `reports/[id]` juga menampilkan status terbaru.

---
*Deskripsi ini menjelaskan halaman daftar laporan dan jalur tindak lanjut menuju detail report.*
