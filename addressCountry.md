## Gambaran Umum Address Country

**Address Country** berfungsi sebagai halaman daftar negara. Administrator dapat mencari negara, memfilter berdasarkan region, dan menelusuri data dengan pagination.

### Bagian-Bagian Utama

1. **Query Parameter** - Halaman membaca `page`, `search`, dan `region` dari URL.

2. **Server-Side Fetching** - Data negara diambil melalui `fetchCountries` dengan limit 15.

3. **Tabel Country** - `CountryTable` menerima data awal, total halaman, halaman aktif, daftar region, search query, dan filter region.

4. **Suspense Skeleton** - Halaman memakai fallback `CountryTableSkeleton` untuk menampilkan state loading.

### Struktur File & Penghubungan

- **Halaman Country** - `src/app/(dashboard)/address/country/page.tsx`.
- **Actions Country** - `src/features/address/country/actions.ts`.
- **Tabel Country** - `src/features/address/country/country-table.tsx`.
- **Tipe Address** - `src/features/address/types/address.ts`.

Contoh penghubungan utama:

```tsx
import { CountryTable } from "@/src/features/address/country/country-table";
import { fetchCountries } from "@/src/features/address/country/actions";
```

### Menambahkan Filter Country

Tambahkan parameter filter di page dan action, lalu teruskan ke `CountryTable`. Jika filter berasal dari data dinamis, kembalikan opsi filter dari action seperti `regions`.

---

_Deskripsi ini menjelaskan halaman country sebagai daftar address master dengan search, region filter, dan pagination._
