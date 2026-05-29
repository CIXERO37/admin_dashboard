## Gambaran Umum Detail Quiz

**Detail Quiz** berfungsi sebagai halaman informasi lengkap satu quiz. Halaman ini menampilkan detail quiz dan daftar sesi yang menggunakan quiz tersebut.

### Bagian-Bagian Utama

1. **Parameter Quiz ID** - Route membaca `id` dari path `quizzes/[id]`.

2. **Parallel Fetching** - `fetchQuizById` dan `fetchQuizSessions` dijalankan bersamaan dengan `Promise.all`.

3. **Not Found Handling** - Jika quiz tidak ditemukan atau action mengembalikan error, halaman memanggil `notFound()`.

4. **Detail View** - `QuizDetailView` menerima data quiz dan sessions untuk menampilkan informasi utama, pertanyaan, metadata, dan riwayat sesi.

### Struktur File & Penghubungan

- **Halaman Detail Quiz** - `src/app/(dashboard)/quizzes/[id]/page.tsx`.
- **Actions Quizzes** - `src/features/quizzes/actions.ts`.
- **Detail View** - `src/features/quizzes/[id]/quiz-detail-view.tsx`.
- **Quiz Client** - `src/features/quizzes/[id]/quiz-client.tsx`.
- **Tipe Quiz** - `src/features/quizzes/types/quiz.ts`.

Contoh penghubungan utama:

```tsx
import { fetchQuizById, fetchQuizSessions } from "@/src/features/quizzes/actions";
import { QuizDetailView } from "@/src/features/quizzes/[id]/quiz-detail-view";
```

### Menambahkan Section Detail Quiz

Tambahkan data pada action atau gunakan field yang sudah ada di quiz, lalu render section baru di `QuizDetailView`. Jika section memerlukan data sesi, perluas `fetchQuizSessions`.

---
*Deskripsi ini menjelaskan halaman detail quiz sebagai gabungan metadata quiz dan riwayat sesi terkait.*
