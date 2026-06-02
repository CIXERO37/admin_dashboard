## Gambaran Umum Detail Group

**Detail Group** berfungsi sebagai lembar profil tunggal bagi komunitas dan perantara pengolahan manajemen relasi anggota grup (*membership*). Admin dapat melakukan inspeksi mendalam untuk melihat properti detail sebuah grup, mengekstrak direktori pengurus/member, dan mendelegasikan otoritas berdasar posisi hak (*role*).

### Bagian-Bagian Utama

1. **Data Source (Pengambilan Relasi Grup)** - Proses fetching data (menggunakan skema *backend actions*) dipecah menjadi dua alur sinkronisasi:
   - **Profil Komunitas (`fetchGroupById`)** - Menangkap objek profil spesifik melalui pencocokan *UUID* referensial. Mekanisme validasi langsung mendayagunakan rutinitas *error handler* kustom (`notFound()`) bila kode unik tak dikenali.
   - **Keanggotaan Terfiltrasi (`fetchGroupMembers`)** - Mengekstraksi senarai koleksi orang-orang dengan *page parameter* pencarian (limit standar per halaman: 10 entri baris).

2. **Komponen Pembungkus & Kontrol URI**
   - **Parameter Group ID (Route Path)** - Navigasi mendasarkan acuan kerjanya pada properti URI segmen dinamis `groups/[id]`.
   - **URL Query Parameters (Search & Role)** - Terdapat state navigasi URL dinamis khusus mengontrol urusan formasi pencarian (*search*) tabulasi keanggotaan dan segregasi filter (*role*).
   - **Komponen *Client-Detail*** - `GroupDetailClient` diposisikan sebagai cangkang penampung (*wrapper UI*) di sisi *browser*, bertugas menjahit injeksi properti (`group`, array `members`, `currentPage`, *state string* pencarian, serta `roleFilter`) untuk dapat dimodifikasi oleh Admin secara interaktif.

### Struktur File & Penghubungan

- **Halaman Detail Group** - `src/app/(dashboard)/groups/[id]/page.tsx`
- **Actions Groups** - `src/features/groups/actions.ts` - menampung operasi pemanggilan Supabase `fetchGroupById` & `fetchGroupMembers`.
- **Client Detail** - `src/features/groups/[id]/group-detail-client.tsx` - komponen pengolahan data antarmuka presentasional.
- **Tipe Group** - `src/features/groups/types/group.ts` - kerangka interface TypeScript struktural.
- **Halaman Groups (Direktori)** - `src/app/(dashboard)/groups/page.tsx`

Kumpulan utilitas impor pokok saat merekatkan fungsionalitas detail:

```tsx
import { fetchGroupById, fetchGroupMembers } from "@/src/features/groups/actions";
import { GroupDetailClient } from "@/src/features/groups/[id]/group-detail-client";
```

### Menambahkan Tab Detail Group

Untuk merealisasikan tabulasi sekunder baru di UI (misalnya: Daftar Aset Kompetisi Milik Grup), jalankan *fetch call* anyar sesaat sesudah instansiasi identitas profil (`group`) ditemukan. Turunkan hasil kembaliannya (*passing data*) menuju komponen klien `GroupDetailClient`. Pertimbangkan dengan saksama jika tabulasi baru membutuhkan sistem *paging*; berikan penanda unik kueri (seperti `?assetPage=2`) agar tak merusak logika sinkronisasi perpindahan halaman (URL Params) *pagination members*.

---
*Deskripsi ini menegaskan pengadaan formasi manajemen kontrol relasional spesifik pada ekosistem komunitas / grup.*
