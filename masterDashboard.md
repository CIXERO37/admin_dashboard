## Gambaran Umum Dashboard Master

**Dashboard Master** berfungsi sebagai pusat analitik data wilayah. Halaman ini menampilkan jumlah negara, state, kota, pengguna yang memiliki lokasi, serta chart lokasi teratas.

### Bagian-Bagian Utama

1. **Filter Rentang Waktu** - Select menyediakan pilihan `this-year`, `last-year`, dan `all`. Perubahan filter memicu request ulang ke API dashboard master.

2. **Fetch API Client-Side** - Data diambil dari `/api/master-dashboard?timeRange=...` dan disimpan di state client.

3. **KPI Cards** - Kartu menampilkan total countries, states, cities, dan users with location. Tiga kartu pertama mengarah ke halaman address terkait.

4. **Chart Top States dan Cities** - Dua chart bar horizontal memakai Recharts dan komponen chart shadcn untuk menampilkan lokasi dengan jumlah pengguna tertinggi.

5. **Loading dan Empty State** - Skeleton ditampilkan saat request berlangsung, sedangkan chart menampilkan pesan no data jika dataset kosong.

### Struktur File & Penghubungan

- **Halaman Dashboard Master** - `src/app/(dashboard)/master/dashboard/page.tsx`.
- **API Dashboard Master** - `src/app/api/master-dashboard/route.ts`.
- **Actions Master** - `src/features/master/dashboard/actions.ts`.
- **Stat Card** - `src/components/dashboard/stat-card.tsx`.
- **Chart UI** - `src/components/ui/chart.tsx`.
- **Address Pages** - `src/app/(dashboard)/address/*/page.tsx`.

Contoh penghubungan utama:

```tsx
const response = await fetch(`/api/master-dashboard?timeRange=${timeRange}`);
```

### Menambahkan Chart Wilayah Baru

Tambahkan agregasi di API atau action master dashboard, perluas interface `DashboardData`, lalu render chart baru memakai `ChartContainer`. Jaga format angka dengan `formatNumber`.

---
*Deskripsi ini menjelaskan dashboard master sebagai pusat analitik data negara, state, kota, dan lokasi pengguna.*
