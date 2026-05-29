## Gambaran Umum Manage Sessions

**Manage Sessions** berfungsi sebagai halaman pemeliharaan sesi game yang berada pada kondisi waiting terlalu lama. Halaman ini membantu administrator membersihkan atau menindaklanjuti sesi stale.

### Bagian-Bagian Utama

1. **Fetch Stale Waiting Sessions** - Halaman mengambil data melalui `fetchStaleWaitingSessions`.

2. **Tabel Manage Sessions** - `ManageSessionsTable` menerima `initialData` dan `initialError` untuk menampilkan sesi yang perlu dikelola.

3. **Kolom Aksi Sesi** - Kolom tabel feature manage-sessions menyediakan informasi sesi dan aksi administratif.

4. **Error Handling Awal** - Error dari server action diteruskan ke tabel agar pengguna mendapat feedback yang jelas.

### Struktur File & Penghubungan

- **Halaman Manage Sessions** - `src/app/(dashboard)/manage-sessions/page.tsx`.
- **Actions** - `src/features/manage-sessions/actions.ts`.
- **Tabel Manage Sessions** - `src/features/manage-sessions/manage-sessions-table.tsx`.
- **Kolom Tabel** - `src/features/manage-sessions/_components/manage-sessions-columns.tsx`.
- **Hook Tabel** - `src/features/manage-sessions/_hooks/use-manage-sessions-table.ts`.
- **Tipe Data** - `src/features/manage-sessions/types/manage-session.ts`.

Contoh penghubungan utama:

```tsx
import { fetchStaleWaitingSessions } from "@/src/features/manage-sessions/actions";
import { ManageSessionsTable } from "@/src/features/manage-sessions/manage-sessions-table";
```

### Menambahkan Kriteria Stale Baru

Perbarui query di `fetchStaleWaitingSessions`, tambahkan indikator pada kolom tabel, lalu sesuaikan aksi jika ada tipe sesi baru yang perlu ditangani.

---
*Deskripsi ini menjelaskan halaman pemeliharaan sesi waiting yang membutuhkan intervensi admin.*
