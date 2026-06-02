## Gambaran Umum Dashboard Quiz

**Dashboard Quiz** berfungsi sebagai papan intai metrik (Command Center) agregasi properti dari kuis. Panel analitik ini mendedikasikan visibilitas untuk pemonitoran angka populasi total kuis, persentase diseminasi visibilitas kepemilikan (Pribadi/Publik), akumulasi kuis menanti pengesahan publik, disokong oleh diagram tren grafik kuantitatif pembuatan periode yang disesuaikan.

### Bagian-Bagian Utama

1. **Data Source (Penggabungan Hook Multilayer)** 
   - **Tangkapan Dashboard Store** - Mengakuisisi pasokan *State Management Context* lewat perantara relasi `useDashboardData`. Data rekapan kuis mentah ditarik dan disalurkan.
   - **Suntikan Agregasi Sesi** - Keterikatan silang kalkulasi rasio penggunaan disokong ekstraksi pemantauan status *Game Session* (`useGameStats`). Integrasi status muat tertunda (`isLoading`) antardua variabel direkatkan sebelum *UI Wrapper* dihidupkan (*conditional rendering*).

2. **Komponen Visualisasi Data**
   - **Filter Rentang Waktu** - Komponen form antarmuka penyaring (*Dropdown*) penyedia rasio segmentasi pengamatan. Rekapan penyortiran merujuk kapabilitas modifikasi `created_at` untuk mengecualikan populasi di luar rute kalender spesifik (contoh: *this-year*, *last-year*, *all*).
   - **KPI Kartu Metrik Kuis** - Susunan blok infografis (*StatCards*) mengomunikasikan rekapitulasi data absolut; total komoditas kuis, kuis rilis *public*, rasio *private*, serta kuota persetujuan (*approval queue*). Beberapa elemen memiliki relasi *Hyperlink* navigasi cepat menuju ruang kontrol bersangkutan.
   - **Modul Visualisasi Grafis (`QuizStatsCharts`)** - Kanvas pengolah presentasional terpusat memakan *prop* `filteredQuizzes`, atribut statistik user/pencipta, dan parameter sesi termain (*game session sum*). Bertanggungjawab atas konversi log pangkalan data yang membosankan menjadi pilar *Chart* responsif yang informatif.

### Struktur File & Penghubungan

- **Halaman Dashboard Quiz** - `src/app/(dashboard)/quiz/dashboard/page.tsx`
- **Hook Statistik Game Quiz** - `src/features/quiz/dashboard/_hooks/useGameStats.ts` - menampung operasi pemanggilan Supabase spesifik pencarian durasi/sesi.
- **Store Dashboard** - `contexts/dashboard-store` - pengelola sumber pusat data.
- **Stat Card** - `src/components/dashboard/stat-card.tsx` - abstraksi kartu indikator kustom.
- **Chart Quiz** - `src/components/dashboard/quiz-stats-charts.tsx`

Skema tata cara implementasi import untuk mengikat ketersediaan arus pangkalan *Store Context* di *Page* utama:

```tsx
import { useDashboardData } from "@/contexts/dashboard-store";
import { QuizStatsCharts } from "@/components/dashboard/quiz-stats-charts";
```

### Menambahkan Metrik Baru

Manakala dibutuhkan perhitungan pengukuran ekstraksional (*KPI Metrics* turunan), semisal agregat rasio adopsi soal (Total Rata-Rata Soal per Kuis), letakkan komputasinya berlandaskan muatan susunan filter kalender pada atribut `filteredQuizzes`. Atau andai membutuhkan *query* berbeda, wujudkan melalui rutinitas perakitan *Custom Hook API Data* penyambung Supabase (*Data Feeder*). Pasangkan hasil kembaliannya (*payload*) menembus kanvas instrumen `StatCard` pendamping maupun `QuizStatsCharts`. Jaga integritas properti penyaring kalender pada pembantu konversi agar kalkulasi tidak melenceng.

---
*Deskripsi ini menegaskan pengadaan modul panel analitik gabungan status visibilitas kepemilikan kuis pada pusat komando utama.*
