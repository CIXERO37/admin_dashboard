## Gambaran Umum Receptionist

**Receptionist** berfungsi sebagai halaman daftar kompetisi untuk kebutuhan registrasi kehadiran peserta. Halaman ini menjadi pintu masuk menuju detail attendance per kompetisi.

### Bagian-Bagian Utama

1. **Fetch Daftar Kompetisi** - Data diambil lewat `fetchCompetitions` dari feature receptionist.

2. **Tabel Receptionist** - `ReceptionistTable` menerima `initialData` dan `initialError`, lalu menampilkan daftar kompetisi yang dapat diproses oleh receptionist.

3. **State Error Awal** - Error dari server action diteruskan ke tabel agar UI dapat menampilkan pesan yang sesuai.

4. **Navigasi Attendance Detail** - Setiap kompetisi dapat dibuka ke route `receptionist/[id]` untuk melakukan check-in peserta.

### Struktur File & Penghubungan

- **Halaman Receptionist** - `src/app/(dashboard)/receptionist/page.tsx`.
- **Actions Receptionist** - `src/features/receptionist/actions.ts`.
- **Tabel Receptionist** - `src/features/receptionist/receptionist-table.tsx`.
- **Kolom Receptionist** - `src/features/receptionist/_components/receptionist-columns.tsx`.
- **Hook Tabel** - `src/features/receptionist/_hooks/use-receptionist-table.ts`.
- **Tipe Receptionist** - `src/features/receptionist/types/receptionist.ts`.

Contoh penghubungan utama:

```tsx
import { fetchCompetitions } from "@/src/features/receptionist/actions";
import { ReceptionistTable } from "@/src/features/receptionist/receptionist-table";
```

### Menambahkan Filter Receptionist

Tambahkan filter di hook tabel dan action jika perlu query server-side. Jika filter berkaitan dengan status kompetisi atau jadwal, pastikan nilai status selaras dengan data `competitions`.

---
*Deskripsi ini menjelaskan fungsi halaman receptionist sebagai daftar kompetisi untuk proses attendance.*
