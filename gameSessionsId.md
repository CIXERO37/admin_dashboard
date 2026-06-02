## Gambaran Umum Detail Game Session

**Detail Game Session** berfungsi sebagai rujukan tunggal pangkalan spesifik metadata dari rekaman sesi sebuah aktivitas game. Menyajikan informasi rincian mendetail seperti identitas *host*, aplikasi, kombinasi *PIN* masuk, hingga leaderboard rekapan prestasi peserta.

### Bagian-Bagian Utama

1. **Data Source (Fetch Detail Sesi & URL Param)** - Menggunakan nomor identifikasi dari URI *path routing* Next.js, parameter ID sesi diolah (secara server-side) untuk mengaktifkan pemanggilan fungsionalitas `getGameSessionById(id)`. Pengambilan data ini membaca relasi skema spesifik dan mengekstrak metrik statistik.
   - **Debug Not Found** - Mekanisme penjaga transisi (*fallback*): Jika payload return API bernilai *null*, sistem mengalihkannya ke rupa panel pesan diagnostik/debug yang memberitahukan ketidaksesuaian UUID.

2. **Komponen Visualisasi Metadata & Tabel**
   - **Header Metadata Sesi** - Blok awal panel menyajikan kompilasi data atribut statis kuis (contoh: Title kuis, *Game PIN* otentikasi, informasi *Host*, dan label *Badge Status* operasional waktu nyata).
   - **Kartu Session Stats** - Disajikan melalui komponen `SessionStats`, kartu-kartu metrik merangkum statistik performa komparatif keseluruhan sesi (rata-rata rasio ketepatan skor pemain, batas pencapaian optimal, hingga durasi).
   - **Leaderboard Tabel Peserta** - Antarmuka tabel grid yang merender data para pemain (peserta) yang sudah diurutkan berdasarkan peringkat (sorting berpatokan dominan pada pencapaian tertinggi diikuti durasi pengerjaan). 

### Struktur File & Penghubungan

- **Halaman Detail Session** - `src/app/(dashboard)/game-sessions/[id]/page.tsx`
- **Actions Session** - `src/features/game-sessions/actions.ts` - menampung operasi pemanggilan Supabase `getGameSessionById`.
- **Session Stats** - `src/features/game-sessions/[id]/session-stats.tsx` - perender infografis blok skor ringkas.
- **Statistic Button** - `src/features/game-sessions/[id]/statistic-button.tsx` - UI pendukung pemicu rincian stats opsional.
- **Tabel UI** - `src/components/ui/table.tsx` - *blueprint* pondasi gaya visual matriks kolom/baris.

Contoh sintaks *rendering* dari komponen aksi data di dalam page detail:

```tsx
import { getGameSessionById } from "@/src/features/game-sessions/actions";
import { SessionStats } from "@/src/features/game-sessions/[id]/session-stats";
```

### Menambahkan Data Detail Baru

Apabila ingin menyusupkan variabel laporan peserta lebih lanjut, perpanjang instruksi penyeleksian kolom *SELECT* query di fungsi `getGameSessionById`. Pastikan kalkulasi analitis kustom dikerjakan sebagai properti pembantu di level SSR dan *props-drilling* ke komponen visualisasinya (seperti penambahan kolom tabel spesifik baru). Agar akurasi sistem penentuan pemenang tidak inkonsisten, awasi urutan fungsi *sorting* rank saat merangkai iterasi baris leaderboard agar tetap deterministik.

---
*Deskripsi ini membedah operasional UI hasil rekap halaman laporan metrik leaderboard untuk suatu sesi game individual.*
