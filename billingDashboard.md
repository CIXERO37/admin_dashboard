## Gambaran Umum Dashboard Billing

**Dashboard Billing** berfungsi sebagai ringkasan pendapatan, subscriber, invoice tertunda, dan pertumbuhan MRR. Saat ini halaman memakai data dummy dari `lib/dummy-data` untuk membangun tampilan dashboard billing.

### Bagian-Bagian Utama

1. **Kartu Statistik Billing** - Menampilkan jumlah subscriber aktif, monthly revenue, unpaid invoices, dan MRR growth memakai `StatCard`.

2. **Perhitungan Revenue** - `totalRevenue` dan `unpaidTotal` dihitung dari array `activeSubscribers` dan `unpaidUsers`.

3. **Chart Billing** - `RevenueChart` menampilkan tren pendapatan, sedangkan `PlanDistributionPie` menampilkan distribusi paket.

4. **Recent Transactions** - `DataTable` menampilkan transaksi atau subscriber terbaru dengan kolom customer, plan, amount, dan status.

5. **Internationalization** - Label utama memakai `useTranslation` agar mengikuti bahasa aktif.

### Struktur File & Penghubungan

- **Halaman Dashboard Billing** - `src/app/(dashboard)/billing/dashboard/page.tsx`.
- **Stat Card** - `src/components/dashboard/stat-card.tsx`.
- **Section Header** - `src/components/dashboard/section-header.tsx`.
- **Data Table** - `src/components/dashboard/data-table.tsx`.
- **Revenue Chart** - `src/components/dashboard/revenue-chart.tsx`.
- **Plan Pie Chart** - `src/components/dashboard/plan-distribution-pie.tsx`.
- **Dummy Data** - `lib/dummy-data`.

Contoh penghubungan utama:

```tsx
import { activeSubscribers, unpaidUsers } from "@/lib/dummy-data";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
```

### Menghubungkan Data Billing Nyata

Ganti `dummy-data` dengan action atau API payment yang mengambil subscription dan invoice aktual. Pastikan format amount tetap konsisten sebelum dihitung dan ditampilkan.

---
*Deskripsi ini menjelaskan dashboard billing saat ini dan titik migrasi dari dummy data ke data payment nyata.*
