## Gambaran Umum Receptionist

**Receptionist** difungsikan sebagai konsol pengawas log operasional garda depan (*Front-Desk*) untuk pencatatan kehadiran audiens ajang perlombaan. Modul ini beroperasi selaku halaman pangkalan rujukan yang menyortir katalog kegiatan *event/competition* aktif yang berhak diproses rekam jejak kedatangannya. 

### Bagian-Bagian Utama

1. **Data Source (Pengambilan Kueri Server-Side)** - Arus direktori katalog ditarik dari basis data memanfaatkan fungsionalitas asinkron *server action* `fetchCompetitions` dari utilitas servis layer (feature *receptionist*). Rekaman agregat ditransmisikan menuju komponen UI bersama dengan instrumen penahan eror *server/database* (`initialError`).

2. **Komponen Tabel & Antarmuka Aksi**
   - **Tabel Antrean Manajemen Pintu Masuk (`ReceptionistTable`)** - Selubung instrumen interaktif peladen (*client wrapper*) pembangun blok kisi-kisi penyeleksi daftar kompetisi. Tabel memakan alokasi data dari *props initialData*, lalu merendernya dalam format ringkas berserta utilitas bar filter.
   - **Status Evaluasi (Error State)** - Menurunkan instrumen penengah diagnostik kelalaian peladen ke tabel presentasional. Mencegah runtuhnya *layouting* modul serta memperlihatkan justifikasi ketiadaan kueri daftar secara manusiawi pada antarmuka.
   - **Lompatan Menu Aksi (Attendance Router)** - Baris barisan tabel menautkan pengungkit operasional (tombol navigasi) mengarah ke laman URI pengurusan absensi pesertanya (Route Detail: `receptionist/[id]`) untuk dilaksanakannya pencetakan cek absensi otomatis/manual.

### Struktur File & Penghubungan

- **Halaman Receptionist** - `src/app/(dashboard)/receptionist/page.tsx`
- **Actions Receptionist** - `src/features/receptionist/actions.ts` - menampung operasi pemanggilan antrean kueri kompetisi spesifik.
- **Tabel Receptionist** - `src/features/receptionist/receptionist-table.tsx` - instrumen modul pemonitoran daftar tabel kompetisinya.
- **Kolom Receptionist** - `src/features/receptionist/_components/receptionist-columns.tsx`
- **Hook Tabel** - `src/features/receptionist/_hooks/use-receptionist-table.ts`
- **Tipe Receptionist** - `src/features/receptionist/types/receptionist.ts`

Kerangka penarikan konektivitas fungsionalitas asinkron API pangkalan data terhadap selubung panel:

```tsx
import { fetchCompetitions } from "@/src/features/receptionist/actions";
import { ReceptionistTable } from "@/src/features/receptionist/receptionist-table";
```

### Menambahkan Filter Receptionist

Apabila dibutuhkan form penyaringan khusus bagi operator pengurus tiket (misalnya perombakan indikator penyortiran fase event *aktif/lampau* atau parameter domisili), jabarkan skema *state query action*-nya terpusat di fungsi instrumen *client-hook table*. Pelihara keseragaman properti kriteria tipe status pada penarikan log *Supabase* (area `actions.ts`) agar pemonitoran kalender tidak membelot dari pakem pangkalan modul kompetisinya (`competitions`).

---
*Deskripsi ini menegaskan pengadaan rute fasilitas pengawalan pendaftaran antrean administrasi absensi pengunjung lomba.*
