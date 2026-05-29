## Gambaran Umum Trash Bin

**Trash Bin** berfungsi sebagai tempat pemulihan atau pengelolaan data yang telah dihapus. Halaman ini memuat deleted quizzes, deleted users, dan deleted groups secara paralel.

### Bagian-Bagian Utama

1. **Dynamic Rendering** - Halaman memakai `dynamic = "force-dynamic"` agar data deleted selalu diambil terbaru.

2. **Parallel Fetching** - `fetchDeletedQuizzes`, `fetchDeletedUsers`, dan `fetchDeletedGroups` dijalankan dengan `Promise.all`.

3. **Tabs Trash Bin** - `TrashBinTabs` menerima tiga dataset awal dan memisahkan tampilan berdasarkan jenis data.

4. **Tabel Per Jenis Data** - Feature trash-bin memiliki tabel khusus untuk quiz, user, dan group agar kolom dan aksi masing-masing bisa berbeda.

### Struktur File & Penghubungan

- **Halaman Trash Bin** - `src/app/(dashboard)/trash-bin/page.tsx`.
- **Actions Trash Bin** - `src/features/trash-bin/actions.ts`.
- **Tabs Trash Bin** - `src/features/trash-bin/trash-bin-tabs.tsx`.
- **Trash Quiz Table** - `src/features/trash-bin/trash-quiz-table.tsx`.
- **Trash User Table** - `src/features/trash-bin/trash-user-table.tsx`.
- **Trash Group Table** - `src/features/trash-bin/trash-group-table.tsx`.
- **Dialog Trash** - `src/features/trash-bin/_components/trash-dialogs.tsx`.

Contoh penghubungan utama:

```tsx
import { TrashBinTabs } from "@/src/features/trash-bin/trash-bin-tabs";
import { fetchDeletedQuizzes, fetchDeletedUsers, fetchDeletedGroups } from "@/src/features/trash-bin/actions";
```

### Menambahkan Jenis Data Baru

Tambahkan fetch action untuk entity baru, teruskan data ke `TrashBinTabs`, lalu buat tabel dan kolom khusus. Pastikan aksi restore dan delete permanen memiliki konfirmasi.

---
*Deskripsi ini menjelaskan trash-bin sebagai modul multi-tab untuk data yang telah dihapus.*
