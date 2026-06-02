## Gambaran Umum Edit Manage Blog

**Edit Manage Blog** bertindak sebagai perantara antarmuka formulir redaksi (*edit mode*) untuk suatu artikel blog. Memanfaatkan tangkapan *ID dinamis* untuk mengambil isi artikel secara server-side, halaman ini menyuntikkan data mentah tersebut (*initialData*) ke dalam formulir reaktif, sehingga Admin dapat melanjutkan modifikasi narasi dan mengunggah pembaharuan gambarnya.

### Bagian-Bagian Utama

1. **Data Source (Server-Side Supabase Client)** - Proses injeksi data inisial dijalankan seutuhnya pada lingkungan peladen (Server). 
   - **Query Artikel** - Sistem menggunakan metode `getSupabaseServerClient` untuk mengakses instansiasi database *backend* secara *secure*, dan mengeksekusi instruksi pengambilan seluruh relasi row tabel `blogs` yang kondisinya spesifik mencocoki kriteria `id = params.id`.
   - **Penanganan Not Found (Error UI)** - Sebuah layar interupsi penolakan (*fallback*) diinisiasi bilamana kueri ID mengembalikan muatan kosong (artikel tidak ada), memaparkan teks peringatan `Article not found`.

2. **Komponen Pengelola & Interaktivitas UI**
   - **Parameter URI (Blog ID)** - Modul mengandalkan pemotongan referensi rute *Next.js URL Slug* pada path `manage-blog/[id]`.
   - **Formulir Edit Artikel (`ManageBlogForm`)** - Setelah lolos dari fungsi verifikasi *ID* di *server*, data entri artikel disalurkan lewat properti `initialData` menuju komponen kerangka form modular. Selain itu, *props* tipe `blogId` diberikan agar instansiasi status *update mode* pada formulir aktif bekerja (dibedakan dengan *create mode*).

### Struktur File & Penghubungan

- **Halaman Edit Blog** - `src/app/(dashboard)/manage-blog/[id]/page.tsx`
- **Form Artikel** - `src/features/manage-blog/_components/manage-blog-form.tsx` - instrumen input dan perenderan rich text serta upload *cover image*.
- **Server Supabase** - `lib/supabase-server` - direktori modul klien *server-side* DB utama.
- **Manage Blog Client** - `src/features/manage-blog/manage-blog-client.tsx`
- **Service Blog** - `src/features/blog/services/blogs-service.ts`

Contoh tata cara menginisialisasi perutean data ke form dalam skema *Page*:

```tsx
import { ManageBlogForm } from "@/src/features/manage-blog/_components/manage-blog-form";
import { getSupabaseServerClient } from "@/lib/supabase-server";
```

### Menambahkan Field Edit Artikel

Modifikasi untuk *property/field* tulisan yang terstruktur, semisal dukungan sub-judul (*Subtitle*) ataupun meta pendukung sematan tautan (SEO *link-building*), mengharuskan revisi pada validasi struktur input `ManageBlogForm`. Selaraskan tambahan parameter itu ke sisi `type` TypeScript deklarasi dan fungsi service operasi penulisan *Update* repositori. Terkhusus injeksi *field rich text* (pengolah kata WYSIWYG) dan aset media/lampiran foto resolusi besar, verifikasi limitasi ukurannya sebelum form diserahkan kepada fungsi pengeksekusi unggah (submit).

---
*Deskripsi ini menegaskan pemanfaatan metode penyerapan data pra-render ke dalam modul penyunting redaksional blog.*
