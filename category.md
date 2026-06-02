## Gambaran Umum Category

**Category** berfungsi sebagai halaman pengelolaan pusat kategori modul (*quiz* atau konten). Administrator memiliki hak akses untuk memantau daftar kategori serta melakukan proses CRUD dasar pada data kategori melalui fitur tabel interaktif.

### Bagian-Bagian Utama

1. **Data Source (Server-Side Fetching)** - Seluruh baris data list kategori dipanggil secara tersinkronisasi via SSR (Server Side Rendering). Fungsi `CategoryService.fetchCategories()` di lapisan layanan berjalan memanggil konektor database Supabase sebelum merender layout utama. 

2. **Komponen Pengelola & Interaktivitas**
   - **Tabel Kategori (`CategoryTable`)** - Komponen Client utama yang menerima props `initialData` (data SSR) untuk mengaktifkan UI. Tabel ini merender fungsionalitas pencarian, filter lokal, serta tombol-tombol pintasan aksi edit/hapus pada setiap baris kategori.
   - **Form & Dialog (`CategoryDialogs`)** - Komponen pop-up melayang (*modal*) yang bereaksi untuk menambahkan (*Create*) kategori baru atau memodifikasi (*Update*) kategori yang sudah eksis.
   - **Skema Kolom (`category-columns.tsx`)** - Menyimpan blueprint kerangka data untuk komponen DataTable, sehingga setiap atribut kategori disajikan rapi pada urutan kolom tabelnya.
   - **Hook Custom (`use-category-table.ts`)** - Mengontrol status variabel (loading, pemilihan kolom aktif, dsb) secara spesifik untuk memisahkan urusan status state dari UI presentasional.

### Struktur File & Penghubungan

- **Halaman Category** - `src/app/(dashboard)/category/page.tsx`
- **Service Category** - `src/features/category/services/category-service.ts` - pembungkus aksi server/database.
- **Tabel Category** - `src/features/category/_components/category-table.tsx` - kerangka UI penyaji tabel kategori.
- **Kolom Category** - `src/features/category/_components/category-columns.tsx` - pengatur atribut cell tabel.
- **Dialog Category** - `src/features/category/_components/category-dialogs.tsx` - komponen pengolahan data.
- **Hook Tabel** - `src/features/category/_hooks/use-category-table.ts`
- **Tipe Category** - `src/features/category/types/category.ts`

Contoh injeksi pustaka lokal saat melakukan *rendering*:

```tsx
import { CategoryService } from "@/src/features/category/services/category-service";
import { CategoryTable } from "@/src/features/category/_components/category-table";
```

### Menambahkan Field Kategori

Untuk merevisi jumlah parameter kategori (misal: penambahan atribut `icon` atau `color_theme`), langkah pertama adalah memperbarui type-safety di interface *category*. Lalu oper ke payload *Supabase* di komponen dialog form, dan jangan lupa menampilkannya pada deklarasi kolom tabel. Pastikan pengubahan nama kolom (jika terjadi perombakan) diperbarui selaras agar tidak merusak relasi eksternal (Foreign Key) di modul lain seperti Quiz/Approval.

---
*Deskripsi ini menegaskan halaman Category sebagai modul CRUD administratif sederhana yang menggunakan mekanisme Fetch Data pada Server (Server-Side).*
