## Gambaran Umum Groups

**Groups** difungsikan sebagai wadah pendaftaran serta katalog kelompok/komunitas pengguna ekosistem. Modul ini membekali fungsionalitas bagi admin untuk mensupervisi entitas *group*, menyortirnya melalui kategori fungsional dan letak negara asal, serta menjadi batu loncatan awal untuk mendalami rincian relasi dan data anggotanya.

### Bagian-Bagian Utama

1. **Data Source (Pengelola State dan Actions)** 
   - **Data Grup Pusat** - Pengumpulan muatan *list* entitas komunitas ditarik melalui injeksi *custom hook* klien bernama `useDashboardData`. Data direpresentasikan melalui instansiasi tipe objek abstrak `groups`.
   - **Data Filter Tambahan** - Resolusi data pilihan (opsi combo dropdown) untuk *filter* letak yurisdiksi (`fetchCountries`) dan spesifikasi tipologi grup (`fetchGroupCategories`) dilangsungkan dalam level klien.

2. **Komponen Pengelola & Interaktivitas UI**
   - **Tabel Daftar Komunitas (`GroupTable`)** - Komponen inti klien pembungkus iterasi row. Tidak sekadar me-render grid tabel, ia juga memelihara status reaktif untuk daftar negara maupun kategori filter, serta mengikat pergerakan properti pencarian.
   - **Skeleton Grid (Indikator Pemuatan)** - Sepanjang waktu jeda API `isLoading` mengembalikan *true*, sistem *rendering* disisipkan dengan *placeholder* kerangka (*skeleton*) baris kartu komunitas rekayasa untuk mencegah layar terlihat membeku.
   - **Navigasi Rincian Grup** - ID referensial spesifik yang muncul dalam masing-masing grid kartu bersifat tautan (berfungsi meneruskan arah navigasi operasional ke halaman rincian `groups/[id]`).

### Struktur File & Penghubungan

- **Halaman Groups** - `src/app/(dashboard)/groups/page.tsx`
- **Tabel Groups** - `src/features/groups/group-table.tsx` - pengontrol logik interaktivitas grid.
- **Group Card** - `src/features/groups/_components/group-card.tsx` - komponen sub-elemen ubin UI tunggal.
- **Dialog Groups** - `src/features/groups/_components/group-dialogs.tsx`
- **Hook Tabel** - `src/features/groups/_hooks/use-groups-table.ts`
- **Actions Groups** - `src/features/groups/actions.ts` - menampung operasi pemanggilan Supabase untuk dukungan elemen filter.
- **Tipe Group** - `src/features/groups/types/group.ts` - kerangka interface TypeScript.

Contoh konektivitas integrasi hook *state* dalam satu unit baris kode page:

```tsx
import { GroupTable } from "@/src/features/groups/group-table";
import { fetchCountries, fetchGroupCategories } from "@/src/features/groups/actions";
```

### Menambahkan Filter Grup

Apabila diperlukan tambahan faset kategori (*taxonomy filter*) baru untuk pengelompokkan, jabarkan logika instruksi agregasinya di fungsi utilitas `actions.ts`. Simpan nilainya (dari tangkapan data asinkron) ke dalam *hook table* state, kemudian wariskan operannya kepada props filter yang eksis di form `GroupTable`. Khusus untuk ekstensi yang merujuk pada domisili (seperti *City* atau *State*), rekomendasikan pendaurulangan tipe referensi `Country` untuk keseragaman tipe skema global.

---
*Deskripsi ini menegaskan pengadaan modul katalog daftar kumpulan anggota dan kerangka penyortir kombinasinya.*
