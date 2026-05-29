## Gambaran Umum Rejection Templates

**Rejection Templates** berfungsi sebagai pusat pengelolaan template alasan penolakan quiz. Halaman ini membantu administrator menjaga konsistensi pesan saat menolak konten yang tidak memenuhi standar.

### Bagian-Bagian Utama

1. **Template Table** - Halaman merender `TemplateTable` sebagai komponen utama untuk daftar template.

2. **Kolom Template** - Konfigurasi kolom berada di feature rejection-templates dan menampilkan informasi template seperti judul, isi pesan, status, atau aksi.

3. **Dialog CRUD** - Dialog digunakan untuk membuat, mengubah, atau menghapus template alasan penolakan.

4. **Service Template** - Operasi data dipusatkan di service agar query Supabase tidak tersebar di komponen UI.

### Struktur File & Penghubungan

- **Halaman Rejection Templates** - `src/app/(dashboard)/rejection-templates/page.tsx`.
- **Tabel Template** - `src/features/rejection-templates/template-table.tsx`.
- **Kolom Template** - `src/features/rejection-templates/_components/template-columns.tsx`.
- **Dialog Template** - `src/features/rejection-templates/_components/template-dialogs.tsx`.
- **Hook Tabel** - `src/features/rejection-templates/_hooks/use-templates-table.ts`.
- **Actions** - `src/features/rejection-templates/actions.ts`.
- **Service** - `src/features/rejection-templates/services/rejection-template-service.ts`.

Contoh penghubungan utama:

```tsx
import { TemplateTable } from "@/src/features/rejection-templates/template-table";
```

### Menambahkan Template Baru

Tambahkan field baru pada tipe template jika diperlukan, perbarui service dan dialog form, lalu tampilkan field tersebut pada kolom tabel. Pastikan template yang aktif dapat dipakai kembali oleh alur `quiz-approval`.

---
*Deskripsi ini merangkum halaman pengelolaan template penolakan dan hubungan file feature terkait.*
