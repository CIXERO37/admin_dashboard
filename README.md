# 🎮 GameforSmart - Admin Dashboard

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Framework-38B2AC?logo=tailwind-css)

> **"Ruang Kendali"** _back-office_ untuk tim manajemen platform GameforSmart.

---

## 🎯 Apa itu Gameforsmart?

**Gameforsmart** adalah sebuah _platform_ edukasi dan permainan interaktif (mirip dengan Kahoot!, Quizizz, atau Blooket) yang memungkinkan pengguna untuk membuat, meng-host, dan memainkan kuis secara _real-time_.

Lebih dari sekadar kuis biasa, platform ini memiliki skala yang jauh lebih besar karena mendukung:

- 🏆 **Kompetisi/Turnamen berskala besar:** Mendukung sistem _bracket_, fase pendaftaran, kualifikasi, hingga pembayaran.
- 👥 **Sistem Sosial:** Pengguna memiliki profil, bisa saling _follow_, berteman, dan membuat grup belajar atau bermain.
- 💳 **Ekonomi & Langganan (Subscriptions):** Terdapat sistem monetisasi, tagihan (billing), dan hak akses premium.

---

## 🎛️ Apa itu Admin Dashboard for Gameforsmart?

Ini adalah **"Ruang Kendali"** bagi tim internal yang mengelola Gameforsmart. Karena Gameforsmart menampung data pengguna, kuis, dan turnamen, tim manajemen membutuhkan antarmuka visual (UI) yang bagus untuk memantau, mengubah, dan menyetujui data tanpa harus berhadapan langsung dengan _database_ (Supabase).

---

## 💡 Latar Belakang Masalah

Aplikasi ini lahir sebagai solusi atas berbagai tantangan operasional:

1. 🛡️ **Moderasi Konten (_Quality Control_):** Dengan adanya fitur pembuat kuis (_User-Generated Content_), tim butuh alat untuk me-_review_ dan memfilter kuis yang tidak mendidik (**Quiz Approval** & **Rejection Templates**).
2. 🏟️ **Manajemen Event yang Rumit:** Penyelenggaraan lomba cerdas cermat skala nasional membutuhkan sistem untuk mengatur grup, bagan turnamen (_bracket_), dan validasi pembayaran (**Manage Competitions**).
3. 🆘 **Penanganan Masalah (_User Support_):** Alat bantu khusus untuk menangani laporan pengguna nakal atau pemulihan data (**Reports**, **Trash Bin**, **Manage Users**).
4. 📊 **Analisis Bisnis & Demografi:** Pemantauan asal negara pengguna, popularitas game, dan arus pendapatan berlangganan (**Billing**, **Master Dashboard**, Pemetaan Global).

---

## 🏗️ Konsep Utama Project

Konsep utamanya adalah **Centralized Management & Moderation** (Manajemen dan Moderasi Terpusat).

Secara teknis, konsep pembangunannya meliputi:

- 📈 **Data-Driven UI:** Mengambil data mentah dari _backend_ Supabase, dan mengubahnya menjadi tabel, grafik statistik, dan _form_ yang interaktif menggunakan Next.js dan Shadcn UI.
- 🧩 **Modular & Role-Based:** Terbagi menjadi puluhan modul spesifik (seperti _blog_, _address_, _games_, _competitions_, _reports_) yang dirancang untuk digunakan oleh berbagai divisi internal (Divisi Konten, Divisi Event, Divisi Keuangan).

---

## 🎯 Tujuan dan Sasaran Pengguna

- **Tujuan:** Memberikan kekuatan penuh kepada pengelola platform untuk memonitor kesehatan sistem, mengontrol _User-Generated Content_, mengelola turnamen, dan menganalisis performa bisnis.
- **Untuk Siapa:** Aplikasi ini **bukan untuk _end-user_** (anak sekolah/guru), melainkan **khusus untuk Tim Internal Gameforsmart** (Administrator, Customer Support, Content Reviewer, Event Organizer, dan Pemilik Bisnis).

---

## Cara Penginstalan atau _Clone_

_Clone_ adalah suatu proses pembuatan replika dari repository ini ke folder di local. Kamu bisa melakukan Clone dengan step seperti berikut: 

1. **Klik Button Code** di bagian atas repository
   
   <img width="253" height="68" alt="Screenshot_20260522_133255" src="https://github.com/user-attachments/assets/ff769242-b604-41c7-bbe0-ae3bddc953aa" />

3. **Pilih Cara _Clone_** , Kamu bisa _clone_ dengan **_install Zip_**, **Web URL** atau **GitHub CLI**

   - **Install Zip**
  
     <img width="437" height="286" alt="Screenshot_20260522_133327" src="https://github.com/user-attachments/assets/dff2efb1-7ad0-42da-933f-6733948b7bee" />

     Kamu dapat tekan button **Install Zip**, lalu extract di folder project mu
     

   - **_Clone_ menggunakan WEB URL**
  
     
     <img width="437" height="286" alt="Screenshot_20260522_133327" src="https://github.com/user-attachments/assets/dff2efb1-7ad0-42da-933f-6733948b7bee" />

     copy link nya, lalu buat folder untuk tempat _cloning_ nya, lalu buka terminal atau CMD di folder tersebut, kemudian masukkan command
  
     ```bash
     git clone https://github.com/CIXERO37/admin_dashboard.git

     
   - **_Clone menggunakan GitHub CLI**

  
     <img width="419" height="282" alt="Screenshot_20260522_133343" src="https://github.com/user-attachments/assets/be20c30b-a9f1-457a-9fac-943e578470fc" />

     Jika kamu menggunakan GitHub CLI, maka tinggal buka dan ketik di terminal

     ```bash
     gh repo clone CIXERO37/admin_dashboard

---

## Cara Menjalankan Project nya

1. Buka folder atau project nya di Antigravity atau Visual Studio Code
2. buat file .env .local di root project

   <img width="342" height="332" alt="image" src="https://github.com/user-attachments/assets/328d8b50-9e72-4d2e-addc-a79c7ffe4c2f" />

   Isi file nya dengan

   ```bash
   NEXT_PUBLIC_SUPABASE_URL="Your Public Supabase URL"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="Your Public Supabase Anon Key"
   SUPABASE_SERVICE_ROLE_KEY="Your Service Role Key"

3. Jalankan ini di terminal untuk memastikan semua _library_ di _node moduls_ sudah lengkap

   ```bash
   npm install

4. Kemudian kita cek apakah ada error dengan tipe data dengan menjalankan ini di terminal

   ```bash
   npx tsc --noEmit
   
5. Lalu Cek apakah ada error Logika atau Penulisan dengan menjalankan ini di terminal

   ```bash
   npm run lint

6. Terakhir kita jalankan project nya dengan menjalankan command ini di terminal

   ```bash
   npm run dev

_Dokumen ini merupakan panduan konseptual proyek Admin Dashboard Gameforsmart._
