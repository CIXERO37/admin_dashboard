## Gambaran Umum Halaman Games

**Games** berfungsi sebagai katalog aplikasi game yang tersedia di sistem admin. Halaman ini membantu administrator mencari game, memfilter berdasarkan periode aktivitas, dan membuka detail performa setiap aplikasi game.

### Bagian-Bagian Utama

1. **Header dan Judul Halaman** - Menampilkan judul `Games` sebagai konteks utama halaman.

2. **Pencarian Aplikasi** - Input pencarian menggunakan state dari hook `useGames`. Pencarian dapat dijalankan lewat tombol ikon Search atau tombol Enter.

3. **Filter Waktu** - Select filter memakai `TIME_FILTER_LABELS` dan tipe `TimeFilter` dari hook `useGames`. Filter ini menentukan data game yang ditampilkan pada grid.

4. **Grid Kartu Game** - Setiap game dirender melalui `GameCard` dengan nama yang diformat oleh `formatAppName`. Grid responsif memakai 1 kolom di mobile, 2 di tablet, dan 3 di desktop.

5. **Loading dan Empty State** - Saat data dimuat, halaman menampilkan skeleton grid. Jika hasil filter kosong, halaman menampilkan empty state dengan ikon `Dices`.

### Struktur File & Penghubungan

- **Halaman Games** - `src/app/(dashboard)/games/page.tsx`.
- **Hook Data & Filter** - `src/features/games/_hooks/use-games.ts`.
- **Kartu Game** - `src/features/games/_components/game-card.tsx`.
- **Actions Game** - `src/features/games/actions.ts`.
- **Detail Game** - `src/app/(dashboard)/games/[name]/page.tsx`.

Contoh penghubungan utama:

```tsx
import { GameCard } from "@/src/features/games/_components/game-card";
import { useGames, formatAppName } from "@/src/features/games/_hooks/use-games";
```

### Menambahkan Fitur Baru

Tambahkan filter atau sorting baru di `use-games.ts`, lalu teruskan state dan handler ke `page.tsx`. Jika kartu membutuhkan informasi tambahan, perbarui tipe data game dan komponen `GameCard`.

---
*Deskripsi ini merangkum struktur katalog game, alur pencarian, dan hubungan halaman dengan hook serta komponen feature.*
