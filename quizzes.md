## Gambaran Umum Halaman Quizzes

**Quizzes** berfungsi sebagai halaman daftar master quiz. Administrator dapat melihat, mencari, memfilter, dan membuka detail quiz dari data yang tersedia di store dashboard.

### Bagian-Bagian Utama

1. **Data dari Dashboard Store** - Halaman mengambil `quizzes` dan `isLoading` dari `useDashboardData`.

2. **Skeleton Loading** - Jika data masih kosong saat loading, halaman menampilkan skeleton header, kontrol filter, dan area tabel.

3. **Tabel Quiz** - `QuizTable` menerima `initialData` berupa array quiz dan mengelola tampilan daftar, filter, dan aksi row.

4. **Navigasi Detail** - Record quiz dapat diarahkan ke route `quizzes/[id]` untuk melihat informasi quiz dan sesi terkait.

### Struktur File & Penghubungan

- **Halaman Quizzes** - `src/app/(dashboard)/quizzes/page.tsx`.
- **Tabel Quiz** - `src/features/quizzes/quiz-table.tsx`.
- **Kolom Quiz** - `src/features/quizzes/_components/quiz-columns.tsx`.
- **Dialog Quiz** - `src/features/quizzes/_components/quiz-dialogs.tsx`.
- **Hook Tabel** - `src/features/quizzes/_hooks/use-quizzes-table.ts`.
- **Actions Quiz** - `src/features/quizzes/actions.ts`.
- **Tipe Quiz** - `src/features/quizzes/types/quiz.ts`.

Contoh penghubungan utama:

```tsx
import { QuizTable } from "@/src/features/quizzes/quiz-table";
import { useDashboardData } from "@/contexts/dashboard-store";
```

### Menambahkan Kolom atau Filter Baru

Tambahkan field di tipe quiz dan query action jika dibutuhkan, lalu perbarui `quiz-columns.tsx` serta hook tabel. Untuk filter baru, pastikan state filter tersentral di hook agar `QuizTable` tetap mudah dipelihara.

---
*Deskripsi ini merangkum alur halaman daftar quiz dari store dashboard sampai tabel feature quizzes.*
