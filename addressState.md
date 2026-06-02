## Gambaran Umum Address State

**Address State** berfungsi sebagai halaman daftar state atau provinsi. Administrator dapat mencari state, memfilter berdasarkan country, dan menelusuri data dengan pagination. Data yang ditampilkan mencakup detail negara asal, tipe area (state, province, dll), serta koordinat.

### Bagian-Bagian Utama

1. **Data Source (Server-Side Fetching)** - Mengambil data state dari tabel `states` di Supabase. Fungsi utamanya adalah `fetchStates` (untuk pagination dan list) dan `fetchStateById` (untuk detail lengkap) yang berada di action layer.
   - **Data Tabel** - Memuat field penting seperti `id`, `name`, `native`, `country_code`, `iso2`, dan `type` dengan limit default 15 data.
   - **Filter Country** - Daftar country unik untuk dropdown combo box didapatkan dengan mengeksekusi query yang mengekstrak `country_code` yang unik dari tabel `states`.

2. **Komponen Tabel & Filter (`StateTable`)** - Komponen frontend berbasis React Client (`"use client"`) yang bertugas me-render tabel menggunakan komponen `DataTable`.
   - Menyediakan form input pencarian teks (`Input`) dan filter berdasar dropdown negara (`Combobox`).
   - Dialog informasi detail (koordinat, native name, type) akan dipicu ketika nama state diklik. Data rincinya akan ditarik secara langsung via fetch API `fetchStateById`.
   - ID state bersifat clickable, memungkinkan admin melompat navigasi ke halaman `City` dengan filter param negara dan state yang relevan.

3. **URL Search Params (Query Parameter)** - Keadaan filter (state) aplikasi untuk form pencarian dan pilihan (`page`, `search`, `country`) dikelola via router parameter Next.js URL. Komponen halaman (page.tsx) me-retrieve parameter server-side dan di-pass ke `StateTable`, yang dapat memperbaruinya via navigasi `push` dari fitur `updateUrl`.

### Struktur File & Penghubungan

- **Halaman State** - `src/app/(dashboard)/address/state/page.tsx`
- **Actions State** - `src/features/address/state/actions.ts` - menampung query Supabase (`fetchStates`, `fetchStateById`) dan definisi interface `State`.
- **Tabel State** - `src/features/address/state/state-table.tsx` - komponen React Client utama penyajian data state dan aksi tabel.
- **Tipe Address** - `src/features/address/types/address.ts`

Contoh penghubungan utama:

```tsx
import { StateTable } from "@/src/features/address/state/state-table";
import { fetchStates } from "@/src/features/address/state/actions";
```

### Menambahkan Field State

Perbarui tipe address pada action, lalu tampilkan field pada state table. Jika field berkaitan dengan country (misal region global), pastikan interaksi filter country tetap konsisten saat fetching data.

---
*Deskripsi ini menjelaskan halaman state sebagai daftar address master tingkat provinsi atau wilayah.*
