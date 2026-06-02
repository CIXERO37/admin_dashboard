## Gambaran Umum Trash Bin

**Trash Bin** dipersiapkan sebagai fasilitas gudang penampungan terpusat (*Central Recovery*) untuk entitas data sistem yang dinonaktifkan sementara (dihapus lunak / *Soft-Deleted*). Memampukan pengawas operasional merestorasi status kepemilikan kuis, akun keanggotaan (Users), berikut entitas kelompok komunitas (Groups), atau malah melakukan eksekusi genosida penghapusan bersih selamanya (*Permanent Deletion/Hard Delete*).

### Bagian-Bagian Utama

1. **Data Source (Pengambilan Paralel Tanpa Tembolok *Cache*)** 
   - **Kompilasi Agregat Serentak** - Pelontaran rutinitas tarikan pangkalan (*fetch action*) dipecah berdasarkan entitas (meliputi rujukan Supabase: `fetchDeletedQuizzes`, `fetchDeletedUsers`, dan kumpulan `fetchDeletedGroups`). Dirangkaikan sinkron satu-waktu memanfaatkan instruksi rekayasa `Promise.all`.
   - **Deklarasi Dinamis (Dynamic Force-Rendering)** - Pengerjaan segmen halaman Trash Bin dikunci dengan restriksi rute persisten `dynamic = "force-dynamic"`. Mencegah distorsi memori log kueri (melarang pengadaan penawaran tembolok bawaan kerangka *Next.js Server Router*) dengan menjamin kepastian mutasi data dihapus tergambar terkini seakurat realita pangkalan peladen.

2. **Komponen Pembungkus & Kontrol Panel Multilapis**
   - **Wizard Tabulasi Penampung Gudang (`TrashBinTabs`)** - Pembungkus rekayasa presentasional yang mendistribusikan injeksi asupan log kueri ketiga entitas terpisah ke spesifik segmen area kerjanya (*tab paneling*) masing-masing.
   - **Tabel Pemonitoran Isolasi Spesifik Jenis (Tabel Entitas Terpisah)** - Mengalokasikan utilitas tabel per rupa instrumen. Berkat pembagian area kolom di arsitektur modul *(Trash Quiz, Trash User, Trash Group Table)*, fungsionalitas tombol manipulasi serta peragaan metadata entitas diracik berbeda menurut karakter logis asalnya secara komprehensif.

### Struktur File & Penghubungan

- **Halaman Trash Bin** - `src/app/(dashboard)/trash-bin/page.tsx`
- **Actions Trash Bin** - `src/features/trash-bin/actions.ts` - menaungi operasi pemanggilan rute utilitas restorasi/hapus kueri *Supabase* layer peladen.
- **Tabs Trash Bin** - `src/features/trash-bin/trash-bin-tabs.tsx` - instrumen pemilah presentasional *dashboard panel*.
- **Trash Quiz Table** - `src/features/trash-bin/trash-quiz-table.tsx` - kolom & fungsionalitas penyusun spesifik elemen *Deleted Quiz*.
- **Trash User Table** - `src/features/trash-bin/trash-user-table.tsx` - kolom & fungsionalitas penyusun spesifik elemen *Deleted User*.
- **Trash Group Table** - `src/features/trash-bin/trash-group-table.tsx` - kolom & fungsionalitas penyusun spesifik elemen *Deleted Group*.
- **Dialog Trash** - `src/features/trash-bin/_components/trash-dialogs.tsx` - perisai pembendung konfirmasi ganda sebelum eksekusi penghancuran *(hard delete)* disetujui.

Praktik integrasi sinkronisasi penyajian data log gudang penghapusan:

```tsx
import { TrashBinTabs } from "@/src/features/trash-bin/trash-bin-tabs";
import { fetchDeletedQuizzes, fetchDeletedUsers, fetchDeletedGroups } from "@/src/features/trash-bin/actions";
```

### Menambahkan Jenis Data Baru

Peluasan fungsionalitas isolasi (semisal pendaftaran pencatatan aset `Master Games` yang dikarantina/dinonaktifkan), harus dirintis lewat perakitan blok integrasi utilitas tarik-khusus `fetchDeletedGames` di kerangka layer `actions.ts`. Ekstrak temuan barunya menyeruak hingga pilar `TrashBinTabs` demi penyetelan sisipan ruang *Tab Menu* anyar. Akhiri dengan meramu fondasi pemosisian kolom utilitas pemantauan spesifikasinya (*Trash Game Table*) terpisah sendiri. Perisai penyaring konfirmasi ganda wajib menopang manuver penghancur total (aksi *Permanent Delete*) di modul *Dialog* agar memblokir peluang hilangnya dokumen krusial terlanjur dihanguskan.

---
*Deskripsi ini menegaskan pengawasan pengelolaan fasilitas penahanan aset lunak multi-elemen *(Soft-Deleted Entities)* sebelum pemusnahan mutlak.*
