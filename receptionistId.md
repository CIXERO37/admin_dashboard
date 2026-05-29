## Gambaran Umum Detail Receptionist

**Detail Receptionist** berfungsi sebagai halaman attendance finalist kompetisi. Receptionist dapat melihat peserta final per grup, menandai kehadiran manual, dan scan QR untuk check-in.

### Bagian-Bagian Utama

1. **Parameter Competition ID** - Route membaca `id` dari path `receptionist/[id]`.

2. **Fetch Data Attendance** - Halaman mengambil competition, final groups, group members, participant records, dan profiles melalui Supabase browser client.

3. **Realtime Sync** - Subscription ke `competition_participants` memperbarui status `is_present` ketika ada update dari client lain.

4. **Ringkasan Kehadiran** - Header menampilkan total participants, attended, dan not attended berdasarkan peserta unik.

5. **Grouped Participant Cards** - Peserta dikelompokkan berdasarkan final group. Tiap row dapat diklik untuk toggle attendance.

6. **QR Scanner** - Overlay scanner menggunakan dynamic import `html5-qrcode`, membaca QR, mencocokkan ID/userId/username, lalu mengupdate `is_present`.

7. **Scan Feedback** - Result scan ditampilkan sebagai toast visual di dalam overlay scanner.

### Struktur File & Penghubungan

- **Halaman Detail Receptionist** - `src/app/(dashboard)/receptionist/[id]/page.tsx`.
- **Halaman List Receptionist** - `src/app/(dashboard)/receptionist/page.tsx`.
- **Actions Receptionist** - `src/features/receptionist/actions.ts`.
- **Supabase Browser Client** - `lib/supabase-browser`.
- **Search Input** - `src/components/shared/search-input.tsx`.
- **Avatar UI** - `src/components/ui/avatar.tsx`.
- **Checkbox UI** - `src/components/ui/checkbox.tsx`.

Contoh penghubungan utama:

```tsx
const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
```

### Menambahkan Mode Check-In Baru

Tambahkan pencocokan baru di `handleQrResult` atau buat action terpisah untuk validasi server-side. Jika check-in memengaruhi banyak tampilan, pertahankan realtime subscription agar semua client tersinkron.

---
*Deskripsi ini menjelaskan detail receptionist sebagai halaman attendance manual dan QR scanner untuk kompetisi.*
