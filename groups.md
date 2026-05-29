## Gambaran Umum Groups

**Groups** berfungsi sebagai halaman daftar komunitas atau grup pengguna. Administrator dapat melihat grup, memfilter berdasarkan negara atau kategori, dan membuka detail anggota grup.

### Bagian-Bagian Utama

1. **Data Grup dari Store** - Halaman mengambil `groups` dan `isLoading` dari `useDashboardData`.

2. **Data Filter Tambahan** - `fetchCountries` dan `fetchGroupCategories` dijalankan client-side untuk mengisi filter negara dan kategori.

3. **Skeleton Grid** - Jika data masih loading, halaman menampilkan skeleton kartu grup dalam grid responsif.

4. **Group Table** - `GroupTable` menerima data grup, daftar negara, dan daftar kategori untuk menampilkan daftar serta filter.

5. **Navigasi Detail Grup** - Setiap grup dapat dibuka ke `groups/[id]` untuk melihat informasi dan anggota.

### Struktur File & Penghubungan

- **Halaman Groups** - `src/app/(dashboard)/groups/page.tsx`.
- **Tabel Groups** - `src/features/groups/group-table.tsx`.
- **Group Card** - `src/features/groups/_components/group-card.tsx`.
- **Dialog Groups** - `src/features/groups/_components/group-dialogs.tsx`.
- **Hook Tabel** - `src/features/groups/_hooks/use-groups-table.ts`.
- **Actions Groups** - `src/features/groups/actions.ts`.
- **Tipe Group** - `src/features/groups/types/group.ts`.

Contoh penghubungan utama:

```tsx
import { GroupTable } from "@/src/features/groups/group-table";
import { fetchCountries, fetchGroupCategories } from "@/src/features/groups/actions";
```

### Menambahkan Filter Grup

Tambahkan data filter di `actions.ts`, simpan state filter pada hook tabel, lalu teruskan opsi filter ke `GroupTable`. Untuk filter lokasi, gunakan tipe `Country` yang sudah tersedia.

---
*Deskripsi ini merangkum halaman daftar grup beserta data pendukung untuk filter.*
