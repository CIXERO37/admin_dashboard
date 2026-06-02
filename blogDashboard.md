## Gambaran Umum Dashboard Blog

**Dashboard Blog** saat ini dialokasikan sebagai ringkasan statistik performa atau traksi platform publikasi tulisan (blog). Halaman ini baru mengimplementasikan prototipe kartu metrik (*placeholder*) serta banner area kosong yang mengindikasikan fitur *Coming Soon* karena analitik trafik riil belum dibangun secara utuh.

### Bagian-Bagian Utama

1. **Data Source (Statis Terstruktur)** - Karena entitas modul fungsional Blog ini baru berfungsi dari arah administrasi konten (membuat post blog), nilai statistik untuk penayangan masih dikodekan secara langsung dengan nilai default placeholder seperti "0" atau "-". Di masa mendatang, modul ini bergantung dari *actions* `blogs-service.ts`.

2. **Komponen Visual Placeholder**
   - **Kartu Statistik Dasar** - Komponen pembungkus me-render sebuah layout list berisi empat blok angka kosong yang dirancang merepresentasikan indikator kunci (Total Articles, Total Published, Total Views, serta metrik Engagement). 
   - **Ikonografi Fungsional** - Tiap blok indikator ditenagai visual pendukung melalui integrasi library icon `lucide-react` (menyajikan varian `FileText`, `TrendingUp`, `Eye`, dan `BarChart3`).
   - **State "Coming Soon"** - Sebuah kotak area peringatan khusus dirancang dengan pendekatan responsif, menyampaikan pemberitahuan ringkas terkait pembaruan yang masih dinanti kepada tim operasional (menyatakan analitik trafik views, tren ranking pos, dsb. dalam tahap penyusunan fitur).

### Struktur File & Penghubungan

- **Halaman Dashboard Blog** - `src/app/(dashboard)/blog/dashboard/page.tsx`
- **Service Blog** - `src/features/blog/services/blogs-service.ts` - kelak menyediakan fungsi penarik data dan agregasi views via Supabase RPC atau Action.
- **Tipe Blog** - `src/features/blog/types/blog.ts` - kerangka interface TypeScript.
- **Halaman Manage Blog** - `src/app/(dashboard)/manage-blog/page.tsx` - menu rujukan untuk proses CRUD daftar artikel yang sesungguhnya.

Contoh integrasi library dasar pada komponen dashboard placeholder:

```tsx
import { BarChart3, FileText, TrendingUp, Eye } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
```

### Mengaktifkan Data Nyata

Kembangkan fungsionalitas pengumpulan telemetri views lalu buat prosedur `Server Action` atau `React Query Hook` baru yang menarik agregasi ini dan melahap *interface/schema* blog (jumlah pos, proporsi tayang/draft). Hapus flag peringatan *Coming Soon*, ubah injeksi value konstanta dengan data hasil respons DB, dan perkuat tampilan UI dengan variasi Chart.js atau Recharts engagement trafik riil.

---
*Deskripsi ini menegaskan rincian kondisi prototipe kosong (placeholder) dari dashboard performa modul Blog sekaligus titik pengembangannya kelak.*
