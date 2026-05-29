## Gambaran Umum Manage Games

**Manage Games** berfungsi sebagai halaman administrasi master data game. Halaman ini digunakan untuk melihat, membuat, mengubah, dan mengelola status game yang tersedia di sistem.

### Bagian-Bagian Utama

1. **Client Table Manager** - Halaman utama merender `ManageGamesClient`, yang menjadi pusat pengelolaan tabel, filter, aksi, dan dialog.

2. **Tabel Master Game** - Data master game ditampilkan melalui konfigurasi kolom dari feature manage-games. Tabel mendukung pencarian, aksi edit, dan aksi pengelolaan data.

3. **Dialog Aksi** - Komponen dialog dipakai untuk konfirmasi atau operasi terkait record game. Pola ini dipisah agar aksi tabel tetap reusable.

4. **Form Game** - Form game digunakan pada route tambah dan edit. Form menerima `initialData` saat berada di mode edit.

### Struktur File & Penghubungan

- **Halaman Manage Games** - `src/app/(dashboard)/manage-games/page.tsx`.
- **Client Manager** - `src/features/manage-games/manage-games-client.tsx`.
- **Kolom Tabel** - `src/features/manage-games/_components/manage-games-columns.tsx`.
- **Dialog Tabel** - `src/features/manage-games/_components/manage-games-dialogs.tsx`.
- **Hook Tabel** - `src/features/manage-games/_hooks/use-manage-games-table.ts`.
- **Form Game** - `src/features/manage-games/_components/manage-game-form.tsx`.
- **Service Master Game** - `src/features/manage-games/services/master-games-service.ts`.

Contoh penghubungan utama:

```tsx
import { ManageGamesClient } from "@/src/features/manage-games/manage-games-client";
```

### Menambahkan Field atau Aksi Baru

Tambahkan field ke tipe `master-game`, perbarui service Supabase, lalu sesuaikan kolom tabel dan `ManageGameForm`. Untuk aksi baru, tempatkan logika UI di dialog atau hook tabel agar halaman tetap tipis.

---
*Deskripsi ini menjelaskan peran Manage Games sebagai modul CRUD master game dan lokasi file yang mengelola perilaku utamanya.*
