## Gambaran Umum Dashboard Competition

**Dashboard Competition** berfungsi sebagai pusat analitik aktivitas serta operasional kompetisi. Menggunakan modul ini, administrator mengekstraksi dan meninjau wawasan agregasi (insight) statistik mengenai tren jalannya kompetisi secara real-time maupun historis.

### Bagian-Bagian Utama

1. **Data Source (Server-Side Statistik)** - Agregat metrik dihitung melalui prosedur server *action* bernama `getCompetitionDashboardStats` sebelum tata letak disajikan kepada user. Pendekatan ini menurunkan latensi karena operasi kompleks (seperti pengumpulan jumlah publikasi, kalkulasi rata-rata peserta aktif) dijalankan di level sisi server (backend) langsung dari sumber data.

2. **Komponen Visualisasi Data**
   - **Client Dashboard Wrapper** - Komponen penyedia *layouting* klien utama (`CompetitionDashboardClient`). Ia bertugas mengambil payload *initialData* utuh lalu menyebarkannya pada sub-komponen *StatCard* dan grafik *Charts* untuk dirender interaktif.
   - **Metrik Kompetisi & Charts** - Serangkaian kotak metrik (menampilkan total kompetisi, *draft*, hingga konversi pembayaran) digabungkan dengan tren grafik untuk mengidentifikasi lonjakan/penurunan interaksi kompetisi di masa waktu tertentu.
   - **Navigasi Operasional** - Beberapa titik nilai statistik bertindak sebagai tautan operasional untuk melompat navigasinya secara spesifik menuju pengelola *manage-competitions*.

### Struktur File & Penghubungan

- **Halaman Dashboard Competition** - `src/app/(dashboard)/competition/dashboard/page.tsx`
- **Server Actions** - `src/features/competition/dashboard/actions.ts` - memuat abstraksi kalkulasi *stats* pada server.
- **Client Dashboard** - `src/features/competition/dashboard/competition-dashboard-client.tsx` - memegang *layout* elemen presentasional *client-side*.
- **Manage Competitions** - `src/app/(dashboard)/manage-competitions/page.tsx` - direktori operasi tabel lanjutan untuk kompetisi individu.

Contoh blok kode saat melangsungkan perakitan komponen utama di page server:

```tsx
import { getCompetitionDashboardStats } from "@/src/features/competition/dashboard/actions";
import { CompetitionDashboardClient } from "@/src/features/competition/dashboard/competition-dashboard-client";
```

### Menambahkan Metrik Baru

Untuk memperkaya nilai utilitas analisis, Anda bisa memperbesar *response object* / tipe data dari *function* `getCompetitionDashboardStats` dengan data statistik anyar. Hindari memindahkan proses komputasi yang rumit ini ke lapisan UI (client), dan selalu selesaikan query agregasi pada *actions.ts* agar pengalaman *loading* halaman (TTFB) tetap ringan dan super efisien.

---
*Deskripsi ini menegaskan pemanfaatan topologi arsitektur Server-to-Client terpisah untuk performa optimal di dashboard kompetisi.*
