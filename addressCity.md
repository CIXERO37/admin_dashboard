## Gambaran Umum Address City

**Address City** berfungsi sebagai halaman daftar kota. Administrator dapat mencari kota, memfilter berdasarkan country dan state, serta menelusuri data dengan pagination.

### Bagian-Bagian Utama

1. **Data Source (Server-Side Fetching)** - Data spesifik kota ditarik dari tabel `cities` pada Supabase menggunakan `fetchCities` (list dan options) dan `fetchCityById` (detail) di file `actions.ts`.
   - **Data Tabel** - List kota me-retrieve field `id`, `name`, `native`, `state_code`, dan `country_code`.
   - **Data Cascading Filter** - Untuk mengoptimalkan tampilan filter dropdown yang bertumpuk, opsi combobox *country* diambil langsung dari tabel `countries` (sehingga semua opsi bisa muncul tanpa terpengaruh filter kota). Sedangkan daftar dropdown *state* mengambil dari tabel `states`, yang datanya dapat difilter otomatis bergantung dari `country_code` yang sedang aktif (fitur Cascading).

2. **Komponen Tabel & Filter (`CityTable`)** - Komponen antarmuka Client (berada di `city-table.tsx`) yang mengelola state UI, filter `search`, dropdown filter `country`, dan `state`. 
   - Dilengkapi dua komponen `Combobox` (Dropdown) terhubung untuk filter negara dan provinsi/state. 
   - Saat opsi Country dipilih atau berubah, parameter nilai URL diperbarui dan State otomatis di-reset (`state: "all"`), yang memicu Server-Action re-fetch list `states` yang hanya ada di spesifik negara tersebut.
   - Menggunakan fitur Dialog modal untuk menampilkan data geolokasi kota (koordinat lintang dan bujur) berserta rincian asli yang dipanggil `onClick` melalui data fetcher khusus.

3. **URL Query Parameters** - Parameter navigasi dan pencarian selalu dibaca dari URL, dan disimpan kesana (menggunakan state-sync URL). Parameternya berupa: `page`, `search`, `country`, dan `state`.

4. **Suspense Skeleton** - Komponen Fallback UI diletakkan di root komponen page untuk memastikan layout filter tidak rusak atau melompat ketika transisi pemuatan data dari server sedang berlangsung.

### Struktur File & Penghubungan

- **Halaman City** - `src/app/(dashboard)/address/city/page.tsx`
- **Actions City** - `src/features/address/city/actions.ts` - menampung fungsionalitas pengolahan data query tabel Supabase `cities` (juga fetch reference dari `countries` / `states`) via `fetchCities` dan type interfacenya.
- **Tabel City** - `src/features/address/city/city-table.tsx` - komponen pengatur antarmuka React dari UI Data Table beserta interaksi filter kotanya.
- **Tipe Address** - `src/features/address/types/address.ts`

Contoh penghubungan utama dalam halaman server:

```tsx
import { CityTable } from "@/src/features/address/city/city-table";
import { fetchCities } from "@/src/features/address/city/actions";
```

### Menambahkan Filter City

Jika Anda hendak menambah query param spesifik, tambahkan parameter tersebut pada konfigurasi form filter UI tabel, handle pembaruan parameter URL menggunakan navigasi `router.push`, lalu sesuaikan payload di service `fetchCities` server-action untuk merefleksikan filter query builder ke Supabase.

---
*Deskripsi ini menjelaskan halaman city sebagai daftar address master tingkat kota dengan filter bertingkat.*
