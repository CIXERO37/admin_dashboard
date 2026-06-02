## Gambaran Umum Reports

**Reports** dipersiapkan sebagai pintu gerbang (sentral tiket) pemantauan pusat pengaduan pelanggan atau keluhan anomali aplikasi pengguna. Fasilitas ini memampukan otoritas moderator (*admin*) untuk merinci pergerakan laporan insiden, memberlakukan segmentasi (memilah *filter* bedasarkan klasifikasi pelanggaran atau kelayakan usulan *feature request*), serta men-trigger perpindahan investigatif kearah pendalaman relasi percakapan untuk proses re-solusi akhir.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan *Global Store*)** - Ketergantungan pasokan sumber penarikan muatan antrean tiket sepenuhnya dirangkul oleh manajemen pelestari persisten klien global `useDashboardData` (melalui pemicu status `isLoading` dan objek *response array* `reports`).
 
2. **Komponen Pengelola Antrean & Status Pemrosesan**
   - **Tabel Susunan Induk (*ReportTable*)** - Sebagai kanvas presentasional pembungkus pilar. Melalui injeksi asupan *initialData* dari sistem tangkapan *Store Context*, `ReportTable` membeberkan formasi iterasi barisan (*Grid*), menyelenggarakan sistem *Filter* logis pencarian lokal mandiri, beserta pemetaan daftar antrean keluhan berdasarkan level eskalasi (label penanganan).
   - **Indikator Perlindungan Muatan (*Skeleton Loading*)** - Disadur sebagai protektor *UI (User Interface)* interupsi pementasan tata letak saat jeda pengambilan informasi (*Asynchronous latency delay*). *Placeholder Skeleton* meredam layar melompat (*Layout Shift*) dari kekosongan kerangka formasi pelabelan dan filterisasi.
   - **Lompatan Navigasi Rincian (Dispute Details)** - Klik di atas salah satu spesifik ID baris pelaporan mengaktifkan pergerakan fungsi pautan URI relasional kepada rute `reports/[id]`. Tautan ini menerobos portal panel manajemen pertikaian *(dispute channel)* untuk menyimak log balasan pesan historis (percakapan).

### Struktur File & Penghubungan

- **Halaman Reports** - `src/app/(dashboard)/reports/page.tsx`
- **Tabel Reports** - `src/features/reports/report-table.tsx` - instrumen modul pemonitoran logik *client-filtering*.
- **Kolom Reports** - `src/features/reports/_components/report-columns.tsx` - konfigurasi abstraksi parameter susunan lajur.
- **Dialog Reports** - `src/features/reports/_components/report-dialogs.tsx`
- **Hook Tabel** - `src/features/reports/_hooks/use-reports-table.ts`
- **Actions Reports** - `src/features/reports/actions.ts` - berisi operasi dasar *backend actions*.
- **Tipe Report** - `src/features/reports/types/report.ts`

Praktik perakitan komponen utama penarik persediaan `dashboard-store`:

```tsx
import { ReportTable } from "@/src/features/reports/report-table";
import { useDashboardData } from "@/contexts/dashboard-store";
```

### Menambahkan Status atau Aksi Baru

Perancangan label agregat penggolongan kriteria tipe komplain keluhan ekstra (katakanlah label kategori penanganan darurat *"Critical Priority"*), mengharuskan penulisan perbaikan spesifik perbendaharaan *object typing* interface (pilar file tipe *report*). Refleksikan juga sisipan tersebut pada modul pengarah (Supabase layer `actions.ts`), parameter utilitas selektor tabel `report-columns.tsx` (modifikasi filter statisnya), lalu harmonisasikan eksekusinya ke antarmuka modul peringatan/persetujuan `report-dialogs`. Tentu, mutlak selaraskan muatan visibilitas penyuntingan parameter yang identik kepada wadah profil riwayat penanganan rincian `reports/[id]` untuk menolak keruntuhan sinkronisasi pelaporan lintas batas antar panel.

---
*Deskripsi ini menegaskan pengadaan rute fasilitas pengawalan pendaftaran administrasi tiket keluhan/gangguan konsumen.*
