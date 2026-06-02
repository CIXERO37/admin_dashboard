## Gambaran Umum Manage Games

**Manage Games** difungsikan sebagai wadah penampung pangkalan data induk (master data) permainan. Entitas kontrol ini mempersilakan pihak pengelola untuk meninjau status aktif produk permainan, mendaftarkan portofolio game anyar (*Create*), merevisi parameternya (*Update*), serta memberhentikan masa operasinya.

### Bagian-Bagian Utama

1. **Data Source (Pengelolaan API Master Game)** - Semua transaksi pertukaran rekaman game (baca, tambah, ubah, hapus) diakomodasi oleh lapisan servis pembungkus (*Service Repository*) khusus di area `master-games-service.ts`. Status pengelolaan asinkron tersebut didelegasikan kepada logika *hook* lokal pada `use-manage-games-table.ts`.

2. **Komponen Pembungkus & Kontrol Panel**
   - **Client Table Manager (`ManageGamesClient`)** - Kanvas inti di area presentasional *client-side*. Mengatur perangkaian form tambah data, merender tata letak interaksi baris, integrasi modul fitur filter *search*, hingga pencetus *modal dialog*.
   - **Tabel Master Game** - Penguraian list entitas dalam balutan tabel interaktif (menurut panduan kerangka cetak `manage-games-columns.tsx`). Ekosistem tabel dikonfigurasi mandiri untuk mempermudah eksekusi penyaringan (*local search*) dan mengakomodir fungsionalitas manajemen instan (*inline operations*).
   - **Form Game (`ManageGameForm`)** - Unit UI mandiri (*form component*) multifungsi untuk pengisian instansiasi formulir pembuatan *record* game baru, atau dirangkaikan ke penangkapan parameter data terdahulu (`initialData`) bila dipanggil saat mode pengeditan (Route Edit).
   - **Dialog Aksi (`manage-games-dialogs.tsx`)** - Sebuah entitas modul *pop-up confirmation* demi meredam insiden modifikasi buta (contohnya pergeseran status operasional aktif/nonaktif atau penghapusan arsip). Modularisasi perisai peringatan ini menjaga *bloatware* menumpuk di file tabel utama.

### Struktur File & Penghubungan

- **Halaman Manage Games** - `src/app/(dashboard)/manage-games/page.tsx`
- **Client Manager** - `src/features/manage-games/manage-games-client.tsx`
- **Kolom Tabel** - `src/features/manage-games/_components/manage-games-columns.tsx`
- **Dialog Tabel** - `src/features/manage-games/_components/manage-games-dialogs.tsx`
- **Hook Tabel** - `src/features/manage-games/_hooks/use-manage-games-table.ts`
- **Form Game** - `src/features/manage-games/_components/manage-game-form.tsx`
- **Service Master Game** - `src/features/manage-games/services/master-games-service.ts`

Metode integrasi pemanggilan utama perenderan kontrol *client-side*:

```tsx
import { ManageGamesClient } from "@/src/features/manage-games/manage-games-client";
```

### Menambahkan Field atau Aksi Baru

Perubahan penambahan parameter formulir pendaftaran permainan (misalnya parameter *Minimum Age* atau *Game Engine Support*) harus diikuti revisi tipe (*interface*) `master-game`. Kemudian, injeksikan *payload update* relasional pada struktur servis repositori asinkron (`master-games-service.ts`), perluas tangkapan atribut data masuk ke komponen form input di `ManageGameForm`, dan manifestasikan sebagai penampang lajur pemantauan sekunder baru di `manage-games-columns.tsx`. Modifikasi perlakuan *action handler* mutlak diletakkan ke *Dialog* atau *Hook* supaya susunan render form dan sel kolom tak terganggu oleh logika yang terlalu tebal (*heavy logic*).

---
*Deskripsi ini menjelaskan peran Manage Games sebagai pusat pendaftaran utilitas CRUD arsitektur master data game.*
