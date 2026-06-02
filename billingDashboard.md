## Gambaran Umum Dashboard Billing

**Dashboard Billing** berfungsi sebagai antarmuka ringkasan moneter atau aliran pendapatan langganan. Memungkinkan pemantauan indikator kunci seperti pelanggan berbayar (subscriber), pendapatan (monthly revenue), tagihan macet (unpaid invoices), dan rasio pertumbuhan (MRR growth).

### Bagian-Bagian Utama

1. **Data Source (Dummy Data)** - Saat ini, karena sistem transaksi riil masih dikembangkan, sumber data untuk kalkulasi finansial (`totalRevenue` dan tunggakan `unpaidTotal`) masih merujuk kepada dataset statik sementara yang berasal dari modul `lib/dummy-data` (contoh: object array `activeSubscribers` dan `unpaidUsers`).

2. **Komponen Tabel & Visualisasi**
   - **Kartu Statistik Billing** - Metrik kuantitatif disajikan menggunakan komponen standar `StatCard` yang ditempatkan pada sebuah blok grid. Menampilkan label, nilai absolut, indikator naik-turun (tren), serta logo ikon pendukung.
   - **Chart Billing (Pendapatan & Plan)** - Tersedia area infografik khusus yang disokong dengan dua komponen terpisah: `RevenueChart` (untuk mengkomunikasikan diagram garis/tren kenaikan omset bulanan) dan `PlanDistributionPie` (komponen diagram lingkaran/pie yang mendistribusikan jumlah pemakai paket spesifik).
   - **Data Tabel Transaksi** - Riwayat transaksi terbaru atau pembeli langganan di-render dalam tabel grid via `DataTable`. Kolom pada tabel merangkum rincian profil pembeli, tipe paket, riwayat saldo, serta status penagihan.
   - **Internationalization (i18n)** - Sama seperti fitur dashboard lainnya, fungsi `useTranslation` dimanfaatkan untuk menerjemahkan istilah kunci secara kondisional.

### Struktur File & Penghubungan

- **Halaman Dashboard Billing** - `src/app/(dashboard)/billing/dashboard/page.tsx`
- **Dummy Data Repository** - `lib/dummy-data.ts` - mensimulasikan panggilan API database pembayaran.
- **Stat Card** - `src/components/dashboard/stat-card.tsx` - komponen representasi angka indikator.
- **Revenue Chart** - `src/components/dashboard/revenue-chart.tsx` - visual chart garis untuk omset.
- **Plan Pie Chart** - `src/components/dashboard/plan-distribution-pie.tsx` - proporsi donat statistik tipe paket berlangganan.
- **Data Table** - `src/components/dashboard/data-table.tsx` - penyaji struktur row dan kolom data tabel.
- **Section Header** - `src/components/dashboard/section-header.tsx` - memisahkan zona konten chart dan tabel.

Contoh integrasi antarmuka dalam file halaman (`page.tsx`):

```tsx
import { activeSubscribers, unpaidUsers } from "@/lib/dummy-data";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
```

### Menghubungkan Data Billing Nyata

Ganti koneksi data *mockup* statis (yang bersumber dari `dummy-data`) menggunakan Server-Action khusus atau panggilan ke fungsi Supabase/API Payment Gateway external (seperti Stripe atau Midtrans) yang menarik baris data subscriptions dan *invoice*. Pastikan normalisasi pemformatan nilai nominal harga atau *amount* terjaga (currency formatting) sesaat setelah ditarik dan sebelum ditampilkan.

---
*Deskripsi ini menjelaskan struktur dashboard keuangan penagihan dan menyoroti titik integrasi untuk penggantian ke data pembayaran nyata di kemudian hari.*
