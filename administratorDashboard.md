## Gambaran Umum Dashboard Administrator

**Dashboard Administrator** berfungsi sebagai pusat analitik pengguna dan admin. Halaman ini menampilkan jumlah user, admin, akun aktif, akun blocked, serta chart lokasi dan demografi.

### Bagian-Bagian Utama

1. **Data Source (Hook Profiles)** - Data profil pengguna ditarik dari backend menggunakan custom hook `useProfiles` (berada di fitur administrator dashboard). Hook ini menyimpan state data *raw* serta menyediakan flag indikator proses pengambilan data.

2. **Komponen Visualisasi & Filter**
   - **Filter Rentang Waktu** - Tersedia form input *Select* dengan opsi waktu (misal: `this-year`, `last-year`, dan `all`). Opsi ini digunakan pada level klien untuk menyaring koleksi array *profiles* sesuai rentang tanggal.
   - **Kartu Statistik Akun** - Kumpulan elemen `StatCard` memvisualisasikan agregat data (jumlah total user, admin, active, dan blocked). Beberapa di antaranya bertindak sebagai navigasi cepat (shortcut) ke halaman `users` melalui *query parameters*.
   - **Location Chart** - Komponen `LocationChart` menerima koleksi profil terfilter dan bertugas menyajikan persebaran domisili (peta/lokasi).
   - **Demographic Chart** - Komponen `DemographicChart` merangkum profil berdasarkan kategori khusus, memberikan *insight* demografis (misal umur atau gender).

### Struktur File & Penghubungan

- **Halaman Dashboard Administrator** - `src/app/(dashboard)/administrator/dashboard/page.tsx`
- **Hook Profiles** - `src/features/administrator/dashboard/_hooks/useProfiles.ts` - menampung operasi pemanggilan data profil.
- **Location Chart** - `src/components/dashboard/location-chart.tsx` - komponen diagram wilayah lokasi.
- **Demographic Chart** - `src/components/dashboard/demographic-chart.tsx` - komponen infografis klasifikasi demografi.
- **Stat Card** - `src/components/dashboard/stat-card.tsx` - UI komponen untuk kartu metrik.
- **Users Page** - `src/app/(dashboard)/users/page.tsx`

Contoh struktur *import* pada komponen halaman:

```tsx
import { useProfiles } from "@/src/features/administrator/dashboard/_hooks/useProfiles";
import { LocationChart } from "@/components/dashboard/location-chart";
```

### Menambahkan Metrik Administrator

Apabila hendak menambahkan kalkulasi analitik yang baru, disarankan untuk menghitung derivasinya dari data *profiles* yang sudah ditarik atau menambah fungsionalitas di hook `useProfiles`. Pastikan untuk menggunakan helper sinkronisasi filter tanggal (seperti `checkDate`) terutama untuk kolom penanda khusus seperti `blocked_at`, agar penyaringan antar-chart tetap konsisten.

---
*Deskripsi ini menjelaskan dashboard administrator sebagai pusat analitik akun, letak lokasi, dan demografi sistem.*
