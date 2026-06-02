## Gambaran Umum Edit Manage Game

**Edit Manage Game** diimplementasikan sebagai panel sunting tunggal untuk merevisi susunan formatur atau spesifikasi informasi (*metadata*) permainan dari pangkalan data induk. Menangkap nilai properti berdasarkan referensi identitas dan menyediakan lingkungan operasional modifikasi dengan data terkini (*initial data state*).

### Bagian-Bagian Utama

1. **Data Source (Server-Side Supabase Fetching)** - Aliran injeksi form direkonsiliasi terlebih dahulu sebelum terender:
   - **Parameter ID Game (Rute URL)** - Variabel dinamis (*slug*) dari alamat direktori URI rute penelusuran `manage-games/[id]` ditangkap properti pelacak `params.id`.
   - **Klien Fetching (*getSupabaseServerClient*)** - Pembacaan objek tabel rekaman dilakukan mutlak pada arsitektur layer peladen. `getSupabaseServerClient` memantik agregasi kueri (dengan mencocokkan `id` pada tabel repositori `master_games`) tanpa menampakkan *service-key* pada klien.
   - **Interupsi Layar Kesalahan (Not Found UI)** - Manakala tangkapan fungsi tidak menemukan hasil (*undefined*), proses *rendering* reguler digantikan dengan kerangka tampilan gagal temuan kustom (`Game not found`), melindungi potensi rembesan error kosong pada *form*.

2. **Komponen Pengelola Formulir**
   - **Form Pengaturan Revisi Game (`ManageGameForm`)** - Lembar pendaftaran standar permainan yang dimutasi fungsi perilakunya menjadi form edisi revisi berkat lemparan balikan parameter dari *prop* turunan `initialData` serta pengenalan parameter `gameId`.

### Struktur File & Penghubungan

- **Halaman Edit Game** - `src/app/(dashboard)/manage-games/[id]/page.tsx`
- **Form Game** - `src/features/manage-games/_components/manage-game-form.tsx` - abstraksi modul UI antarmuka kotak masukan text/gambar.
- **Server Supabase** - `lib/supabase-server`
- **Service Master Game** - `src/features/manage-games/services/master-games-service.ts`
- **Tipe Master Game** - `src/features/manage-games/types/master-game.ts`

Kerangka fundamental saat mencangkok form dan aksi panggil peladen:

```tsx
import { ManageGameForm } from "@/src/features/manage-games/_components/manage-game-form";
import { getSupabaseServerClient } from "@/lib/supabase-server";
```

### Menambahkan Validasi Edit

Apabila formulir penyusunan terbaharui mendapat asupan field data kompleks (seperti penyematan rasio lebar dimensi kover grafis game, atau validasi tipe string minimal), delegasikan parameter deteksi *restriction*-nya ke dalam lapisan UI *Zod schemas* di modul `ManageGameForm`, kemudian serasikan bersama dengan lapisan *service* penyimpanan agar terhindar dari bentrok pengenalan skema kolom baru Supabase. Waspadai formasi validasi wajib (*mandatory*) agar nilai arsip yang bersemayam sedari lawas tidak diinterpretasi sebagai *undefined/null* hingga mengakibatkan disfungsi pe-renderan form ubah saat dibuka.

---
*Deskripsi ini menegaskan pemanfaatan metode penyerapan pra-rekaman *(initial data)* ke dalam modul utilitas edit produk game spesifik.*
