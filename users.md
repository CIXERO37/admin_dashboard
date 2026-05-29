## Gambaran Umum Users

**Users** berfungsi sebagai halaman daftar pengguna dan administrator. Halaman ini dipakai untuk mencari, memfilter, melihat status akun, dan membuka detail profil pengguna.

### Bagian-Bagian Utama

1. **Data dari Dashboard Store** - Halaman mengambil `users` dan `isLoading` melalui `useDashboardData`.

2. **Skeleton Loading** - Saat data belum tersedia, halaman menampilkan skeleton header, filter, dan tabel.

3. **User Table** - `UserTable` menerima `initialData` dan menangani daftar pengguna, filter role, filter status, dan aksi row.

4. **Navigasi Detail User** - Setiap user dapat dibuka ke route `users/[id]` untuk melihat profil, quiz, dan aktivitas game.

### Struktur File & Penghubungan

- **Halaman Users** - `src/app/(dashboard)/users/page.tsx`.
- **User Table** - `src/features/users/_components/user-table.tsx`.
- **Kolom User** - `src/features/users/_components/user-columns.tsx`.
- **Filter User** - `src/features/users/_components/user-filters.tsx`.
- **Dialog User** - `src/features/users/_components/user-dialogs.tsx`.
- **Hook Tabel** - `src/features/users/_hooks/use-users-table.ts`.
- **Actions Users** - `src/features/users/actions.ts`.
- **Service User** - `src/features/users/services/user-service.ts`.

Contoh penghubungan utama:

```tsx
import { UserTable } from "@/src/features/users/_components/user-table";
import { useDashboardData } from "@/contexts/dashboard-store";
```

### Menambahkan Aksi User

Tambahkan action di `actions.ts` atau `user-service.ts`, expose handler di hook tabel, lalu tampilkan tombol atau dialog pada kolom user. Pastikan aksi sensitif seperti block atau role change mematuhi RBAC.

---
*Deskripsi ini menjelaskan halaman daftar pengguna dan hubungan dengan detail profil user.*
