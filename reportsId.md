## Gambaran Umum Detail Report

**Detail Report** berfungsi sebagai halaman tindak lanjut laporan pengguna. Halaman ini menampilkan percakapan antara user dan admin, informasi report, serta catatan admin jika tersedia.

### Bagian-Bagian Utama

1. **Parameter Report ID** - Route membaca `id` dari path `reports/[id]`.

2. **Fetch Report Detail** - `fetchReportById` mengambil detail report beserta messages. Jika gagal, toast error muncul dan user diarahkan ke `/reports`.

3. **Chat Messages** - Pesan ditampilkan dalam layout chat. Pesan admin berada di sisi kanan, pesan user di sisi kiri.

4. **Kirim Pesan Admin** - Input pesan memanggil `sendMessageAction`. Enter mengirim pesan jika tidak memakai Shift.

5. **Hapus Pesan Admin** - Pesan dengan `sender_type = admin` dapat dihapus melalui `deleteMessageAction`.

6. **Panel Informasi Report** - Sidebar menampilkan title, description, type, created date, resolved date, dan admin notes.

### Struktur File & Penghubungan

- **Halaman Detail Report** - `src/app/(dashboard)/reports/[id]/page.tsx`.
- **Actions Reports** - `src/features/reports/actions.ts`.
- **Tipe Report** - `src/features/reports/types/report.ts`.
- **Time Ago** - `src/components/shared/time-ago.tsx`.
- **Scroll Area** - `src/components/ui/scroll-area.tsx`.
- **Card UI** - `src/components/ui/card.tsx`.

Contoh penghubungan utama:

```tsx
import { fetchReportById, sendMessageAction, deleteMessageAction } from "@/src/features/reports/actions";
```

### Menambahkan Aksi Moderasi

Tambahkan action baru di `reports/actions.ts`, tampilkan tombol di panel informasi atau dialog, lalu perbarui state report setelah aksi berhasil. Jika aksi mengubah status, sinkronkan dengan halaman daftar reports.

---
*Deskripsi ini menjelaskan detail report sebagai halaman chat dan investigasi laporan pengguna.*
