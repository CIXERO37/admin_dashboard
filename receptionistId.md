## Gambaran Umum Detail Receptionist

**Detail Receptionist** berkedudukan sebagai meja komando (*attendance checking hub*) bagi pemonitoran kedatangan finalis ke area perlombaan. Modul manajemen fasilitasi *front-desk* ini menampung log riwayat anggota grup kompetisi, membekali operator akses ke kapabilitas pembubuhan absen (cek kehadiran manual *toggle*), atau pemanfaatan piranti otentikasi pengenal baris optik (layanan *QR Code Scanner*) instan.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan Asinkron Silang & Pemantauan Sinkronis *Realtime*)** 
   - **Tangkapan Identifier URI & Supabase Client** - Melacak nomor referensial lomba (melalui ekstrak *Slug parameter* URL dinamis `receptionist/[id]`). Agregat penarikan memborong seluruh skema keterkaitan struktur perlombaan (*competitions*, *final groups*, *members*, peserta parsial `competition_participants`, dan taksonomi *profiles* pengguna).
   - **Saluran Socket *Realtime Sync*** - Pelestari pergerakan reaktif (meng-hijack instrumen langganan/ *subscription channel*) dipasangkan kepada tabel `competition_participants`. Mekanisme canggih ini menjamin indikator `is_present` tereksekusi sinkron pada ragam tab (*client screen*) operator panitia manakala di saat persekian detik yang sama kueri kedatangan baru masuk ke database.

2. **Komponen Supervisi Kehadiran & Antarmuka Skrining**
   - **KPI Rekapitulasi (*Dashboard Inline Header*)** - Metrik kuantitatif (*Total Participants*, volume *Attended* & *Not Attended*) mencitrakan ikhtisar persentase konversi keramaian pelapor kompetitor yang datang dari sumber kueri audiens sah.
   - **Formasi Pengelompokan Registran (*Grouped Participant Cards*)** - Panel penampil data kustom dipartisi berlandaskan keanggotaan *Final Group* (regu final). Blok nama kandidat berfungsi laksana sakelar (*toggle*) pen-tanda-kehadiran sistem ceklis klik manual.
   - **Pemindai Optik QR (*Overlay QR Scanner*)** - Fungsionalitas modular (ter-isolasi dari paket render statis server/ *dynamic import html5-qrcode*) penyedia otentikasi biometrik-optik untuk mengenali dan mencocokkan konversi pengenal unik (ID/Username/UserID). 
   - **Indikator Balasan Instan (*Scan Feedback Toast*)** - Pop-up animasi mini mengumandangkan rekap berhasil-tidaknya rekonsiliasi hasil verifikasi QR Scanner.

### Struktur File & Penghubungan

- **Halaman Detail Receptionist** - `src/app/(dashboard)/receptionist/[id]/page.tsx`
- **Halaman List Receptionist** - `src/app/(dashboard)/receptionist/page.tsx`
- **Actions Receptionist** - `src/features/receptionist/actions.ts` - menampung operasi pemicu logika pemantauan dan pencatatan absensi.
- **Supabase Browser Client** - `lib/supabase-browser` - konektor soket *realtime* di browser.
- **Search Input** - `src/components/shared/search-input.tsx`
- **Avatar UI** - `src/components/ui/avatar.tsx`
- **Checkbox UI** - `src/components/ui/checkbox.tsx`

Pola impor instrumen optik pendeteksi asinkron (karena peruntukannya pada penjalanan *DOM-Browser*):

```tsx
const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
```

### Menambahkan Mode Check-In Baru

Peluasan peredaran jenis pintu otentikasi administrasi (seperti: penerapan mesin pembaca detektor NFC (*Near-field Communication*) maupun alat pemindai kode baris linier biasa), menuntut restrukturisasi penyesuaian kecocokan kueri di modul logika konverter `handleQrResult`. Atau lebih bijak, rakit satu fungsi validasi API penilai khusus di lapisan *server-action*. Bila proses identifikasi tersebut merembes atau memaksa pemutakhiran visual agregat daftar pesertanya, pertahankan utuh simpul ikatan *realtime websocket subscription* asalkan panitia (*client operator*) dari layar instrumen *front-desk* lainnya dapat menyelaraskan konversi keanggotaan secermat mungkin (sinkronisasi nirwaktu jeda).

---
*Deskripsi ini menegaskan pengerjaan formasi eksekusi kehadiran partisipan finalis secara terpadu melalui skaner atau manipulasi interaktif antarmuka.*
