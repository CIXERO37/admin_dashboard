## Gambaran Umum Detail Manage Competition

**Detail Manage Competition** berfungsi sebagai *workspace* operasional mendalam untuk entitas suatu kompetisi. Halaman spesifik ini adalah panggung kendali (Command Center) yang memecah pengelolaan kegiatan menjadi beberapa fase hierarkis: registrasi (*registration*), pelunasan (*payment*), kualifikasi (*qualification*), penyisihan grup (*group stage*), hingga pengumuman (*completed*), membawahi semua relasi data peserta, pembayaran, partisipan final, rincian kuis, serta pengaturan *game*.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan Relasi Multi-Tabel)** - Parameter penentu kueri diambil dari URL *slug* (`manage-competitions/[id]`). Eksekusi pengambilan (*fetch*) tidak sekadar membidik data profil tabel `competitions`, tetapi turut menghimpun koneksi skema data yang sangat masif; mencakup pendaftaran `competition_participants`, referensi `profiles`, arsitektur kelompok `competition_groups`, sampai entitas anggota spesifik di dalam `competition_group_members`.

2. **Komponen Pengelola & Interaktivitas Fase**
   - **Kartu Statistik Inline** - Penempatan infografis mini (metrik horizontal) di bawah *header* profil untuk merangkum secara seketika angka agregat konversi pendaftaran (total *registered* / *paid*), kurun jadwal eksekusi, serta agregasi nominal (potensi dana masuk vs. kompensasi *Prize Pool*).
   - **Wizard Phase Tabs** - Rangkaian navigasi perpindahan tab (arsitektur tabulasi komponen UI) yang memisahkan panel kerja setiap siklus kompetisi: `PhaseRegistration`, `PhasePayment`, `PhaseQualification`, `PhaseGroupStage`, dan `PhaseCompleted`.
   - **Pengelola Kuis & Manajemen Grup (Group Stage)** - Fasilitas modul khusus di mana sistem menyaring stok permainan dan materi kuis aktif (*available*), mengatur penyusunan kelompok secara interaktif (*local state*), melakukan presistensi penulisan ke memori Supabase, serta penghitungan logika eliminasi *winners*.

3. **Indikator Perlindungan (Navigation Guard)** - Sistem penahanan proaktif rute (`useNavigationGuard`). Saat Admin sedang meramu konfigurasi pergerakan *grup* dan belum memicu fungsionalitas penyimpanan (*Save/Commit*), variabel penanda `isGroupsDirty` memblokir interaksi navigasi agar progres penyusunan susunan kelompok tidak hilang saat berpindah haluan (*accidental leave*).

### Struktur File & Penghubungan

- **Halaman Detail Competition** - `src/app/(dashboard)/manage-competitions/[id]/page.tsx`
- **Tipe Kompetisi** - `src/features/manage-competitions/types/competition.ts`
- **Phase Registration** - `src/features/manage-competitions/[id]/_components/phase-registration.tsx`
- **Phase Payment** - `src/features/manage-competitions/[id]/_components/phase-payment.tsx`
- **Phase Qualification** - `src/features/manage-competitions/[id]/_components/phase-qualification.tsx`
- **Phase Group Stage** - `src/features/manage-competitions/[id]/_components/phase-group-stage.tsx`
- **Phase Completed** - `src/features/manage-competitions/[id]/_components/phase-completed.tsx`
- **Supabase Browser Client** - `lib/supabase-browser`

Contoh penerapan pembagian tabulasi fase dari klien page:

```tsx
import { PhaseRegistration } from "@/src/features/manage-competitions/[id]/_components/phase-registration";
import { PhaseGroupStage } from "@/src/features/manage-competitions/[id]/_components/phase-group-stage";
```

### Menambahkan Fase Baru

Untuk menyematkan tingkatan kompetisi anyar (misalnya "Fase Banding" atau "Sudden Death"), suntikkan terlebih dahulu nilai status baru ke skema `CompetitionPhase`. Bangun kerangka modul fasenya (buat komponen `phase-suddendeath.tsx` secara hierarki menduplikasi tata letak *Tabs*), lalu jabarkan pendiriannya dalam wadah `TabsTrigger` serta `TabsContent`. Selalu integrasikan mekanisme state peralihan pelestariannya ke antarmuka properti (`localStorage`) layaknya tabulasi pra-eksis, dan mutlak menautkannya pada *dirty-state hook guard* andai modul fase yang dibangun itu memperbolehkan mutasi (perubahan modifikasi manipulatif data) pada database.

---
*Deskripsi ini menegaskan pengerjaan pengawasan multi-lapisan terhadap tata operasional sebuah spesifik kompetisi.*
