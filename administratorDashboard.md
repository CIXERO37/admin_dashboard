## Gambaran Umum Dashboard Administrator

**Dashboard Administrator** berfungsi sebagai pusat analitik pengguna dan admin. Halaman ini menampilkan jumlah user, admin, akun aktif, akun blocked, serta chart lokasi dan demografi.

### Bagian-Bagian Utama

1. **Filter Rentang Waktu** - Select menyediakan `this-year`, `last-year`, dan `all`. Filter dipakai untuk menyaring profil berdasarkan tanggal relevan.

2. **Hook Profiles** - Data profil diambil melalui `useProfiles` dari feature administrator dashboard.

3. **Kartu Statistik Akun** - Kartu menampilkan jumlah user, admin, active, dan blocked. Beberapa kartu menautkan langsung ke halaman users dengan query filter.

4. **Location Chart** - `LocationChart` menerima profil terfilter dan menampilkan distribusi lokasi.

5. **Demographic Chart** - `DemographicChart` menampilkan visualisasi demografi pengguna berdasarkan data profil.

### Struktur File & Penghubungan

- **Halaman Dashboard Administrator** - `src/app/(dashboard)/administrator/dashboard/page.tsx`.
- **Hook Profiles** - `src/features/administrator/dashboard/_hooks/useProfiles`.
- **Location Chart** - `src/components/dashboard/location-chart.tsx`.
- **Demographic Chart** - `src/components/dashboard/demographic-chart.tsx`.
- **Stat Card** - `src/components/dashboard/stat-card.tsx`.
- **Users Page** - `src/app/(dashboard)/users/page.tsx`.

Contoh penghubungan utama:

```tsx
import { useProfiles } from "@/src/features/administrator/dashboard/_hooks/useProfiles";
import { LocationChart } from "@/components/dashboard/location-chart";
```

### Menambahkan Metrik Administrator

Tambahkan perhitungan baru dari `profiles` atau perluas hook `useProfiles`. Jika metrik berbasis tanggal khusus seperti `blocked_at`, gunakan helper `checkDate` agar filter periode tetap konsisten.

---
*Deskripsi ini menjelaskan dashboard administrator sebagai analitik akun, lokasi, dan demografi.*
