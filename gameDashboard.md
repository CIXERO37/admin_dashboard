## Gambaran Umum Dashboard Game

**Dashboard Game** berfungsi sebagai ruang kendali (command center) pengawasan perilaku dan traksi fitur *Game*. Menyediakan fasilitas observasi kinerja sesi per-rentang periode, mencatat densitas jumlah pemain, serta metrik kelulusan atau rasio penyelesaian kuis *game*.

### Bagian-Bagian Utama

1. **Data Source (Server Action Statistik)** - Pengumpulan agregasi analitik dipicu sebelum komponen termuat melalui pemanggilan server *action* `getGameDashboardStats(range)`. Sumber data ini berisikan angka metrik kalkulasi densitas *game*, sesi interaktif, dan demografi partisipan sesuai kurun parameter rentang waktu.

2. **Komponen Tabel & Visualisasi**
   - **Filter Rentang Waktu** - Komponen form antarmuka klien (`DashboardFilter`) yang bertugas mengatur nilai rentang tanggal yang dipantau (misal *this-year* atau kustom). Nilainya secara reaktif disinkronisasi ke string URL parameter (`timeRange`).
   - **Wrapper Client Dashboard** - Pembungkus reaktif UI (`GameDashboardWrapper`) yang memakan umpan statis dari fungsi *server* untuk diratakan ke dalam tampilan klien interaktif. Saat menanti kembalian *promise* atau perpindahan waktu filter, UI Skeleton ringan (`GameDashboardSkeleton`) dipanggil menggantikannya.
   - **Visualisasi Dashboard** - Komponen yang bertugas menerjemahkan *insight* metrik *backend* menjadi kartu indikator kuantitatif bersusun serta grafik *charts* garis tren sesi pemakaian.

### Struktur File & Penghubungan

- **Halaman Dashboard Game** - `src/app/(dashboard)/game/dashboard/page.tsx`
- **Server Action Statistik** - `src/features/game/dashboard/actions.ts` - gudang operasi database terkait perolehan metrik rekapitulasi angka.
- **Wrapper Client** - `src/features/game/dashboard/game-dashboard-wrapper.tsx` - pengendali status sinkronisasi muatan data *client-side*.
- **Client UI & Skeleton** - `src/features/game/dashboard/game-dashboard-client.tsx` - file layout infografik.
- **Filter Dashboard** - `src/features/game/dashboard/dashboard-filter.tsx` - utilitas antarmuka filter tanggal/waktu.

Contoh pola kode penggabungan awal di root page:

```tsx
import { getGameDashboardStats } from "@/src/features/game/dashboard/actions";
import { GameDashboardWrapper } from "@/src/features/game/dashboard/game-dashboard-wrapper";
```

### Menambahkan Statistik atau Chart Baru

Perluas abstraksi `getGameDashboardStats` pada file *actions* beserta modifikasi perbaikan *type-declaration*-nya jika bermaksud menyisipkan *node* pengukuran data performa baru (misal *Average Playtime*). Terakhir, aplikasikan visualisasinya dengan merender blok metrik atau elemen grafik kustom pada modul Client Dashboard, sembari memastikan properti rentang filter dari `DashboardFilter` tidak terputus.

---
*Deskripsi ini menegaskan kapabilitas dan komponen-komponen reaktif pemantau operasional game.*
