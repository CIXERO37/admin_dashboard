## Gambaran Umum Detail Quiz Approval

**Detail Quiz Approval** berfungsi sebagai panel ruang pemeriksaan individual (Review Board) untuk sebuah kuis yang mengajukan penayangan. Pada perhentian ini, administrator diberi hak menyidak metadata *Creator*, kualitas rumusan butir pertanyaan, indikator pengecoh/jawaban akurat, guna menarik kesimpulan validasi akhir (merestui / menolak pengajuannya).

### Bagian-Bagian Utama

1. **Data Source (Penarikan Kuis Menyeluruh)** 
   - **Tangkapan Approval ID** - Nomor parameter diserap (di-capture) menggunakan rute slug URI `quiz-approval/[id]` lalu di-binding dalam sebutan `quizId`.
   - **Eksekutor Kueri Kuis** - Muatan isi pangkalan data (satu set lengkap soal & jawaban) diakses dengan rutin fungsi `fetchQuizApprovalById`. 
   - **Fallback Penolakan Error** - Bilamana pelacakan parameter bernilai *null*, prosedur penghentian layar bekerja menampilkan pesan diagnostik (*toast error*) diikuti translasi navigasi memaksa user memutar balik ke direktori `/quiz-approval`.

2. **Komponen Inspeksi & Fungsionalitas Keputusan**
   - **Panel Informasi Pokok Kuis** - Modul (kartu UI) yang memeragakan data kemasan statis: judul (Title), sampul brosur (Cover Image), klasifikasi Kategori, lokalisasi Bahasa, profil identitas Pengunggah, dan waktu perekaman.
   - **Daftar Rincian Evaluasi Soal (Section Questions)** - Perwujudan struktur iteratif matriks butir soal di mana penilik (Admin) disajikan rumusan pertanyaan, variasi opsi jebakan, serta indikator lencana label (badge) penanda jawaban sahih.
   - **Aksi Review & Modul Dialog** - Antarmuka pengambilan sikap. Tombol pemutus men-trigger peluncuran dialog interupsi (Approval/Rejection Dialog). Fungsionalitas `approveQuizAction` beroperasi langsung memindahkan status menjadi terbit, sedangkan fungsi `rejectQuizAction` menuntut syarat pendahuluan berupa penjelasan justifikasi (reject reason) atas penolakan penayangan.

### Struktur File & Penghubungan

- **Halaman Detail Approval** - `src/app/(dashboard)/quiz-approval/[id]/page.tsx`
- **Actions Approval** - `src/features/quiz-approval/actions.ts` - menampung operasi pemanggilan Supabase dan logika transisi pembaruan status publisitas kuis.
- **Halaman List Approval** - `src/app/(dashboard)/quiz-approval/page.tsx`
- **Avatar UI** - `src/components/ui/avatar.tsx`
- **Dialog UI** - `src/components/ui/dialog.tsx` - arsitektur konfirmasi modul persetujuan/penolakan.
- **Textarea UI** - `src/components/ui/textarea.tsx`

Skema tata cara implementasi import untuk mengaktifkan pemrosesan moderasi:

```tsx
import { fetchQuizApprovalById, approveQuizAction, rejectQuizAction } from "@/src/features/quiz-approval/actions";
```

### Menambahkan Template Penolakan

Untuk menyeragamkan standar balasan teguran pelanggaran/ketidaklayakan (misalnya plagiasi soal), sinkronkan penarikan daftar dari repositori `rejection-templates`. Implementasikan ke modul UI pemilih (dropdown) pada selubung layar (Dialog) Reject, lalu salin otomatis teks tersebut mengisi blok variabel `rejectReason`. Jagalah kapabilitas admin untuk bisa senantiasa melakukan penyuntingan manual pada muatan blok keterangan (*Textarea*) sebelum prosedur pembatalan kuis (submit) dilontarkan ke layanan peladen.

---
*Deskripsi ini membedah operasional komite periksa dan rutinitas pengambilan ketetapan status pendaftaran kuis publik.*
