## Gambaran Umum Manage Blog

**Manage Blog** berfungsi sebagai halaman administrasi artikel blog. Administrator dapat melihat daftar artikel, membuat artikel baru, mengedit artikel, dan mengelola status publikasi.

### Bagian-Bagian Utama

1. **Client Manager** - Halaman merender `ManageBlogClient` yang mengelola tabel, filter, dialog, dan aksi artikel.

2. **Tabel Artikel** - Kolom tabel didefinisikan di feature manage-blog untuk menampilkan informasi artikel seperti judul, kategori, status, tanggal, dan aksi.

3. **Dialog Aksi** - Dialog menangani aksi administratif seperti konfirmasi hapus atau perubahan status.

4. **Form Artikel** - `ManageBlogForm` dipakai pada route tambah dan edit, termasuk route `manage-blog/[id]`.

### Struktur File & Penghubungan

- **Halaman Manage Blog** - `src/app/(dashboard)/manage-blog/page.tsx`.
- **Client Manager** - `src/features/manage-blog/manage-blog-client.tsx`.
- **Form Artikel** - `src/features/manage-blog/_components/manage-blog-form.tsx`.
- **Kolom Artikel** - `src/features/manage-blog/_components/manage-blog-columns.tsx`.
- **Dialog Artikel** - `src/features/manage-blog/_components/manage-blog-dialogs.tsx`.
- **Hook Tabel** - `src/features/manage-blog/_hooks/use-manage-blog-table.ts`.
- **Service Blog** - `src/features/blog/services/blogs-service.ts`.

Contoh penghubungan utama:

```tsx
import { ManageBlogClient } from "@/src/features/manage-blog/manage-blog-client";
```

### Menambahkan Field Artikel

Perbarui tipe blog, form, service, dan kolom tabel. Jika field berupa media, pastikan validasi upload dan preview dikelola di `ManageBlogForm`.

---
*Deskripsi ini merangkum alur pengelolaan artikel blog dari daftar sampai form edit.*
