## Gambaran Umum Detail Manage Competition

**Detail Manage Competition** berfungsi sebagai workspace operasional satu kompetisi. Halaman ini mengelola fase registration, payment, qualification, group stage, dan completed dengan data peserta, pembayaran, finalist, grup, quiz, serta game.

### Bagian-Bagian Utama

1. **Parameter Competition ID** - Route membaca `id` dari path `manage-competitions/[id]`.

2. **Fetch Detail Kompetisi** - Data kompetisi diambil dari tabel `competitions`, lalu peserta dari `competition_participants`, profil dari `profiles`, grup dari `competition_groups`, dan member dari `competition_group_members`.

3. **Statistik Inline** - Header menampilkan status, total registered, total paid, rentang tanggal, registration fee, dan prize pool.

4. **Informasi Kompetisi** - Poster, deskripsi, rules, dan registration link ditampilkan sebelum tab fase.

5. **Wizard Phase Tabs** - Tabs berisi `PhaseRegistration`, `PhasePayment`, `PhaseQualification`, `PhaseGroupStage`, dan `PhaseCompleted`.

6. **Group Stage Management** - Halaman mengambil available quizzes dan available games, mengelola local groups, menyimpan konfigurasi grup ke Supabase, serta menghitung winners.

7. **Navigation Guard** - Perubahan grup yang belum disimpan ditandai dengan `isGroupsDirty` dan dikaitkan ke `useNavigationGuard`.

### Struktur File & Penghubungan

- **Halaman Detail Competition** - `src/app/(dashboard)/manage-competitions/[id]/page.tsx`.
- **Tipe Kompetisi** - `src/features/manage-competitions/types/competition.ts`.
- **Phase Registration** - `src/features/manage-competitions/[id]/_components/phase-registration.tsx`.
- **Phase Payment** - `src/features/manage-competitions/[id]/_components/phase-payment.tsx`.
- **Phase Qualification** - `src/features/manage-competitions/[id]/_components/phase-qualification.tsx`.
- **Phase Group Stage** - `src/features/manage-competitions/[id]/_components/phase-group-stage.tsx`.
- **Phase Completed** - `src/features/manage-competitions/[id]/_components/phase-completed.tsx`.
- **Supabase Browser Client** - `lib/supabase-browser`.

Contoh penghubungan utama:

```tsx
import { PhaseRegistration } from "@/src/features/manage-competitions/[id]/_components/phase-registration";
import { PhaseGroupStage } from "@/src/features/manage-competitions/[id]/_components/phase-group-stage";
```

### Menambahkan Fase Baru

Tambahkan nilai baru pada tipe `CompetitionPhase`, buat komponen fase baru, tambahkan `TabsTrigger` dan `TabsContent`, lalu simpan pilihan fase ke localStorage seperti fase lain. Jika fase menulis data, sertakan dirty state dan mekanisme save yang eksplisit.

---
*Deskripsi ini menjelaskan detail kompetisi sebagai workspace multi-fase untuk operasional lomba.*
