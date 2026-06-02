## Gambaran Umum Detail Quiz

**Detail Quiz** bertindak sebagai *hub* investigasi (profil rincian) individual dari satu spesifik objek materi kuis. Halaman pendalaman log ini merepresentasikan atribut detail dari kemasan statis kuis, membeberkan kisi-kisi pertanyaan terlampir, beserta merekap seluruh kronik pementasan kuis tersebut di pelbagai rekam log penyelenggaraan sesi *game*.

### Bagian-Bagian Utama

1. **Data Source (Penarikan Asinkron Paralel)* 
   - **Tangkapan Identifier URI** - Nomor kode resi tangkapan di-ekstrak dengan utilitas pelacak jalur dinamis *Next.js URL Slug* pada path URI `quizzes/[id]`.
   - **Agregasi Multi-Dimensi** - Eksekutor penarikan lapisan basis data mengolaborasikan dua fungsi pencarian (katalog metadata kuis `fetchQuizById` digabung utilitas pencatat sesi riwayat `fetchQuizSessions`) dirangkaikan sekaligus memakai kapabilitas *Promise.all* untuk sinkronisasi pemuatan pangkalan *server-side* yang jauh lebih cepat.
   - **Error Handling (Proteksi Rute)* - Tatkala *UUID* yang dicari luput dari pencocokan, perlindungan *Not Found* diinisiasikan yang menghantam (*fallback*) *render component* normal dengan tampilan penghentian utilitas `notFound()`.

2. **Komponen Pengelola & Pemonitoran Visual (`QuizDetailView`)** 
   - Komponen rekayasa cangkang terpadu yang dibenamkan peranan menghidangkan muatan antarmuka pasca perakitan asinkron selesai. Menggabungkan kompilasi blok elemen UI menjadi wadah representasi interaktif. Mempertontonkan informasi pokok meta (Judul/Kreator), membelah rincian rumusan kuis, serta mencetak deretan *track-record* pengerjaan riwayat *game session*.

### Struktur File & Penghubungan

- **Halaman Detail Quiz** - `src/app/(dashboard)/quizzes/[id]/page.tsx`
- **Actions Quizzes** - `src/features/quizzes/actions.ts` - utilitas sentral logik penarikan kueri agregasi *database* paralel.
- **Detail View** - `src/features/quizzes/[id]/quiz-detail-view.tsx` - *wrapper component* agregator klien perender konten komprehensif.
- **Quiz Client** - `src/features/quizzes/[id]/quiz-client.tsx`
- **Tipe Quiz** - `src/features/quizzes/types/quiz.ts`

Format penyajian fungsional pangkalan *API Loader* pada pengerjaan agregasi kueri:

```tsx
import { fetchQuizById, fetchQuizSessions } from "@/src/features/quizzes/actions";
import { QuizDetailView } from "@/src/features/quizzes/[id]/quiz-detail-view";
```

### Menambahkan Section Detail Quiz

Eskalasi panel baru pada peninjauan utilitas laporan profil (contoh: Grafik Metrik Popularitas Peminat Soal vs Evaluasi Kegagalan), mengharuskan injeksi penambahan selektor agregat pada modul fungsional *actions*. Alternatif lainnya ialah mengutilisasi *fields/columns* kuis bawaan ke wadah fungsi presentasional di layar profil `QuizDetailView`. Beri sokongan pemanggilan *props array payload* modifikatif via pelebaran cakupan kueri *Supabase* `fetchQuizSessions`, manakala desain blok utilitas barunya membidik analisis mendalam tren interaksi (*session analytics*).

---
*Deskripsi ini menegaskan pendayagunaan model pemonitoran agregat ganda penarik profil meta kuis disatukan lintasan kronik penyajiannnya.*
