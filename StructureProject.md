## Penjelasan Struktur Direktori Project Admin GameForSmart

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Framework-38B2AC?logo=tailwind-css)

Proyek ini menggunakan **Next.js 14+ (App Router)** dengan pendekatan **Feature-Based Architecture**. Setiap modul didesain secara spesifik dan dipisahkan agar rapi. Berikut adalah panduan membaca struktur folder aplikasi:

### Struktur Folder Utama (Lengkap)

Proyek ini menerapkan pola **Feature-Based Architecture**. Berikut adalah representasi struktur keseluruhan:

<details>
<summary>Klik untuk melihat struktur lengkap</summary>

```text
src/                                        # Root direktori utama kode sumber platform
├── app                                     # Arsitektur routing utama aplikasi (Next.js App Router)
│   ├── (dashboard)                         # Grup rute privat halaman dasbor administrator
│   │   ├── address                         # Modul manajemen hierarki lokasi geografis pengguna
│   │   │   ├── city                        # Sub-modul pengolahan data kota
│   │   │   ├── country                     # Sub-modul pengolahan data negara
│   │   │   └── state                       # Sub-modul pengolahan data provinsi
│   │   ├── administrator                   # Modul pengaturan wewenang admin (Role-Based Access)
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk hak akses admin
│   │   ├── appearance                      # Modul penyesuaian tema dan identitas antarmuka
│   │   ├── billing                         # Modul pemantauan invoice dan mutasi transaksi
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk transaksi & tagihan
│   │   ├── blog                            # Modul CMS untuk membaca dan menampilkan artikel
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk publikasi artikel
│   │   ├── blog-category                   # Modul pengelompokan jenis-jenis artikel berita
│   │   ├── category                        # Modul manajemen taksonomi/kategori game dan kuis
│   │   ├── competition                     # Modul pemantauan progres turnamen skala besar
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk pemantauan turnamen
│   │   ├── dashboard                       # Halaman ringkasan statistik dan metrik keseluruhan
│   │   ├── game                            # Modul tinjauan detail spesifik suatu permainan
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk detail katalog game
│   │   ├── game-sessions                   # Modul pemantauan aktivitas pemain secara langsung
│   │   │   └── [id]
│   │   ├── games                           # Modul eksplorasi seluruh katalog permainan platform
│   │   │   └── [name]
│   │   ├── groups                          # Modul pemantauan komunitas dan kelas belajar pengguna
│   │   │   └── [id]
│   │   ├── manage-blog                     # Modul CMS untuk pembuatan dan pengeditan artikel
│   │   │   ├── [id]
│   │   │   └── add
│   │   ├── manage-competitions             # Modul pembuatan dan pengaturan bagan turnamen
│   │   │   ├── [id]
│   │   │   │   └── edit
│   │   │   └── add
│   │   ├── manage-games                    # Modul pengaturan ketersediaan mesin permainan
│   │   │   ├── [id]
│   │   │   └── add
│   │   ├── manage-sessions                 # Modul administrasi kontrol sesi permainan aktif
│   │   ├── master                          # Modul pengaturan data referensi utama sistem
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk data master
│   │   ├── profiles                        # Modul pemeriksaan detail dan pencapaian pengguna
│   │   │   └── [id]
│   │   ├── quiz                            # Modul pratinjau detail soal sebuah kuis
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk detail kuis
│   │   ├── quiz-approval                   # Modul tinjauan kualitas konten buatan pengguna
│   │   │   └── [id]
│   │   ├── quizzes                         # Modul penelusuran pustaka kuis buatan komunitas
│   │   │   └── [id]
│   │   ├── receptionist                    # Modul penerimaan laporan tiket bantuan CS
│   │   │   └── [id]
│   │   ├── rejection-templates             # Modul pengelolaan pesan standar penolakan konten
│   │   ├── reports                         # Modul investigasi aduan pengguna yang bermasalah
│   │   │   └── [id]
│   │   ├── settings                        # Modul konfigurasi teknis dan preferensi sistem
│   │   │   ├── profile
│   │   │   └── security
│   │   ├── subscriptions                   # Modul penentuan paket berlangganan premium
│   │   ├── support                         # Modul operasional layanan dukungan pelanggan
│   │   │   └── dashboard                   # Halaman ringkasan statistik khusus untuk dukungan pelanggan
│   │   ├── trash-bin                       # Modul pemulihan atau penghapusan data secara permanen
│   │   └── users                           # Modul pengawasan dan pemblokiran akun anggota
│   │       └── [id]
│   ├── api                                 # Kumpulan endpoint backend (Serverless API)
│   │   ├── githubWebhook                   # Endpoint webhook integrasi repositori Github
│   │   ├── master-dashboard                # Endpoint penyuplai data metrik dasbor utama
│   │   ├── payment                         # Grup endpoint transaksi pembayaran
│   │   │   ├── create-invoice              # Endpoint pembuatan tagihan pembayaran
│   │   │   └── webhook                     # Endpoint penerima notifikasi status pembayaran
│   │   └── testing                         # Endpoint untuk kebutuhan pengujian sistem
│   ├── globals.css                         # Aturan styling CSS yang berlaku ke seluruh sistem
│   └── login                               # Grup rute halaman otentikasi admin
├── components                              # Komponen antarmuka React yang dibagikan secara global
│   ├── dashboard                           # Kumpulan komponen visual khusus halaman dasbor
│   ├── layout                              # Komponen penyusun kerangka halaman (Sidebar, Header)
│   ├── providers                           # Pembungkus React Context (Theme, Auth)
│   ├── shared                              # Komponen UI serbaguna yang dipakai lintas modul
│   └── ui                                  # Kumpulan dasar komponen UI dari ekosistem Shadcn
├── contexts                                # Penyimpanan state global aplikasi (React Context)
├── features                                # Kumpulan modul logika bisnis mandiri (Feature-Based)
│   ├── address                             # Modul manajemen hierarki lokasi geografis pengguna
│   │   ├── city                            # Sub-modul pengolahan data kota
│   │   │   ├── _components                 # Komponen visual terisolasi untuk manajemen data kota
│   │   │   └── _hooks                      # Pengelolaan state lokal dan data fetching untuk manajemen data kota
│   │   ├── country                         # Sub-modul pengolahan data negara
│   │   │   ├── _components                 # Komponen visual terisolasi untuk manajemen data negara
│   │   │   └── _hooks                      # Pengelolaan state lokal dan data fetching untuk manajemen data negara
│   │   ├── state                           # Sub-modul pengolahan data provinsi
│   │   │   ├── _components                 # Komponen visual terisolasi untuk manajemen data provinsi
│   │   │   └── _hooks                      # Pengelolaan state lokal dan data fetching untuk manajemen data provinsi
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk lokasi geografis
│   ├── administrator                       # Modul pengaturan wewenang admin (Role-Based Access)
│   │   └── dashboard                       # Halaman ringkasan statistik khusus untuk hak akses admin
│   │       └── _hooks                      # Pengelolaan state lokal dan data fetching untuk dasbor hak akses admin
│   ├── appearance                          # Modul penyesuaian tema dan identitas antarmuka
│   │   ├── _components                     # Komponen visual terisolasi untuk tema visual
│   │   └── _hooks                          # Pengelolaan state lokal dan data fetching untuk tema visual
│   ├── billing                             # Modul pemantauan invoice dan mutasi transaksi
│   │   └── dashboard                       # Halaman ringkasan statistik khusus untuk transaksi & tagihan
│   ├── blog                                # Modul CMS untuk membaca dan menampilkan artikel
│   │   ├── dashboard                       # Halaman ringkasan statistik khusus untuk publikasi artikel
│   │   ├── services                        # Layanan integrasi API/database eksternal untuk publikasi artikel
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk publikasi artikel
│   ├── blog-category                       # Modul pengelompokan jenis-jenis artikel berita
│   │   └── _components                     # Komponen visual terisolasi untuk kategori artikel
│   ├── category                            # Modul manajemen taksonomi/kategori game dan kuis
│   │   ├── _components                     # Komponen visual terisolasi untuk kategori sistem
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk kategori sistem
│   │   ├── services                        # Layanan integrasi API/database eksternal untuk kategori sistem
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk kategori sistem
│   ├── competition                         # Modul pemantauan progres turnamen skala besar
│   │   └── dashboard                       # Halaman ringkasan statistik khusus untuk pemantauan turnamen
│   │       └── _components                 # Komponen visual terisolasi untuk dasbor pemantauan turnamen
│   ├── dashboard                           # Halaman ringkasan statistik dan metrik keseluruhan
│   │   ├── _components                     # Komponen visual terisolasi untuk dasbor modul utama
│   │   └── _hooks                          # Pengelolaan state lokal dan data fetching untuk dasbor modul utama
│   ├── game                                # Modul tinjauan detail spesifik suatu permainan
│   │   └── dashboard                       # Halaman ringkasan statistik khusus untuk detail katalog game
│   │       ├── _components                 # Komponen visual terisolasi untuk dasbor detail katalog game
│   │       ├── _hooks                      # Pengelolaan state lokal dan data fetching untuk dasbor detail katalog game
│   │       └── types                       # Struktur tipe data TypeScript spesifik untuk detail katalog game
│   ├── game-sessions                       # Modul pemantauan aktivitas pemain secara langsung
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk pemantauan sesi live
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk pemantauan sesi live
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk pemantauan sesi live
│   ├── games                               # Modul eksplorasi seluruh katalog permainan platform
│   │   ├── [name]
│   │   ├── _components                     # Komponen visual terisolasi untuk katalog permainan
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk katalog permainan
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk katalog permainan
│   ├── groups                              # Modul pemantauan komunitas dan kelas belajar pengguna
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk komunitas pengguna
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk komunitas pengguna
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk komunitas pengguna
│   ├── login                               # Grup rute halaman otentikasi admin
│   ├── manage-blog                         # Modul CMS untuk pembuatan dan pengeditan artikel
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk pembuatan artikel
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk pembuatan artikel
│   │   └── add
│   ├── manage-competitions                 # Modul pembuatan dan pengaturan bagan turnamen
│   │   ├── [id]
│   │   │   ├── _components                 # Komponen visual terisolasi untuk fitur [id]
│   │   │   └── edit
│   │   ├── _components                     # Komponen visual terisolasi untuk pengaturan turnamen
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk pengaturan turnamen
│   │   ├── add
│   │   ├── detail-table
│   │   ├── services                        # Layanan integrasi API/database eksternal untuk pengaturan turnamen
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk pengaturan turnamen
│   ├── manage-games                        # Modul pengaturan ketersediaan mesin permainan
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk pengaturan game
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk pengaturan game
│   │   ├── add
│   │   ├── services                        # Layanan integrasi API/database eksternal untuk pengaturan game
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk pengaturan game
│   ├── manage-sessions                     # Modul administrasi kontrol sesi permainan aktif
│   │   ├── _components                     # Komponen visual terisolasi untuk pengawasan sesi live
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk pengawasan sesi live
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk pengawasan sesi live
│   ├── master                              # Modul pengaturan data referensi utama sistem
│   │   └── dashboard                       # Halaman ringkasan statistik khusus untuk data master
│   ├── profiles                            # Modul pemeriksaan detail dan pencapaian pengguna
│   │   ├── [id]
│   │   │   └── _components                 # Komponen visual terisolasi untuk fitur [id]
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk profil pengguna
│   ├── quiz                                # Modul pratinjau detail soal sebuah kuis
│   │   └── dashboard                       # Halaman ringkasan statistik khusus untuk detail kuis
│   │       └── _hooks                      # Pengelolaan state lokal dan data fetching untuk dasbor detail kuis
│   ├── quiz-approval                       # Modul tinjauan kualitas konten buatan pengguna
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk moderasi kuis
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk moderasi kuis
│   │   ├── services                        # Layanan integrasi API/database eksternal untuk moderasi kuis
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk moderasi kuis
│   ├── quizzes                             # Modul penelusuran pustaka kuis buatan komunitas
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk direktori kuis
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk direktori kuis
│   │   ├── services                        # Layanan integrasi API/database eksternal untuk direktori kuis
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk direktori kuis
│   ├── receptionist                        # Modul penerimaan laporan tiket bantuan CS
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk layanan helpdesk
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk layanan helpdesk
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk layanan helpdesk
│   ├── rejection-templates                 # Modul pengelolaan pesan standar penolakan konten
│   │   ├── _components                     # Komponen visual terisolasi untuk alasan penolakan konten
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk alasan penolakan konten
│   │   ├── services                        # Layanan integrasi API/database eksternal untuk alasan penolakan konten
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk alasan penolakan konten
│   ├── reports                             # Modul investigasi aduan pengguna yang bermasalah
│   │   ├── [id]
│   │   ├── _components                     # Komponen visual terisolasi untuk pelaporan aduan
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk pelaporan aduan
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk pelaporan aduan
│   ├── settings                            # Modul konfigurasi teknis dan preferensi sistem
│   │   ├── _components                     # Komponen visual terisolasi untuk konfigurasi platform
│   │   ├── profile
│   │   └── security
│   ├── subscriptions                       # Modul penentuan paket berlangganan premium
│   │   ├── _components                     # Komponen visual terisolasi untuk paket berlangganan
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk paket berlangganan
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk paket berlangganan
│   ├── support                             # Modul operasional layanan dukungan pelanggan
│   │   └── dashboard                       # Halaman ringkasan statistik khusus untuk dukungan pelanggan
│   ├── trash-bin                           # Modul pemulihan atau penghapusan data secara permanen
│   │   ├── _components                     # Komponen visual terisolasi untuk pemulihan data terhapus
│   │   ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk pemulihan data terhapus
│   │   └── types                           # Struktur tipe data TypeScript spesifik untuk pemulihan data terhapus
│   └── users                               # Modul pengawasan dan pemblokiran akun anggota
│       ├── [id]
│       ├── _components                     # Komponen visual terisolasi untuk manajemen akun pengguna
│       ├── _hooks                          # Pengelolaan state lokal dan data fetching untuk manajemen akun pengguna
│       ├── services                        # Layanan integrasi API/database eksternal untuk manajemen akun pengguna
│       └── types                           # Struktur tipe data TypeScript spesifik untuk manajemen akun pengguna
├── hooks                                   # Custom hooks utilitas yang dipakai di seluruh aplikasi
├── lib                                     # Fungsi pembantu dan konfigurasi pustaka pihak ketiga
│   ├── i18n
│   │   └── locales
│   ├── migrations
│   │   └── tournament_bracket_tables.sql   # Kumpulan skrip query raw database
│   └── xendit.js                           # File integrasi modul payment gateway Xendit
└── types                                   # Definisi tipe data statis TypeScript tingkat global
```
</details>


