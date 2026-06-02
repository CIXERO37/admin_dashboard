## Gambaran Umum Subscriptions

**Subscriptions** dipersiapkan sebagai pos pelacakan log aktivitas finansial (berlangganan) pengguna. Administrator diberdayakan guna melacak rentetan *subscription*, memantau rekapitulasi ringkasan statis (kuantitas status), serta mengontrol pementasan baris (*pagination*) dengan integrasi kueri sisi peladen mutlak.

### Bagian-Bagian Utama

1. **Data Source (Pengambilan *Fetch* Terpusat)**
   - **Tangkapan Query Parameter** - Modul menyadap parameter modifikasi penelusuran (seperti variabel `page` dan argumen kata kunci `search`) bersumber langsung dari URI rute Next.js.
   - **Server-Side Fetching & Evaluasi Sisi Peladen** - Pangkalan utilitas `fetchSubscriptions(page, search)` mengeksekusi integrasi *Supabase*. Ia secara serempak mengekstrak kumpulan rincian pembayaran *subscription* sekaligus menghitung agregat ringkasnya.
   - **Stats Subscription** - Kembalian fungsi (`response action`) memuat bundel statistik statis (`stats`) guna diekspos sebagai kartu-kartu konversi sebelum modul pilar tabel dirender penuh.

2. **Komponen Tabel & Antarmuka Aksi**
   - **Tabel Pemonitoran Pembayaran (`SubscriptionsTable`)** - Bertindak sebagai perakit antarmuka manajerial depan. Menyerap log pangkalan agregasi asinkron (data riwayat awalan, angka statistik balasan, batas halaman/ *total pages*, urutan letak posisi *active page*, maupun akumulasi kasar *total record*). Menautkan fitur pencarian (Search Input) dan pemindah posisi berkas halaman (*Pagination*).

### Struktur File & Penghubungan

- **Halaman Subscriptions** - `src/app/(dashboard)/subscriptions/page.tsx`
- **Actions Subscriptions** - `src/features/subscriptions/actions.ts` - menaungi operasi pemanggilan logika agregat *Supabase* layer peladen.
- **Tabel Subscriptions** - `src/features/subscriptions/subscriptions-table.tsx` - instrumen modul pembentuk tabel.
- **Kolom Subscription** - `src/features/subscriptions/_components/subscription-columns.tsx`
- **Hook Tabel** - `src/features/subscriptions/_hooks/use-subscriptions-table.ts`
- **Tipe Subscription** - `src/features/subscriptions/types/subscription.ts`

Format penyajian agregat balasan properti di ranah pengisi komponen:

```tsx
import { fetchSubscriptions } from "@/src/features/subscriptions/actions";
import { SubscriptionsTable } from "@/src/features/subscriptions/subscriptions-table";
```

### Menambahkan Filter Subscription

Apabila dibutuhkan peninjauan spesifik, misalnya pengelompokkan tipe status pembayaran (*Paid, Expired, Canceled*), rintis skema pelacak parameternya (Query URL) dari deklarasi properti *Props* laman utamanya (`PageProps`). Teruskan injeksi parameter tambahan itu mendobrak perbatasan *action* peladen `fetchSubscriptions` guna mencetak *query filter* kustom (misal: penambahan klausa klaim status `.eq('status', filterType)`). Seragamkan parameter UI utilitas selektor penyaringannya pada batang kendali `SubscriptionsTable` dengan panduan kosa kata yang setali dengan kamus sistem *billing* Supabase (Stripe) penopang aplikasi.

---
*Deskripsi ini menegaskan pengadaan rute logik agregat server dalam mengawal pergerakan pendaftaran finansial langganan pengguna.*
