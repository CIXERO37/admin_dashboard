## Gambaran Umum Detail Game

**Detail Game** berfungsi sebagai halaman spesifik laporan (report/analitik) performa sebuah aplikasi game tunggal. Halaman ini mensarikan perincian berupa penyelesaian sesi, aktivitas pemain, peringkat kuis (top quizzes), distribusi domisili dan demografi umur/pendidikan, serta list seluruh riwayat sesi terkait game terkait.

### Bagian-Bagian Utama

1. **Data Source (Server Fetching Multidimensi)** - Pengumpulan data di-retrieve dengan memadukan dua fungsi utilitas via Server-Action. 
   - `fetchGameDetail` - Melayani permintaan data statistik umum dan penyediaan himpunan entri list sesi game.
   - `fetchPlayerDemographics` - Terfokus hanya menangani komputasi metadata partisipan (jenis kelamin, usia, sebaran lokasi).

2. **Komponen Visualisasi Data**
   - **Parameter Identifikasi Game** - Menangkap *Slug* nama rute dinamis (`[name]`) melalui URL dan mengubah format *escape*-nya untuk dikonversi menjadi identitas pencarian game (`appName`).
   - **Filter Waktu Detail** - Menghadirkan kontrol *Dropdown* yang menyediakan opsi agregat penelusuran (seperti *today*, *yesterday*, *this week*, *all time*). Fungsi *helper* eksternal `getDateRange` bertanggungjawab membongkar filter relatif menjadi batasan absolut (`start` dan `end`).
   - **Kartu Statistik Dasar** - Komponen blok presentasional untuk memperlihatkan rasio konversi penyelesaian, kuantitas audiens terdaftar, durasi rata-rata sesi, serta total kuantitas sesi.
   - **Widget Analitik & Insight** - Kombinasi serangkaian kanvas *Charts* dan infografis, meliputi: sebaran geolokasi (*Player Map*), partisi pendidikan, hingga performa pencapaian peringkat kuis (*Top Quizzes*).

### Struktur File & Penghubungan

- **Halaman Detail Game** - `src/app/(dashboard)/games/[name]/page.tsx`
- **Actions Detail Game** - `src/features/games/[name]/actions.ts` - menampung operasi pemanggilan Supabase `fetchGameDetail` dan demografi.
- **Player Map** - `src/features/games/[name]/player-map.tsx` - komponen diagram peraga peta demografi wilayah (geolokasi).
- **Stat Card** - `src/components/dashboard/stat-card.tsx` - abstraksi kartu metrik ringkas terpadu.
- **Halaman Games (Katalog)** - `src/app/(dashboard)/games/page.tsx`

Contoh metode rekayasa integrasi fungsi data di halaman detail:

```tsx
import { fetchGameDetail, fetchPlayerDemographics } from "@/src/features/games/[name]/actions";
```

### Menambahkan Insight Baru

Ekspansi metrik (seperti tambahan grafik jenis kelamin, atau tipe perangkat/OS yang dipakai pemain) membutuhkan injeksi tambahan kolom agregat pada fungsi layer *action* detail game, sekaligus merevisi properti `GameDetailStats` atau interface `PlayerDemographics`. Aplikasikan perenderan blok infografis (*Chart* baru) tersebut secara proporsional. Selalu pastikan param filter waktu turut dirangkaikan pada argumentasi parameter saat melontarkan *query* baru.

---
*Deskripsi ini menegaskan pengkategorian detail analitik mendalam spesifik pada suatu nama produk game yang diseleksi.*