### Konsep Pemisahan: `app/` vs `features/`
- **`src/app/...` (Halaman)**: Hanya bertugas merender layout dan menentukan rute URL. Tidak dianjurkan menulis logika *database* yang berat di sini. Halaman ini hanya merakit dan memanggil komponen jadi dari folder `features/`.
- **`src/features/...` (Logika)**: Tempat komponen cerdas berada. Folder ini terisolasi (*Encapsulated*). Tidak perlu meletakkan komponen tabel kota di `src/components`, cukup letakkan di `_components` milik kota itu sendiri agar kode tidak bercampur dan mudah dipelihara.

---

### Daftar Lengkap Modul Admin Dashboard

Setiap folder di dalam `src/app/(dashboard)/` dan `src/features/` pada dasarnya saling berpasangan untuk membentuk modul fungsional berikut:

#### Master & Analytics
- **`dashboard`**: Halaman utama ringkasan metrik dan performa langsung.
- **`master`**: Pengaturan "Data Master" inti platform.

#### Users & Access Management
- **`users`**: Daftar menyeluruh anggota platform (cek status, blokir).
- **`administrator`**: Kontrol izin admin internal (Role-Based Access).
- **`profiles`**: Detail level keanggotaan dan capaian lencana pengguna.
- **`groups`**: Alat pantau grup sosial atau kelas belajar buatan pengguna.

