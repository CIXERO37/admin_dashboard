## Gambaran Umum Quiz Approval

**Quiz Approval** berfungsi sebagai halaman antrian review quiz yang diajukan pengguna. Administrator dapat mencari quiz pending, memfilter berdasarkan kategori, dan membuka detail untuk approve atau reject.

### Bagian-Bagian Utama

1. **Query Parameter Approval** - Halaman membaca `page`, `search`, dan `category` dari URL.

2. **Server-Side Fetching** - Data approval diambil melalui `fetchQuizApprovals` dengan limit 15. Response mencakup data, total halaman, total record, dan daftar kategori.

3. **Tabel Approval** - `QuizApprovalTable` menerima data awal dan filter aktif untuk menampilkan daftar quiz yang perlu direview.

4. **Navigasi Review Detail** - Setiap item dapat dibuka ke `quiz-approval/[id]` untuk melihat isi quiz dan menjalankan aksi approve atau reject.

### Struktur File & Penghubungan

- **Halaman Quiz Approval** - `src/app/(dashboard)/quiz-approval/page.tsx`.
- **Server Actions** - `src/features/quiz-approval/actions.ts`.
- **Tabel Approval** - `src/features/quiz-approval/quiz-approval-table.tsx`.
- **Kolom Approval** - `src/features/quiz-approval/_components/quiz-approval-columns.tsx`.
- **Dialog Approval** - `src/features/quiz-approval/_components/quiz-approval-dialogs.tsx`.
- **Service Approval** - `src/features/quiz-approval/services/quiz-approval-service.ts`.

Contoh penghubungan utama:

```tsx
import { fetchQuizApprovals } from "@/src/features/quiz-approval/actions";
import { QuizApprovalTable } from "@/src/features/quiz-approval/quiz-approval-table";
```

### Menambahkan Alur Review Baru

Tambahkan aksi baru di `actions.ts`, tampilkan tombol atau dialog di tabel/detail, lalu pastikan status quiz diperbarui secara atomik. Untuk alasan penolakan standar, integrasikan dengan modul `rejection-templates`.

---
*Deskripsi ini menjelaskan fungsi halaman antrian approval quiz dan alur menuju detail review.*
