# 🎮 Gameforsmart - Admin Dashboard

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Framework-38B2AC?logo=tailwind-css)

> **"Kokpit Utama"** atau ruang kendali _back-office_ untuk tim manajemen platform Gameforsmart.

---

## 🎯 Apa itu Gameforsmart?

**Gameforsmart** adalah sebuah _platform_ edukasi dan permainan interaktif (mirip dengan Kahoot!, Quizizz, atau Blooket) yang memungkinkan pengguna untuk membuat, meng-host, dan memainkan kuis secara _real-time_.

Lebih dari sekadar kuis biasa, platform ini memiliki skala yang jauh lebih besar karena mendukung:

- 🏆 **Kompetisi/Turnamen berskala besar:** Mendukung sistem _bracket_, fase pendaftaran, kualifikasi, hingga pembayaran.
- 👥 **Sistem Sosial:** Pengguna memiliki profil, bisa saling _follow_, berteman, dan membuat grup belajar atau bermain.
- 💳 **Ekonomi & Langganan (Subscriptions):** Terdapat sistem monetisasi, tagihan (billing), dan hak akses premium.

---

## 🎛️ Apa itu Admin Dashboard for Gameforsmart?

Ini adalah **"Markas Besar"** bagi tim internal yang mengelola Gameforsmart. Karena Gameforsmart menampung ribuan pengguna, kuis, dan turnamen, tim manajemen membutuhkan antarmuka visual (UI) yang canggih untuk memantau, mengubah, dan menyetujui data tanpa harus berhadapan langsung dengan _database_ (Supabase).

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

## 👁️ Visi dari Sudut Pandang Creator

> _"Saya ingin membangun Gameforsmart menjadi platform edukasi interaktif nomor satu. Tapi aplikasi yang hebat di sisi pengguna saja tidak cukup. Saya butuh sebuah 'Markas Besar' (Admin Dashboard) yang canggih. Saya ingin tim saya bisa melihat dengan jelas jumlah pengguna aktif hari ini, memblokir kuis yang tidak pantas dengan satu klik, mengatur turnamen e-learning layaknya turnamen e-sports profesional lengkap dengan sistem bracket-nya, dan memastikan arus pembayaran berjalan lancar."_

Visi di atas diterjemahkan dengan sangat akurat ke dalam arsitektur kode proyek ini:

- 🎮 **Turnamen e-sports edukasi** ➡️ Modul `manage-competitions` (bracket, registrasi, fase ronde).
- ⚖️ **Moderasi konten ketat** ➡️ Modul `quiz-approval` dengan `rejection-templates`.
- 👮 **Kedisiplinan platform** ➡️ Modul `reports` dan `trash-bin`.
- 🌍 **Platform berskala global** ➡️ Modul `address` (`country`, `state`, `city`) dan pemetaan koordinat benua.

---

_Dokumen ini merupakan panduan konseptual proyek Admin Dashboard Gameforsmart._