#### Games & Quizzes
- **`games` / `manage-games`**: Mengelola status ketersediaan *game engine*.
- **`quizzes` / `quiz`**: Direktori soal/kuis pengguna di dalam database.
- **`game-sessions` / `manage-sessions`**: Pemantauan sesi kuis yang sedang *live*.

#### Moderation & Quality Control
- **`quiz-approval`**: "Meja Moderasi" untuk me-review kuis buatan pengguna.
- **`rejection-templates`**: Manajer "Alasan Penolakan" konten (mis: "Soal tidak lengkap").
- **`reports`**: Sistem laporan pengguna tentang kuis/pemain bermasalah.
- **`trash-bin`**: "Tempat Sampah" (Soft-Delete) untuk memulihkan data.

#### Events & E-Sports
- **`manage-competitions`**: Modul manajemen turnamen skala besar, *bracket*, dan kualifikasi.

#### Monetization & Billing
- **`billing`**: Laporan riwayat transaksi dan invoice pengguna.
- **`subscriptions`**: Pengaturan paket langganan (Premium/Basic).

#### Content & Localization
- **`manage-blog` / `blog` / `blog-category`**: Sistem CMS mini untuk artikel, pengumuman, dan berita platform.
- **`address`**: Pemetaan lokasi geografis (Benua, Negara, Kota) untuk analitik.
- **`category`**: Kategori pengelompokan topik game/kuis.

#### Settings & Helpdesk
- **`settings`**: Konfigurasi umum platform.
- **`appearance`**: Tema dan tampilan antarmuka dasbor (terang/gelap).
- **`support` / `receptionist`**: Meja penanganan tiket bantuan *Customer Support*.

---

_Dokumen ini merupakan panduan konseptual proyek Admin Dashboard Gameforsmart._
