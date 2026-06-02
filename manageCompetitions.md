## Gambaran Umum Manage Competitions

**Manage Competitions** difungsikan sebagai konsol pusat pengawasan katalog acara (Event Management). Modul halaman ini membekali Administrator untuk menyelia deretan direktori perlombaan, menyusun formulasi (*Create*) registrasi *event* kompetisi baru, memperbarui metadatanya, atau bertindak sebagai pintu masuk menuju rincian pengelolaan operasional masing-masing fase *event* spesifik.

### Bagian-Bagian Utama

1. **Data Source & Services (Service Pattern)** - Pengikatan fungsional logika asinkron CRUD data kompetisi diisolasikan lewat layer `competition-service.ts` ke dalam integrasi *backend* ekosistem (*Supabase*). Status pengelolaan sinkronisasi API dijalin dengan utilitas `use-competitions-table.ts`.

2. **Komponen Pembungkus & Visualisasi**
   - **Client Manager (`ManageCompetitionsClient`)** - Komponen inti pihak klien penanggung jawab koordinasi antarmuka perihal pengaturan tabel grid, pemicu form tambah, serta deklarasi *alert-dialog* pencegat.
   - **Tabel List Kompetisi** - Konfigurasi pengaturan kolom matriks tabel `competition-columns.tsx` memproyeksikan deretan data agregasi inti, contohnya: Nama Judul Perlombaan, Status Aktif Perlombaan, Distribusi Batasan Tanggal Pelaksanaan, Rincian Besaran Biaya (*Entry Fee*), Nominasi Hadiah, sampai dengan opsi kontrol (tiga titik navigasi).
   - **Modal Form Tambah/Ubah** - Instansiasi utilitas `add-competition-form.tsx` menyajikan lembaran isian UI penampung proses inisiasi kompetisi anyar atau sekadar perbaikan entri informasi (terhubung ke jalur *edit mode* pada route detail).
   - **Navigasi *Workspace* Fase Detail** - Saat Admin mengeklik baris referensial ID tabel spesifik `manage-competitions/[id]`, sistem akan diarahkan pada panel *Dashboard Workspace* untuk memantau pengerjaan secara spesifik di tahapan siklus per fase, misalnya: Registrasi, Pembayaran, Klasifikasi/Kualifikasi, Penyisihan Grup, sampai Tahapan Selesai.

### Struktur File & Penghubungan

- **Halaman Manage Competitions** - `src/app/(dashboard)/manage-competitions/page.tsx`
- **Client Manager** - `src/features/manage-competitions/manage-competitions-client.tsx`
- **Kolom Tabel** - `src/features/manage-competitions/_components/competition-columns.tsx`
- **Dialog** - `src/features/manage-competitions/_components/competition-dialogs.tsx` - pembungkus perlakuan aksi hapus/status *toogle*.
- **Hook Tabel** - `src/features/manage-competitions/_hooks/use-competitions-table.ts`
- **Service** - `src/features/manage-competitions/services/competition-service.ts`
- **Tipe Kompetisi** - `src/features/manage-competitions/types/competition.ts`

Contoh konektivitas integrasi utilitas tabel klien (*wrapper*):

```tsx
import { ManageCompetitionsClient } from "@/src/features/manage-competitions/manage-competitions-client";
```

### Menambahkan Aksi Baru

Perluasan kapabilitas interaksi tabel (misalnya perlakuan klik "Duplicate Competition" atau "Send Announcement Email"), wajib dipasangkan rute eksekusi fungsionalnya (*action handler*) di *service action layer*. Susupkan tautan *action handler* itu melewati kerangka *state table hook*, dan manifestasikan akses klik/antarmukanya entah pada elemen *DropDown* sel-sel tabel (`competition-columns`) maupun *alert action dialog*. Bila prosedur baru memberikan impresi efek kepada kuantitas partisipan, pertahankan konsistensi akurasi datanya di tampilan segmen fase kompetisi (detail workspace).

---
*Deskripsi ini menegaskan kapabilitas administrasi event pada katalog perlombaan dan relasi kontrol fasenya.*
