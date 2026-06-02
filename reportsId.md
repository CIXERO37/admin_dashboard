## Gambaran Umum Detail Report

**Detail Report** difungsikan sebagai konsol pengawas log investigasi percakapan timbal balik (*dispute resolution hub*) sebuah rujukan aduan tunggal yang telah diterbitkan konsumen (tiket isu). Layar sentral resolusi konflik ini menyandingkan muatan metadata rincian spesifik laporan pendiri, membentangkan jalinan *history* pertukaran komunikasi keluhan (antara panelis *Admin* dan *User*), sekaligus melegitimasi penyisipan komando konklusi (*Admin Notes*) pasca audit investigatif rampung.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan *Fetch* Detail Sesi & URL Param)**
   - **Tangkapan Identifier URI** - Variabel nomor identifikasi pencocokan keluhan terpotong dari utilitas dinamis pelacak *Next.js URL Slug* pautan `reports/[id]`.
   - **Eksekusi Penarikan Laporan (*fetchReportById*)** - Pelontaran utilitas agregator asinkron mengail spesifikasi rincian aduan yang saling menaut ke pangkalan lampiran tumpukan *Messages* diskusi (*Thread*). 
   - **Mekanisme *Error* Pencegat** - Jika pengulangan kueri mengindikasikan status cacat temuan, rentetan perenderan segera digantikan luncuran notifikasi (*toast error* pop-up) mendesak perpindahan kembali pengawasan administrator menjauhi URI ke direktori `/reports`.

2. **Komponen Pembungkus Interaktivitas (*Thread Log*)**
   - **Kanvas Gulir Pesan Komunikasi (*Chat Messages*)** - Bentangan layout instrumen peraga panel pertukaran diskusi (*chat-box*). Logik presentasional dikendalikan pemisahan asimetris: balasan penilik Admin disejajarkan ke tepian kanan kanvas, membentur selubung rincian usulan *User* di garis marjin sebelah kiri layar.
   - **Modul Konfigurasi Diskusi (*Transmitter & Deletion Action*)** - Integrasi antarmuka untuk menyuplai *reply* respon (`sendMessageAction`) yang juga sensitif terhadap pemicu kombinasi navigasi perangkat keras (ketukan parameter murni *Enter* untuk memanggil fungsionalitas unggah transmisi teks). Fasilitas penyensoran atau retriksi pesan Admin murni (`deleteMessageAction` berbasis kueri pemilah *sender_type = admin*).
   - **Panel Infografis Rincian Aduan (*Report Information Dashboard*)** - Wadah *Sidebar* agregat metadata statis laporan yang memosisikan penampang klasifikasi judul, sub-kategori, catatan penyerta laporan (keterangan kendala), label cap waktu rekam perilisan dan penutupan kasus, plus arsip internal panitia penindak (*Admin Notes*).

### Struktur File & Penghubungan

- **Halaman Detail Report** - `src/app/(dashboard)/reports/[id]/page.tsx`
- **Actions Reports** - `src/features/reports/actions.ts` - wadah operasi relasional logika API (fetch pesan / hapus data interaktif Supabase).
- **Tipe Report** - `src/features/reports/types/report.ts`
- **Time Ago** - `src/components/shared/time-ago.tsx` - instrumen pembantu perenderan kalender/durasi manusiawi.
- **Scroll Area** - `src/components/ui/scroll-area.tsx`
- **Card UI** - `src/components/ui/card.tsx`

Skema tata cara implementasi import fungsi utilitas resolusi:

```tsx
import { fetchReportById, sendMessageAction, deleteMessageAction } from "@/src/features/reports/actions";
```

### Menambahkan Aksi Moderasi

Bila kerangka pelaksana sistem hendak dirangsang dengan tambahan manuver resolusi mediasi (seperti utilitas "Teruskan *Forward* ke Tim Teknis Tier 2"), sisipkan pilar pendirian tipe fungsi tersebut melintasi batasan berkas `reports/actions.ts`. Cetak pemanggil fungsional aksi barunya (eksekutor modul UI tombol atau pembuka selubung *Dialog* konfirmasi) menempati blok wadah *Panel Informasi*. Sesudah transisi aksi ditandaskan lunas di tingkat repositori *database*, paksa eksekusi penarikan penyegaran properti *(refresh State)* pelaporannya seketika. Selaraskan juga transisi modifikasi indikator keparahan (*State Severity*) tersebut beririsan langsung memutakhirkan jejak navigasinya ke daftar tabel depan direktori laporan utama.

---
*Deskripsi ini membedah pengadaan arsitektur intervensi pemantauan percakapan balasan komunikasi pengaduan (*ticketing thread*).*
