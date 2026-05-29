## Gambaran Umum Detail Group

**Detail Group** berfungsi sebagai halaman informasi satu grup dan daftar anggotanya. Administrator dapat melihat data grup, mencari anggota, memfilter role, dan menelusuri pagination member.

### Bagian-Bagian Utama

1. **Parameter Group ID** - Route membaca `id` dari path `groups/[id]`.

2. **Query Parameter Member** - Halaman membaca `page`, `search`, dan `role` dari URL untuk daftar anggota.

3. **Fetch Group Detail** - `fetchGroupById` mengambil data grup. Jika tidak ditemukan, halaman memanggil `notFound()`.

4. **Fetch Members** - `fetchGroupMembers` mengambil anggota berdasarkan `groupId`, page, limit 10, search, dan role filter.

5. **Client Detail** - `GroupDetailClient` menerima group, members, totalPages, currentPage, searchQuery, dan roleFilter.

### Struktur File & Penghubungan

- **Halaman Detail Group** - `src/app/(dashboard)/groups/[id]/page.tsx`.
- **Actions Groups** - `src/features/groups/actions.ts`.
- **Client Detail** - `src/features/groups/[id]/group-detail-client.tsx`.
- **Tipe Group** - `src/features/groups/types/group.ts`.
- **Halaman Groups** - `src/app/(dashboard)/groups/page.tsx`.

Contoh penghubungan utama:

```tsx
import { fetchGroupById, fetchGroupMembers } from "@/src/features/groups/actions";
import { GroupDetailClient } from "@/src/features/groups/[id]/group-detail-client";
```

### Menambahkan Tab Detail Group

Tambahkan data fetch baru setelah group ditemukan, lalu teruskan ke `GroupDetailClient`. Jika tab memiliki pagination sendiri, gunakan query parameter terpisah agar tidak bentrok dengan pagination members.

---
*Deskripsi ini menjelaskan detail group sebagai halaman profil grup dan daftar anggota terfilter.*
