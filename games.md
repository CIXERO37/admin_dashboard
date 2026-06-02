## Gambaran Umum Halaman Games

**Games** berfungsi sebagai etalase katalog atau *hub* terpusat ekosistem aplikasi game di modul administrasi. Memudahkan operasional pengguna merepresentasikan visibilitas game, pemfilteran waktu rekam aktivitas periode, serta tautan peninjauan data performa statistik bagi setiap game rincian tunggal.

### Bagian-Bagian Utama

1. **Data Source (Hook Custom Data)** - Halaman katalog tidak memuat data secara terpusat, tetapi dikendalikan dan didistribusikan lewat fungsi *hook* kustom klien `useGames`. Hook bertugas menyeimbangkan perputaran siklus penyaringan dengan sinkronisasi permintaan payload ke *server action*.

2. **Komponen Filter & Visualisasi Katalog**
   - **Header dan Judul Halaman** - Mengomunikasikan posisi fungsional antarmuka *Games* ini.
   - **Pencarian Aplikasi** - Kontrol form pencarian berbasis teks (input search) yang statusnya ditanam kuat pada fungsi `useGames`.
   - **Filter Waktu (*Dropdown*)** - Sebuah menu pemfilteran menggunakan opsi-opsi konfigurasi *TIME_FILTER_LABELS*. Nilai filter mengatur proporsi baris koleksi game yang layak dirender pada grid halaman.
   - **Grid Kartu Game** - Menampilkan galeri matriks ubin (card-grid). Setiap *entry* iteratif me-render komponen `GameCard`. Kerapatan matriks divariasikan secara kondisional berbasis desain *responsive breakpoint* tailwind (1 kolom mobile, 2 tablet, 3 desktop/wide).

3. **Status Pemuatan (*State Indicators*)** - Apabila resolusi respons dari Supabase tengah bermutasi, akan muncul kerangka palsu (`skeleton`) sebagai *placeholder* tata letak visual grid. Jika operasi membuahkan hasil hampa (tidak ada kecocokan referensi string di database), form berganti ujud menyajikan *Empty State* beserta grafis `Dices`.

### Struktur File & Penghubungan

- **Halaman Games** - `src/app/(dashboard)/games/page.tsx`
- **Hook Data & Filter** - `src/features/games/_hooks/use-games.ts` - menampung operasi integrasi lokal (interaktivitas filter dan state sinkronisasi kueri search).
- **Actions Game** - `src/features/games/actions.ts` - berisi operasi dasar *backend*.
- **Kartu Game** - `src/features/games/_components/game-card.tsx` - layout unit visual game per baris elemen.
- **Detail Game** - `src/app/(dashboard)/games/[name]/page.tsx` - navigasi lompatan URI dinamis rujukan ID spesifik gamenya.

Contoh injeksi *rendering* pada page katalog *Games*:

```tsx
import { GameCard } from "@/src/features/games/_components/game-card";
import { useGames, formatAppName } from "@/src/features/games/_hooks/use-games";
```

### Menambahkan Fitur Baru

Untuk memperbesar dimensi metode penyaringan, kembangkan deklarasi properti form di custom hook `use-games.ts`. Distribusikan properti pemanggilan *handler*-nya ke `page.tsx`. Andai Anda mengubah kerangka profil data pada table game, wajib untuk memperbarui struktur antar muka parameter properti (*type*) yang diberikan kepada `GameCard`.

---
*Deskripsi ini menegaskan pemusatan navigasi katalog hub aplikasi Game dengan fokus pencarian dan state klien.*
