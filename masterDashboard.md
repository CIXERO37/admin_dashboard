## Gambaran Umum Dashboard Master

**Dashboard Master** difungsikan sebagai titik pantau komando geografis serta demografi agregat letak penyebaran aset (wilayah). Administrator diberkahi visibilitas laporan statistik metrik kuantitas domisili untuk skala yurisdiksi entitas (negara/provinsi/kota), juga tren popularitas basis pendaftaran partisipan pada rentang spesifik.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan API Endpoints *Client-Side*)** - Arsitektur pengadaan formasi ringkasan (*payload data*) di-trigger secara *asynchronous* pasca *layout component* dimuat, menembak langsung *custom route endpoint* lokal `/api/master-dashboard`. Indikator pengolahan reaktivitasnya disimpan pada wadah memori *State* di dalam skema komponen dashboard klien.

2. **Komponen Pembungkus Analitik Visual**
   - **Penyaring Periode (Filter Rentang Waktu)** - Menu dropdown navigasi periode pengamatan visual (meliputi referensi metrik kalender: *this-year*, *last-year*, *all*). Manipulasi filter berakibat pada pembacaan mutasi URI _request_ parameter `timeRange=...` yang mereset integrasi rute API.
   - **Kartu Agregasi Metrik Indikator Kunci (KPI Cards)** - Balok statistik presentasional penyaji komputasi akumulasi total wilayah Negara, wilayah Provinsi, pembagian regional Kota/Kabupaten, bersandingan dengan data total registran yang telah memverifikasi lokasi domisilinya. Elemen kartu geografis bisa diklik (sebagai navigasi kilat) membuka laman pendataan address yang ekuivalen.
   - **Indikator Visual (*Recharts Top States & Cities*)** - Kombinasi utilitas grafik peraga dua buah blok *Bar Charts* beraliran horizontal, mengolaborasikan paket eksternal `Recharts` berbalut pondasi estetika `ChartContainer` shadcn, demi memperjelas sentralisasi wilayah dengan penumpukan dominan pemain (Top Traffic).
   - **Resolusi Pemuatan (Load & Empty Handler)** - *Placeholder Skeleton* ditata rapi guna menghapus layar lompat (*layout shift*) saat jeda perpindahan data asinkronus; dan kanvas grafik dikondisikan melontarkan kalimat _"No Data"_ saat rentang kalender yang difilter membuktikan rasio nihil pencatatan.

### Struktur File & Penghubungan

- **Halaman Dashboard Master** - `src/app/(dashboard)/master/dashboard/page.tsx`
- **API Dashboard Master** - `src/app/api/master-dashboard/route.ts` - menaungi rute orkestrasi ekstraksi *endpoint handler* di Node Runtime.
- **Actions Master** - `src/features/master/dashboard/actions.ts` - menampung operasi pemanggilan kueri agregat *Supabase* layer *server action*.
- **Stat Card** - `src/components/dashboard/stat-card.tsx` - abstraksi kartu metrik.
- **Chart UI** - `src/components/ui/chart.tsx` - konfigurasi dasar grafik bawaan sistem desain *shadcn*.
- **Address Pages (Navigasi Eksternal)** - `src/app/(dashboard)/address/*/page.tsx` - simpul pendaratan navigasi detail terhubung.

Skema penyematan metode _rendering_ *Fetch* dalam lingkup blok penampung reaktif *client-side*:

```tsx
const response = await fetch(`/api/master-dashboard?timeRange=${timeRange}`);
```

### Menambahkan Chart Wilayah Baru

Apabila dibutuhkan peninjauan spesifik, katakanlah presentase populasi per-subkategori Negara Bagian, pertama-tama perluas arsitektur pengolahan kueri basis data pada area rute layanan (sebaiknya pada blokasi layer `actions.ts` / perombakan API handler `route.ts`). Deklarasikan perbaikan tipenya di kontrak antarmuka balasan tipe `DashboardData`. Selanjutnya pasang konstruksi cetakan *canvas bar/pie charts* baru bersandarkan blok presentasional di komponen Client, disandingkan fungsi pemurni skala penomoran besar via modul utilitas formatur numerik bawaan (`formatNumber`).

---
*Deskripsi ini menegaskan pengadaan utilitas monitoring geospasial berbasis API client-fetch demi pengawasan demografi penyebaran wilayah.*
