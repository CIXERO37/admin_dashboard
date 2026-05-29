## Gambaran Umum Dashboard Blog

**Dashboard Blog** berfungsi sebagai ringkasan awal performa konten blog. Saat ini halaman menampilkan kartu metrik placeholder dan area `Coming Soon` untuk analitik blog yang akan dikembangkan.

### Bagian-Bagian Utama

1. **Header Dashboard Blog** - Judul memakai `useTranslation` untuk menggabungkan label Blog dan Dashboard.

2. **Kartu Statistik Placeholder** - Empat kartu menampilkan `Total Articles`, `Published`, `Total Views`, dan `Engagement` dengan nilai sementara `-`.

3. **Ikon Metrik** - Kartu memakai ikon `FileText`, `TrendingUp`, `Eye`, dan `BarChart3` dari `lucide-react`.

4. **Coming Soon State** - Area informasi menjelaskan bahwa analitik blog, artikel teratas, dan tren publishing akan tersedia setelah sistem interaksi diimplementasikan.

### Struktur File & Penghubungan

- **Halaman Dashboard Blog** - `src/app/(dashboard)/blog/dashboard/page.tsx`.
- **Service Blog** - `src/features/blog/services/blogs-service.ts`.
- **Tipe Blog** - `src/features/blog/types/blog.ts`.
- **Manage Blog** - `src/app/(dashboard)/manage-blog/page.tsx`.

Contoh penghubungan utama:

```tsx
import { BarChart3, FileText, TrendingUp, Eye } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
```

### Mengaktifkan Data Nyata

Tambahkan server action atau hook untuk mengambil statistik blog, ganti nilai placeholder pada kartu, lalu tambahkan chart engagement jika data views atau interaksi sudah tersedia.

---
*Deskripsi ini menjelaskan kondisi dashboard blog saat ini dan titik pengembangan untuk analitik blog nyata.*
