## Gambaran Umum Appearance

**Appearance** berfungsi sebagai halaman pengaturan tampilan admin dashboard. Saat ini halaman fokus pada pemilihan tema light dan dark.

### Bagian-Bagian Utama

1. **Hook Appearance** - `useAppearance` menyediakan `theme`, `setTheme`, dan `mounted` untuk menghindari mismatch saat hydration.

2. **Header dan Separator** - Halaman menampilkan judul appearance dan separator untuk memisahkan konten.

3. **Deskripsi Theme** - Label dan deskripsi tema menggunakan `useTranslation`.

4. **Theme Card** - Dua `ThemeCard` ditampilkan untuk opsi light dan dark. Card aktif ditentukan dari nilai `theme`.

### Struktur File & Penghubungan

- **Halaman Appearance** - `src/app/(dashboard)/appearance/page.tsx`.
- **Hook Appearance** - `src/features/appearance/_hooks/use-appearance.ts`.
- **Theme Card** - `src/features/appearance/_components/theme-card.tsx`.
- **Theme Provider** - `src/components/theme-provider.tsx`.
- **Mode Toggle** - `src/components/mode-toggle.tsx`.

Contoh penghubungan utama:

```tsx
import { useAppearance } from "@/src/features/appearance/_hooks/use-appearance";
import { ThemeCard } from "@/src/features/appearance/_components/theme-card";
```

### Menambahkan Opsi Tampilan

Tambahkan state baru di hook appearance, buat komponen kontrol baru, lalu simpan preferensi pada provider atau storage yang sama. Hindari render sebelum `mounted` jika nilai bergantung pada client.

---
*Deskripsi ini menjelaskan halaman appearance sebagai pusat pengaturan tema dashboard.*
