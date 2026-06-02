## Gambaran Umum Quiz Approval

**Quiz Approval** berfungsi sebagai antrean (*queue*) loket validasi konten kuis publik yang diajukan oleh pengguna (*creator*). Berperan vital dalam kontrol kualitas (*quality assurance*), administrator ditugaskan mencari tumpukan kuis yang berstatus *pending*, melakukan penyaringan kategori topik, serta menyetujui (*approve*) atau menolak (*reject*) penayangan dari pintu antarmuka ini.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan Antrean Validasi)** - Rekaman antrean dijemput (fetching) memanfaatkan modul *server action* `fetchQuizApprovals`. Muatan dipotong (paginated) membatasi visibilitas 15 rujukan per permintaan. Format *response* membawa struktur objek kompleks yang membundel daftar kuis tersaring, komputasi total lembar halaman, volume record kasar, berikut katalog kategori valid.

2. **Komponen Pengelola & Interaktivitas Antrean**
   - **Tabel Pemonitoran Approval (`QuizApprovalTable`)** - Konstruksi klien yang menangkap *initialData* rujukan kuis tertunda. Menjalankan filter *Category* dari opsi terintegrasi.
   - **Query Parameter Navigasi** - Sistem pengurutan dan pencarian disinkronisasi mutlak menuju susunan URI (*searchParams*) Next.js. Variabel pelacak seperti `page`, tangkapan kata kunci `search`, dan spesifikasi `category` mereset pemanggilan *fetch* pangkalan data bila diubah.
   - **Navigasi Review Detail** - Segmen tabel memberikan pengungkit relasi klik menuju halaman perinci evaluasi spesifik (`quiz-approval/[id]`), di mana pemeriksaan soal beserta kunci jawaban dilakukan sebelum aksi ratifikasi *(approve/reject)* disahkan.

### Struktur File & Penghubungan

- **Halaman Quiz Approval** - `src/app/(dashboard)/quiz-approval/page.tsx`
- **Server Actions** - `src/features/quiz-approval/actions.ts` - menaungi fungsionalitas fetch *Supabase*.
- **Tabel Approval** - `src/features/quiz-approval/quiz-approval-table.tsx` - abstraksi form penyaring dan iterasi baris *queue*.
- **Kolom Approval** - `src/features/quiz-approval/_components/quiz-approval-columns.tsx`
- **Dialog Approval** - `src/features/quiz-approval/_components/quiz-approval-dialogs.tsx` - rupa *overlay* untuk menahan ketidaksengajaan pengambilan aksi keputusan.
- **Service Approval** - `src/features/quiz-approval/services/quiz-approval-service.ts`

Contoh fiksasi sambungan layer antar pemanggilan agregat dan UI tabel penampung:

```tsx
import { fetchQuizApprovals } from "@/src/features/quiz-approval/actions";
import { QuizApprovalTable } from "@/src/features/quiz-approval/quiz-approval-table";
```

### Menambahkan Alur Review Baru

Jika dibutuhkan penambahan siklus status evaluasi (seperti fungsi karantina untuk plagiarisme atau eskalasi validasi (*Flag for Revision*)), perkenalkan tipe aksi baru di `actions.ts`. Sajikan wujud antarmuka pemicunya (*button* atau instrumen modul `Dialog`) di lapisan *table columns* atau beranda detail. Jaga agar rutinitas penyelesaian transisi ke status yang baru dilakukan secara atomik. Khusus standardisasi naskah penolakan, sinkronkan panggilannya dari modul tata graha `rejection-templates`.

---
*Deskripsi ini menegaskan pengawasan loket antrean penyetujuan publikasi dan moderasi kontrol kualitas kuis.*
