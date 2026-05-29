## Gambaran Umum Address State

**Address State** berfungsi sebagai halaman daftar state atau provinsi. Administrator dapat mencari state, memfilter berdasarkan country, dan menelusuri data dengan pagination.

### Bagian-Bagian Utama

1. **Query Parameter** - Halaman membaca `page`, `search`, dan `country` dari URL.

2. **Server-Side Fetching** - Data state diambil melalui `fetchStates` dengan limit 15.

3. **Tabel State** - `StateTable` menerima data awal, total halaman, halaman aktif, daftar country, search query, dan filter country.

4. **Suspense Skeleton** - Fallback skeleton menjaga tampilan tetap stabil selama data dimuat.

### Struktur File & Penghubungan

- **Halaman State** - `src/app/(dashboard)/address/state/page.tsx`.
- **Actions State** - `src/features/address/state/actions.ts`.
- **Tabel State** - `src/features/address/state/state-table.tsx`.
- **Tipe Address** - `src/features/address/types/address.ts`.

Contoh penghubungan utama:

```tsx
import { StateTable } from "@/src/features/address/state/state-table";
import { fetchStates } from "@/src/features/address/state/actions";
```

### Menambahkan Field State

Perbarui tipe address, query action, dan kolom tabel state. Jika field berkaitan dengan country, pastikan relasi dan filter country tetap konsisten.

---
*Deskripsi ini menjelaskan halaman state sebagai daftar address master tingkat provinsi atau wilayah.*
