## Gambaran Umum Address City

**Address City** berfungsi sebagai halaman daftar kota. Administrator dapat mencari kota, memfilter berdasarkan country dan state, serta menelusuri data dengan pagination.

### Bagian-Bagian Utama

1. **Query Parameter** - Halaman membaca `page`, `search`, `country`, dan `state` dari URL.

2. **Server-Side Fetching** - Data kota diambil melalui `fetchCities` dengan limit 15.

3. **Tabel City** - `CityTable` menerima data awal, total halaman, halaman aktif, daftar country, daftar state, search query, dan filter aktif.

4. **Cascading Filter** - Filter country dan state dipakai bersama untuk mempersempit daftar kota.

5. **Suspense Skeleton** - Fallback skeleton menampilkan header dan tiga kontrol filter saat loading.

### Struktur File & Penghubungan

- **Halaman City** - `src/app/(dashboard)/address/city/page.tsx`.
- **Actions City** - `src/features/address/city/actions.ts`.
- **Tabel City** - `src/features/address/city/city-table.tsx`.
- **Tipe Address** - `src/features/address/types/address.ts`.

Contoh penghubungan utama:

```tsx
import { CityTable } from "@/src/features/address/city/city-table";
import { fetchCities } from "@/src/features/address/city/actions";
```

### Menambahkan Filter City

Tambahkan parameter baru di action dan table. Untuk filter yang bergantung pada country atau state, pastikan opsi filter dikembalikan dari server sesuai konteks aktif.

---
*Deskripsi ini menjelaskan halaman city sebagai daftar address master tingkat kota dengan filter bertingkat.*
