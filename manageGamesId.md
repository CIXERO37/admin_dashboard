## Gambaran Umum Edit Manage Game

**Edit Manage Game** berfungsi sebagai halaman form edit untuk satu record master game. Halaman ini mengambil data game berdasarkan ID dan mengisi form dengan data awal.

### Bagian-Bagian Utama

1. **Parameter Game ID** - Route membaca `id` dari `params` pada path `manage-games/[id]`.

2. **Server Supabase Client** - Halaman memakai `getSupabaseServerClient` untuk mengambil data dari tabel `master_games`.

3. **Fetch Record Game** - Query memilih `*` dari `master_games` dengan kondisi `id = params.id`.

4. **Not Found UI** - Jika game tidak ditemukan, halaman menampilkan pesan `Game not found`.

5. **Form Edit Game** - `ManageGameForm` menerima `initialData` dan `gameId` untuk mode edit.

### Struktur File & Penghubungan

- **Halaman Edit Game** - `src/app/(dashboard)/manage-games/[id]/page.tsx`.
- **Form Game** - `src/features/manage-games/_components/manage-game-form.tsx`.
- **Server Supabase** - `lib/supabase-server`.
- **Service Master Game** - `src/features/manage-games/services/master-games-service.ts`.
- **Tipe Master Game** - `src/features/manage-games/types/master-game.ts`.

Contoh penghubungan utama:

```tsx
import { ManageGameForm } from "@/src/features/manage-games/_components/manage-game-form";
import { getSupabaseServerClient } from "@/lib/supabase-server";
```

### Menambahkan Validasi Edit

Tambahkan validasi di `ManageGameForm` dan service penyimpanan. Jika field baru bersifat wajib, pastikan data lama yang kosong tetap ditangani agar form edit tidak gagal render.

---
*Deskripsi ini menjelaskan halaman edit master game dan cara data awal dimuat dari Supabase.*
