## Gambaran Umum Category

**Category** berfungsi sebagai halaman pengelolaan kategori quiz atau konten. Administrator dapat melihat daftar kategori dan mengelola data kategori melalui tabel feature.

### Bagian-Bagian Utama

1. **Server-Side Fetching** - Data kategori diambil melalui `CategoryService.fetchCategories()` pada server component.

2. **Error State** - Jika service mengembalikan error, halaman menampilkan pesan gagal memuat data dalam style `text-destructive`.

3. **Tabel Kategori** - `CategoryTable` menerima `initialData` dan mengelola tampilan daftar, filter, serta aksi kategori.

4. **Metadata Halaman** - Route memiliki metadata title `Categories | Admin Dashboard`.

### Struktur File & Penghubungan

- **Halaman Category** - `src/app/(dashboard)/category/page.tsx`.
- **Service Category** - `src/features/category/services/category-service.ts`.
- **Tabel Category** - `src/features/category/_components/category-table.tsx`.
- **Kolom Category** - `src/features/category/_components/category-columns.tsx`.
- **Dialog Category** - `src/features/category/_components/category-dialogs.tsx`.
- **Hook Tabel** - `src/features/category/_hooks/use-category-table.ts`.
- **Tipe Category** - `src/features/category/types/category.ts`.

Contoh penghubungan utama:

```tsx
import { CategoryService } from "@/src/features/category/services/category-service";
import { CategoryTable } from "@/src/features/category/_components/category-table";
```

### Menambahkan Field Kategori

Perbarui tipe category, service Supabase, dialog form, dan kolom tabel. Jika kategori dipakai oleh quiz atau approval, pastikan perubahan field tidak merusak filter kategori di modul lain.

---
*Deskripsi ini menjelaskan halaman kategori sebagai modul CRUD sederhana dengan fetching server-side.*
