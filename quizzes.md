## Gambaran Umum Halaman Quizzes

**Quizzes** dioperasikan sebagai lemari arsip (Katalog Induk Master) kuis sistem. Administrator disediakan wewenang otoritas pemonitoran (termasuk penelusuran nama/judul, pemfilteran label kriteria tipe fungsional), serta titik lompat menuju peninjauan performa mendalam (*drill-down*) sesi dan materi suatu dokumen kuis secara spesifik.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan *Global Store*)** - Prosedur pengisian baris tidak mendayagunakan rute kueri peladen individual. Ia justru mengikat (subscribing) ke pemanggilan arsitektur pelestari sesi (State Management Context), `useDashboardData`, menarik instansiasi array `quizzes` tersimpan (ter-*cache*), sejalan dengan penerimaan notifikasi siklus pemuatannya (`isLoading`).

2. **Komponen Pembungkus & Kontrol Panel**
   - **Tabel Susunan Induk Kuis (`QuizTable`)** - Komponen antarmuka manajer daftar. `QuizTable` menerima *props array initialData* yang dilempar dari penangkapan pusat, lantas mengonversikannya pada susunan *Grid* rapi. Menghidupkan utilitas filter relasional mandiri dan pengelompokan pemicu tombol manipulasi *Record Action* di masing-masing rinciannya.
   - **Indikator Perlindungan Muatan (*Skeleton Loading*)** - Sepanjang waktu tunggu pelunasan *promise fetching Store*, layout pembungkus antarmuka (termasuk *header*, input saringan filter, serta baris kisi sel grid data kuis) diisi ornamen *skeleton* guna melindungi dari rembesan anomali layout melompat.
   - **Navigasi Rincian Kuis** - ID kuis unik pada pilar *Record* spesifik bertindak menjadi properti pautan penghubung melompat menuju rute `quizzes/[id]`. Pada segmen perhentian ini, informasi utilitas materi (pertanyaan dan opsi jawaban) serta sejarah penyajian sesi yang melampirkan karya kuis tersebut dieksploitasi detail.

### Struktur File & Penghubungan

- **Halaman Quizzes** - `src/app/(dashboard)/quizzes/page.tsx`
- **Tabel Quiz** - `src/features/quizzes/quiz-table.tsx` - instrumen modul kontrol logika antarmuka klien *filtering & render*.
- **Kolom Quiz** - `src/features/quizzes/_components/quiz-columns.tsx` - abstraksi deklarasi properti kolom skema sel tabel.
- **Dialog Quiz** - `src/features/quizzes/_components/quiz-dialogs.tsx`
- **Hook Tabel** - `src/features/quizzes/_hooks/use-quizzes-table.ts`
- **Actions Quiz** - `src/features/quizzes/actions.ts` - menampung operasi pemanggilan kueri log Supabase dasar.
- **Tipe Quiz** - `src/features/quizzes/types/quiz.ts`

Praktik integrasi sinkronisasi penyajian log *dashboard store* bersilangan modul penyusun kisi baris kuis:

```tsx
import { QuizTable } from "@/src/features/quizzes/quiz-table";
import { useDashboardData } from "@/contexts/dashboard-store";
```

### Menambahkan Kolom atau Filter Baru

Langkah peluasan integrasi kontrol tabel pencarian ekstra (umpama merakit modul pengelompokkan status *approval*/kategori bahasa), ditangani di aras perombakan instrumen kontrol status *Hook* pangkalan filter. Pusatkan *State* form penyaring ini ke fungsi `use-quizzes-table.ts` guna menegakkan keterbacaan kode (*maintainability*), yang selanjutnya diselaraskan dengan pendirian balok kontrol faset instrumen visual tabel `QuizTable`. Perluasan penyajian bidang kolom baru (yang bersandar pada modifikasi ekstensi antarmuka objek *tipe quiz*) wajib didaftarkan di urutan array konfigurasi pelabelan `quiz-columns.tsx`.

---
*Deskripsi ini menegaskan pemanfaatan metode penyerapan cache *State Context* sistem ke dalam modul pemonitoran *induk kuis*.*
