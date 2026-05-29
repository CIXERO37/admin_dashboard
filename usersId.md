## Gambaran Umum Detail User

**Detail User** berfungsi sebagai halaman profil lengkap pengguna. Halaman ini menampilkan data profil, quiz yang dimainkan, quiz yang dibuat, dan aktivitas game pengguna.

### Bagian-Bagian Utama

1. **Parameter User ID** - Route membaca `id` dari `params` pada path `users/[id]`.

2. **Parallel Fetching** - Data profil, user quizzes, created quizzes, dan game activity diambil secara paralel memakai `Promise.all`.

3. **Not Found Handling** - Jika profil tidak ditemukan atau action mengembalikan error, halaman memanggil `notFound()`.

4. **Client Detail View** - `UserDetailClient` menerima semua dataset dan mengelola tampilan detail serta tab aktivitas.

### Struktur File & Penghubungan

- **Halaman Detail User** - `src/app/(dashboard)/users/[id]/page.tsx`.
- **Actions Users** - `src/features/users/actions.ts`.
- **Client Detail** - `src/features/users/[id]/user-detail-client.tsx`.
- **Profile Client** - `src/features/users/[id]/profile-client.tsx`.
- **Tipe User** - `src/features/users/types/user.ts`.

Contoh penghubungan utama:

```tsx
import { fetchProfileById, fetchUserQuizzes, fetchCreatedQuizzes, fetchUserGameActivity } from "@/src/features/users/actions";
import { UserDetailClient } from "@/src/features/users/[id]/user-detail-client";
```

### Menambahkan Tab Detail Baru

Tambahkan fetch action baru jika data berasal dari Supabase, masukkan ke `Promise.all`, lalu teruskan ke `UserDetailClient`. Pastikan fallback kosong tersedia agar halaman tetap render ketika data opsional tidak ada.

---
*Deskripsi ini menjelaskan detail user sebagai halaman agregasi profil, quiz, dan aktivitas game.*
