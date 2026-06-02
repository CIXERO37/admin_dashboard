## Gambaran Umum Appearance

**Appearance** berfungsi sebagai halaman pengaturan preferensi tampilan antar-muka dashboard administrator. Fitur utama yang disediakan saat ini adalah kustomisasi tema visual (Beralih antara mode *Light* dan *Dark*).

### Bagian-Bagian Utama

1. **Data Source (Hook & Provider)** - Preferensi tema diambil dan dikelola di sisi klien menggunakan custom hook `useAppearance`. Hook ini membungkus fungsi state `theme` dan `setTheme`, serta melacak status *render client* (`mounted`) untuk mencegah masalah ketidakcocokan *hydration* antara *Server Rendered UI* dan *Client Rendered UI*. Tema aplikasi utama dikelola oleh `ThemeProvider`.

2. **Komponen Pengaturan Tema**
   - **Deskripsi & Judul** - Menggunakan lokalisasi teks terintegrasi melalui hook `useTranslation` untuk menyajikan deskripsi fungsionalitas dan judul secara dinamis sesuai bahasa aktif pengguna.
   - **Theme Card** - Halaman me-render dua tombol kartu (komponen `ThemeCard`) visual yang melambangkan mode spesifik (terang dan gelap). Komponen bereaksi terhadap aksi klik untuk mengatur nilai *theme* baru, dan salah satu dari kartu tersebut memancarkan pendar (efek cincin seleksi aktif) jika namanya sesuai dengan nilai variabel `theme` saat ini.
   - **Mode Toggle Global** - Selain di halaman *Appearance*, perubahan tema secara *on-the-fly* juga sering diakses lewat modul `ModeToggle` (switch cepat pada header navigasi).

### Struktur File & Penghubungan

- **Halaman Appearance** - `src/app/(dashboard)/appearance/page.tsx`
- **Hook Appearance** - `src/features/appearance/_hooks/use-appearance.ts` - merangkum kontrol logika fungsionalitas *theme-switching*.
- **Theme Card** - `src/features/appearance/_components/theme-card.tsx` - representasi visual kartu opsi pemilihan tema.
- **Theme Provider** - `src/components/theme-provider.tsx` - pembungkus utama aplikasi React untuk sinkronisasi nilai skema warna global.
- **Mode Toggle** - `src/components/mode-toggle.tsx` - *shortcut switch* tema mode pada root dashboard.

Contoh integrasi komponen utama pada halaman:

```tsx
import { useAppearance } from "@/src/features/appearance/_hooks/use-appearance";
import { ThemeCard } from "@/src/features/appearance/_components/theme-card";
```

### Menambahkan Opsi Tampilan

Apabila diperlukan ekstensi kustomisasi selain mode gelap (seperti pengaturan besar *font*, palet warna primer kustom, dll), tambahkan state baru tersebut dalam hook *appearance*, dan pastikan disinkronisasikan penyimpanannya dengan provider *Context* yang relevan (misal di-persist di localStorage/cookie). Hindari merender kontrol tersebut sebelum indikator `mounted` menjadi true jika kontrol mengandalkan API klien secara eksklusif.

---
*Deskripsi ini menjelaskan halaman appearance sebagai pusat kontrol skema warna dan preferensi visual dashboard admin.*
