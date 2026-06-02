## Gambaran Umum Address Country

**Address Country** berfungsi sebagai halaman daftar negara. Administrator dapat mencari negara, memfilter berdasarkan region, dan menelusuri data dengan pagination. Halaman ini membaca data negara (seperti nama, region, kode ISO, kapital, dan mata uang) dari database untuk ditampilkan dalam format tabel.

### Bagian-Bagian Utama

1. **Data Source (Server-Side Fetching)** - Data negara diambil langsung dari Supabase tabel `countries` melalui fungsi `fetchCountries` (untuk list dan filter region) dan `fetchCountryById` (untuk detail) yang berada di file action.
   - **Data Tabel** - List negara membaca kolom seperti `id`, `name`, `native`, `region`, dan `iso2` dengan limit 15 baris per halaman.
   - **Filter Region** - Mengambil data seluruh region unik dari kolom `region` di tabel `countries` secara server-side.

2. **Komponen Tabel & Filter (`CountryTable`)** - Komponen Client-side yang menampilkan data dalam format tabel (`DataTable`), memegang logika filter region (menggunakan `Combobox`), pencarian teks (`Input`), serta navigasi halaman (pagination).
   - Terdapat dialog detail (`Dialog`) yang muncul ketika admin mengklik nama negara, menampilkan informasi rinci (seperti bendera emoji, kode ISO, kapital, kode telepon, mata uang, dan koordinat) yang diambil melalui fetch detail (`fetchCountryById`).

3. **Query Parameter & URL State** - Filter aktif, input pencarian, dan nomor halaman disimpan dalam parameter URL (`page`, `search`, `region`). Jika admin melakukan perubahan filter, fungsi `updateUrl` akan dijalankan dan navigasi router di-push kembali dengan URL baru.

### Struktur File & Penghubungan

- **Halaman Country** - `src/app/(dashboard)/address/country/page.tsx`
- **Actions Country** - `src/features/address/country/actions.ts` - berisi definisi tipe `Country` dan fungsi query Supabase (`fetchCountries`, `fetchCountryById`).
- **Tabel Country** - `src/features/address/country/country-table.tsx` - komponen React Client untuk UI filter dan datatable.
- **Tipe Address** - `src/features/address/types/address.ts`

Contoh penghubungan utama pada halaman:

```tsx
import { CountryTable } from "@/src/features/address/country/country-table";
import { fetchCountries } from "@/src/features/address/country/actions";
```

### Menambahkan Filter Country

Tambahkan parameter filter di page dan action, lalu teruskan ke `CountryTable`. Jika filter berasal dari data dinamis, kembalikan opsi filter dari action seperti kembalian `regions` pada fetchCountries.

---
*Deskripsi ini menjelaskan halaman country sebagai daftar address master dengan search, region filter, dan pagination.*
