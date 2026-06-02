## Gambaran Umum Manage Sessions

**Manage Sessions** dirancang sebagai utilitas penyelesaian perselisihan data (*dispute/maintenance*) untuk relasi kuis dan pendaftaran log yang terhenti, membeku, atau menggantung *(stale waiting sessions)*. Halaman mitigasi operasional ini menyokong fungsi administratif manajer untuk memaksa terminasi atau membersihkan anomali waktu jeda sesi kuis yang terbengkalai secara berkala.

### Bagian-Bagian Utama

1. **Data Source (Pengelola Relasi Tunggak Sesi)** - Pengikatan muatan kueri pencarian diarahkan secara eksplisit kepada penyaringan baris data sesi yang cacat (*stale*) dengan memakai eksekutor asinkron perantara dari modul `fetchStaleWaitingSessions`. 
   - **Manajemen Fallback Peringatan** - Rangkuman laporan galat (error *message* dari layer integrasi basis data) diteruskan kepada wadah properti `initialError`. Pola pembungkusan ini menjamin administrator tetap dapat meninjau akar kendala meskipun UI telah tereksekusi.

2. **Komponen Pengelola & Interaktivitas Aksi**
   - **Tabel Pemonitoran Kegagalan (`ManageSessionsTable`)** - Komponen utilitas penampung reaktif (yang memakan data via *props* `initialData`) di mana sel gridnya mendeskripsikan ringkasan parameter status kegagalan operasi. 
   - **Menu Aksi Eksekutor** - Fitur-fitur rincian dalam wujud blok iterasi (`manage-sessions-columns`) yang memungkinkan otoritas paksa pengembalian performa/perbaikan entri data sesi macet (*force close/cancel session*).

### Struktur File & Penghubungan

- **Halaman Manage Sessions** - `src/app/(dashboard)/manage-sessions/page.tsx`
- **Actions** - `src/features/manage-sessions/actions.ts` - menampung operasi pemicu logika API Supabase.
- **Tabel Manage Sessions** - `src/features/manage-sessions/manage-sessions-table.tsx` - instrumen pemvisualisasian antarmuka kolom berjenjang.
- **Kolom Tabel** - `src/features/manage-sessions/_components/manage-sessions-columns.tsx`
- **Hook Tabel** - `src/features/manage-sessions/_hooks/use-manage-sessions-table.ts`
- **Tipe Data** - `src/features/manage-sessions/types/manage-session.ts`

Contoh fiksasi sambungan layer antar *backend action* ke modul komponen pengawas depan:

```tsx
import { fetchStaleWaitingSessions } from "@/src/features/manage-sessions/actions";
import { ManageSessionsTable } from "@/src/features/manage-sessions/manage-sessions-table";
```

### Menambahkan Kriteria Stale Baru

Jika diperlukan implementasi tipe penelusuran kegagalan anyar (umpamanya batas tunggu kelulusan pembayaran peserta/kalkulasi sesi *offline* pasca terputusnya sinyal yang melebih 2 jam), wajib meretas klausa penarikan Supabase di area modul fungsi integratif `fetchStaleWaitingSessions`. Proyeksikan representasi peringatannya sebagai deklarasi pilar instrumen ekstra kolom pada komponen *Tabel Manager*. Terakhir, pastikan fungsi *Force Resolve* tersambung kuat (*handler assignment*) menangani rupa penambahan masalah kelalaian baru tersebut.

---
*Deskripsi ini menegaskan pengadaan fasilitas supervisi dan intervensi khusus mengontrol lalu lintas sirkulasi sesi yang macet.*
