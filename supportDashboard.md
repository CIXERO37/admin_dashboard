## Gambaran Umum Dashboard Support

**Dashboard Support** difungsikan sebagai konsol pengawas sentral (*Monitoring Hub*) penanganan dukungan komunitas dan mitigasi aduan publik. Panel navigasi agregator data silang (Cross-Domain) ini melimpahkan wewenang observasi tingkat tinggi yang menaungi metrik eskalasi pelaporan pengguna (*Reports*), pendaftaran kuis tertahan (*Approval*), pengadaan pangkalan komunitas interaktif (*Groups*), dipadu-padankan bersama kalkulasi grafis distribusinya.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan *Fetch* Silang Domain)**
   - **Tangkapan Global Persisten (Laporan Pengguna)** - Ekstraksi kuantitas tiket aduan (*Reports*) dipasok menyilang perantara pangkalan *Store Context* internal (`useReports`), disaring secara lokal (*client-side*) sejalan dengan indikator parameter kalender periodik (`created_at`).
   - **Pemanggilan Agregat Serentak (*Parallel Cross-Fetching*)** - Penumpukan kalkulasi metrik grup serta antrean kuis di- *bypass* sekaligus menggunakan skema eksekutor ganda. Pelontaran rutinitas (`fetchQuizApprovals`, `fetchGroups`, dan pencacah `fetchGroupCategoryCounts`) diorkestrasi bareng memanfaatkan penyelarasan kalender reaktif sewaktu filter rentang diubah.

2. **Komponen Visualisasi Data Multilapis**
   - **Penyaring Segmen Periode (Time-Range Filter)** - Modul penyaring batas pemonitoran (meliputi spesifikasi: *this-year*, *last-year*, *all*). Manipulasi sakelar rentang mencambuk sinkronisasi serentak di semua instrumen pengolah (indikator dukungan aduan, penahan rilis konten publik, sampai ke pilar analitik komunitas).
   - **Kartu Metrik Dukungan Indikator (KPI StatCards)** - Penampang kuantitatif barisan balok yang merangkum hasil penelusuran peladen (*Total Reports, Pending Reports, Pending Approvals, Total Groups*) dengan sematan arsitektur pembungkus `StatCard`.
   - **Indikator Grafik Silang Modul (*SupportCharts*)** - Pemroses kanvas peraga visualisasi sentral yang menggabungkan asupan *filtered reports* bersama logika agregasi taksonomi kelompok (*Group Category Stats*), meramunya jadi sajian tren yang estetik (*support visualization*).

### Struktur File & Penghubungan

- **Halaman Dashboard Support** - `src/app/(dashboard)/support/dashboard/page.tsx`
- **Hook Reports** - `src/features/reports/_hooks/useReports.ts` - relasi inter-modul dari fitur persisten *Reports*.
- **Actions Quiz Approval** - `src/features/quiz-approval/actions.ts` - relasi silang modul ke fitur penahan perilisan Kuis.
- **Actions Groups** - `src/features/groups/actions.ts` - relasi silang modul ke fitur perkumpulan Komunitas.
- **Stats Groups** - `src/features/groups/stats-actions.ts`
- **Chart Support** - `src/components/dashboard/support-charts.tsx` - kerangka grafik interaktif gabungan bawaan.

Skema penyematan metode impor ganda antar pilar *Domain*:

```tsx
import { useReports } from "@/src/features/reports/_hooks/useReports";
import { SupportCharts } from "@/components/dashboard/support-charts";
```

### Menambahkan Metrik Support

Jika dibutuhkan pemonitoran angka kalkulasi eskalasi lintas divisi baru (contohnya menambahkan visibilitas atas rata-rata balasan aduan/ *Report Resolution Time*), perluas pondasi agregatnya tepat di pangkalan integrasi fitur asalnya. Tempel sokongan variabel data tersebut ke antrean rute pemanggilan (*Parallel Promise-Fetch*) di konstruksi pengawas beranda ini. Sambungkan muatan reaktif barunya (`state hook`) menembus panel pembungkus blok `StatCard` atau sisipkan ke utilitas grafik `SupportCharts`. Jaga integritas (*resetting state*) sewaktu filter rute kalender beroperasi menolak penyajian kalkulasi lawas basi (*stale values*).

---
*Deskripsi ini menegaskan pengadaan modul analitik hibrida menyatukan pengawasan dukungan keluhan dan verifikasi publikasi.*
