## Gambaran Umum Dashboard Support

**Dashboard Support** berfungsi sebagai pusat pemantauan isu dukungan, laporan pengguna, approval quiz tertunda, dan grup komunitas. Halaman ini menggabungkan data reports, quiz approval, groups, dan statistik kategori grup.

### Bagian-Bagian Utama

1. **Filter Rentang Waktu** - Select menyediakan `this-year`, `last-year`, dan `all`. Filter memengaruhi laporan, approval, group count, dan statistik grup.

2. **Kartu Statistik Support** - Kartu menampilkan total reports, pending reports, pending approvals, dan total groups memakai `StatCard`.

3. **Data Reports** - Reports diambil dari hook `useReports`, lalu difilter client-side berdasarkan `created_at`.

4. **Data Approval dan Groups** - `fetchQuizApprovals`, `fetchGroups`, dan `fetchGroupCategoryCounts` dijalankan paralel saat filter berubah.

5. **Chart Support** - `SupportCharts` menerima reports terfilter dan statistik kategori grup untuk menampilkan visualisasi support.

### Struktur File & Penghubungan

- **Halaman Dashboard Support** - `src/app/(dashboard)/support/dashboard/page.tsx`.
- **Hook Reports** - `src/features/reports/_hooks/useReports.ts`.
- **Actions Quiz Approval** - `src/features/quiz-approval/actions.ts`.
- **Actions Groups** - `src/features/groups/actions.ts`.
- **Stats Groups** - `src/features/groups/stats-actions.ts`.
- **Chart Support** - `src/components/dashboard/support-charts.tsx`.

Contoh penghubungan utama:

```tsx
import { useReports } from "@/src/features/reports/_hooks/useReports";
import { SupportCharts } from "@/components/dashboard/support-charts";
```

### Menambahkan Metrik Support

Tambahkan sumber data baru pada fungsi `fetchData`, gabungkan loading state-nya, lalu tampilkan melalui `StatCard` atau `SupportCharts`. Hindari menampilkan data stale dengan reset state saat filter berubah.

---
*Deskripsi ini menjelaskan dashboard support sebagai agregator laporan, approval, dan grup.*
