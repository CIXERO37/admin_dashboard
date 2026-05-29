## Gambaran Umum Edit Manage Blog

**Edit Manage Blog** berfungsi sebagai halaman form edit untuk satu artikel blog. Halaman ini mengambil artikel berdasarkan ID lalu mengirimkannya ke form dengan mode edit.

### Bagian-Bagian Utama

1. **Parameter Blog ID** - Route membaca `id` dari path `manage-blog/[id]`.

2. **Server Supabase Client** - Halaman memakai `getSupabaseServerClient` untuk query server-side.

3. **Fetch Artikel** - Query mengambil `*` dari tabel `blogs` dengan kondisi `id = params.id`.

4. **Not Found UI** - Jika artikel tidak ditemukan, halaman menampilkan pesan `Article not found`.

5. **Form Edit Artikel** - `ManageBlogForm` menerima `initialData` dan `blogId`.

### Struktur File & Penghubungan

- **Halaman Edit Blog** - `src/app/(dashboard)/manage-blog/[id]/page.tsx`.
- **Form Artikel** - `src/features/manage-blog/_components/manage-blog-form.tsx`.
- **Server Supabase** - `lib/supabase-server`.
- **Manage Blog Client** - `src/features/manage-blog/manage-blog-client.tsx`.
- **Service Blog** - `src/features/blog/services/blogs-service.ts`.

Contoh penghubungan utama:

```tsx
import { ManageBlogForm } from "@/src/features/manage-blog/_components/manage-blog-form";
import { getSupabaseServerClient } from "@/lib/supabase-server";
```

### Menambahkan Field Edit Artikel

Perbarui `ManageBlogForm`, tipe blog, dan service penyimpanan. Jika field berupa rich text atau media, pastikan preview dan validasinya tersedia sebelum submit.

---
*Deskripsi ini menjelaskan halaman edit artikel blog dan cara initial data diambil dari Supabase.*
