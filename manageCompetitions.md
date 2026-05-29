## Gambaran Umum Manage Competitions

**Manage Competitions** berfungsi sebagai halaman administrasi daftar kompetisi. Halaman ini dipakai untuk melihat kompetisi, membuat kompetisi baru, mengedit data, dan membuka detail pengelolaan fase kompetisi.

### Bagian-Bagian Utama

1. **Client Manager** - Halaman merender `ManageCompetitionsClient` sebagai pusat tabel, filter, dan aksi.

2. **Tabel Kompetisi** - Kolom tabel berada di feature manage-competitions dan menampilkan informasi utama seperti judul, status, tanggal, biaya, hadiah, dan aksi.

3. **Dialog dan Aksi** - Dialog dipakai untuk operasi administratif seperti konfirmasi, hapus, atau aksi status.

4. **Form Tambah/Edit** - Form kompetisi berada di `_components/add-competition-form.tsx` dan route detail edit memakai data kompetisi terkait.

5. **Detail Kompetisi** - Route `manage-competitions/[id]` membuka workspace fase kompetisi seperti registration, payment, qualification, group stage, dan completed.

### Struktur File & Penghubungan

- **Halaman Manage Competitions** - `src/app/(dashboard)/manage-competitions/page.tsx`.
- **Client Manager** - `src/features/manage-competitions/manage-competitions-client.tsx`.
- **Kolom Tabel** - `src/features/manage-competitions/_components/competition-columns.tsx`.
- **Dialog** - `src/features/manage-competitions/_components/competition-dialogs.tsx`.
- **Hook Tabel** - `src/features/manage-competitions/_hooks/use-competitions-table.ts`.
- **Service** - `src/features/manage-competitions/services/competition-service.ts`.
- **Tipe Kompetisi** - `src/features/manage-competitions/types/competition.ts`.

Contoh penghubungan utama:

```tsx
import { ManageCompetitionsClient } from "@/src/features/manage-competitions/manage-competitions-client";
```

### Menambahkan Aksi Baru

Tambahkan action di service atau actions feature, sambungkan ke hook tabel, lalu tampilkan tombol pada kolom atau dialog. Untuk aksi yang memengaruhi peserta, pastikan sinkron dengan halaman detail kompetisi.

---
*Deskripsi ini merangkum halaman daftar kompetisi dan hubungan dengan form serta workspace detail kompetisi.*
