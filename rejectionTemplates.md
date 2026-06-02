## Gambaran Umum Rejection Templates

**Rejection Templates** dipersiapkan sebagai pangkalan data terpusat (*Library Hub*) dalam mengakomodasi pengaturan draf/cetakan teks justifikasi pembatalan. Eksistensi halaman peladen operasional moderasi ini memampukan tim panitia (*administrator*) mengontrol, merevisi, sekaligus menjamin penyeragaman frasa notifikasi saat menjatuhkan palu larangan pemuatan (*rejection*) terhadap karya kuis yang tidak memenuhi *Terms of Service* perusahaan.

### Bagian-Bagian Utama

1. **Data Source (Pengelolaan API Cetakan Pesan)** - Tata kelola pemindahan kueri data templat pesan (pemanggilan, registrasi baru, mutasi modifikasi, eliminasi) direduksi secara elegan ke pangkalan modul eksekutor *Service Pattern* spesifik pada `rejection-template-service.ts`. Fungsionalitas logik sinkronisasi dan abstraksi kueri interaksinya dirajut erat melewati kerangka state pancingan (`hook`) `use-templates-table.ts`.

2. **Komponen Manajerial Panel (`TemplateTable`)** - Bertindak sebagai perender utama tabel instrumen klien. Membawahi formasi matriks daftar aset *(Grid Table)*, menunjang integrasi modul utilitas filter teks *search bar* pencarian spesifik untuk lekas mensortir arsip kalimat teguran spesifik.
   - **Kolom Definisi Tematik (`template-columns.tsx`)** - Menyediakan skema pilar-pilar matriks: Judul peruntukan (Label), potongan konten naskah pesan, serta elemen tombol interaksi opsional (indikasi aktif atau non-aktif).
   - **Dialog Konfirmasi CRUD (`template-dialogs.tsx`)** - Sebuah modul *pop-up confirmation* khusus untuk meredam kecelakaan eksekusi *Create, Read, Update, Delete* aset-aset krusial basis teks ini.

### Struktur File & Penghubungan

- **Halaman Rejection Templates** - `src/app/(dashboard)/rejection-templates/page.tsx`
- **Tabel Template** - `src/features/rejection-templates/template-table.tsx`
- **Kolom Template** - `src/features/rejection-templates/_components/template-columns.tsx`
- **Dialog Template** - `src/features/rejection-templates/_components/template-dialogs.tsx`
- **Hook Tabel** - `src/features/rejection-templates/_hooks/use-templates-table.ts`
- **Actions** - `src/features/rejection-templates/actions.ts` - menampung operasi pemanggilan aksi peladen dasar.
- **Service** - `src/features/rejection-templates/services/rejection-template-service.ts`

Metode integrasi pemanggilan utama perenderan kontrol antarmuka di level layer aplikasi:

```tsx
import { TemplateTable } from "@/src/features/rejection-templates/template-table";
```

### Menambahkan Template Baru

Apabila ada kebutuhan ekspansi fungsional atribut penyusunan templat penolakan (*Rejection Clause*) spesifik (umpamanya menyisipkan klasifikasi ancaman hukuman / pilar kategori hukuman *Offense Type*), wajib mengonversi nilai ekstensi itu di skema struktur (Type/Interface). Kembangkan tangkapan kriteria modul API (*Supabase CRUD Layer* pada bagian layer `service`), implementasikan ekstensi bidang rekam datanya menuju form penyusunan `template-dialogs.tsx`, lalu pantulkan relasinya membentuk tambahan blok pemaparan sel baru di barisan pilar `template-columns.tsx`. Pelihara integritas status "Aktif" template (Status Flag), dengan harapan koleksi argumen pangkalan modul templat yang masih relevan senantiasa dapat disinkronisasi alur logik integrasi layar `quiz-approval`.

---
*Deskripsi ini menegaskan pengadaan alat pengelolaan pangkalan cetakan formulasi argumentasi penahanan (*QA Rejection*).*
