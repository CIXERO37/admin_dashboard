## Gambaran Umum Manage Blog

**Manage Blog** berfungsi sebagai pusat kontrol administratif (*Content Management*) untuk mempublikasikan artikel blog. Menggunakan modul ini, administrator berwenang untuk menyajikan daftar artikel, merangkai draf baru, mengedit artikel lama, serta meninjau/mengganti status penayangan (*publish/draft/archived*).

### Bagian-Bagian Utama

1. **Data Source (Pengelolaan State dan API)** - Komunikasi lalu lintas data dengan repositori terpusat diproses melalui abstraksi pemanggilan `blogs-service.ts`. Fungsionalitas data CRUD (*Create, Read, Update, Delete*) dari/menuju *Supabase* dibungkus ke dalam *hook state* klien (`use-manage-blog-table.ts`).

2. **Komponen Pengelola & Interaktivitas UI**
   - **Client Manager (`ManageBlogClient`)** - Komponen pembungkus klien (wrapper) induk. Komponen ini bertanggungjawab atas orkestrasi elemen *layouting*, inisialisasi tabel, manajemen filter lokal, dan menangkap input aksi.
   - **Tabel Artikel Blog** - Grid iterasi visual yang diatur berdasarkan skema *blueprint* kolom `manage-blog-columns.tsx`. Berisikan sel informasi meta seperti: judul liputan, taksonomi kategori, cap waktu perilisan, *badge* status, beserta *dropdown* aksi edit/hapus di setiap ujung baris.
   - **Form Artikel (`ManageBlogForm`)** - Konstruksi UI modular formulir pendaftaran tulisan. Form ini bersifat fleksibel, di-*reuse* (digunakan berulang) pada tahap penyusunan artikel baru (Create) maupun pada rute ubah (`manage-blog/[id]`). 
   - **Dialog Konfirmasi Aksi** - Modul pop-up *alert* (`manage-blog-dialogs.tsx`) untuk mencegat aksi penghapusan tidak sengaja dan merubah status publikasi, memastikan perubahan diverifikasi admin.

### Struktur File & Penghubungan

- **Halaman Manage Blog** - `src/app/(dashboard)/manage-blog/page.tsx`
- **Client Manager** - `src/features/manage-blog/manage-blog-client.tsx`
- **Form Artikel** - `src/features/manage-blog/_components/manage-blog-form.tsx` - antarmuka pengisian konten dan upload.
- **Kolom Artikel** - `src/features/manage-blog/_components/manage-blog-columns.tsx`
- **Dialog Artikel** - `src/features/manage-blog/_components/manage-blog-dialogs.tsx`
- **Hook Tabel** - `src/features/manage-blog/_hooks/use-manage-blog-table.ts`
- **Service Blog** - `src/features/blog/services/blogs-service.ts`

Contoh metode *import* saat inisialisasi awal UI halaman root blog:

```tsx
import { ManageBlogClient } from "@/src/features/manage-blog/manage-blog-client";
```

### Menambahkan Field Artikel

Untuk menyuntikkan ekstraksi bidang data baru (misalnya menyisipkan input *SEO Keywords* atau *Author name*), modifikasi interface data *Type* terlebih dahulu. Kemudian, ekstensikan komponen input tambahannya di dalam `ManageBlogForm`, pastikan parameter *field* barunya diproses di file service, dan bila dirasa butuh ditinjau, wujudkan kemunculannya sebagai urutan lajur baru dalam konstruktor `manage-blog-columns.tsx`. Validasi media/gambar wajib divalidasi ketat saat tahapan *form submit* di fungsi `ManageBlogForm`.

---
*Deskripsi ini membedah arsitektur penyusunan dan pengawasan pengelolaan artikel blog secara komprehensif.*
