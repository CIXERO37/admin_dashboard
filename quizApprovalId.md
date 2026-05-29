## Gambaran Umum Detail Quiz Approval

**Detail Quiz Approval** berfungsi sebagai halaman review satu quiz yang menunggu persetujuan. Administrator dapat memeriksa metadata, creator, daftar pertanyaan, jawaban benar, lalu approve atau reject quiz.

### Bagian-Bagian Utama

1. **Parameter Approval ID** - Route membaca `id` dari path `quiz-approval/[id]` dan menyimpannya sebagai `quizId`.

2. **Fetch Data Approval** - Data diambil melalui `fetchQuizApprovalById`. Jika tidak ditemukan, toast error ditampilkan dan user diarahkan kembali ke `/quiz-approval`.

3. **Header Aksi Review** - Tombol Reject dan Approve membuka dialog konfirmasi masing-masing.

4. **Informasi Quiz** - Card menampilkan cover image, title, description, creator, category, language, dan created date.

5. **Daftar Pertanyaan** - Section questions menampilkan teks pertanyaan, opsi jawaban, dan badge untuk jawaban yang benar.

6. **Dialog Approve/Reject** - `approveQuizAction` menjalankan approval, sedangkan `rejectQuizAction` membutuhkan alasan penolakan.

### Struktur File & Penghubungan

- **Halaman Detail Approval** - `src/app/(dashboard)/quiz-approval/[id]/page.tsx`.
- **Actions Approval** - `src/features/quiz-approval/actions.ts`.
- **Halaman List Approval** - `src/app/(dashboard)/quiz-approval/page.tsx`.
- **Avatar UI** - `src/components/ui/avatar.tsx`.
- **Dialog UI** - `src/components/ui/dialog.tsx`.
- **Textarea UI** - `src/components/ui/textarea.tsx`.

Contoh penghubungan utama:

```tsx
import { fetchQuizApprovalById, approveQuizAction, rejectQuizAction } from "@/src/features/quiz-approval/actions";
```

### Menambahkan Template Penolakan

Ambil daftar template dari feature `rejection-templates`, tampilkan pilihan template di dialog reject, lalu isi `rejectReason` dari template yang dipilih. Tetap izinkan admin mengedit alasan sebelum submit.

---
*Deskripsi ini menjelaskan halaman review quiz approval dan alur approve/reject.*
