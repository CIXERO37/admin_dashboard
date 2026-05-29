## Gambaran Umum Subscriptions

**Subscriptions** berfungsi sebagai halaman daftar langganan pengguna. Administrator dapat mencari subscription, melihat statistik ringkas, dan memantau pagination data subscription.

### Bagian-Bagian Utama

1. **Query Parameter** - Halaman membaca `page` dan `search` dari URL.

2. **Server-Side Fetching** - Data diambil melalui `fetchSubscriptions(page, search)`.

3. **Stats Subscription** - Response action mengembalikan `stats` yang diteruskan ke tabel untuk ringkasan subscription.

4. **Tabel Subscriptions** - `SubscriptionsTable` menerima data awal, statistik, total halaman, halaman aktif, dan total record.

### Struktur File & Penghubungan

- **Halaman Subscriptions** - `src/app/(dashboard)/subscriptions/page.tsx`.
- **Actions Subscriptions** - `src/features/subscriptions/actions.ts`.
- **Tabel Subscriptions** - `src/features/subscriptions/subscriptions-table.tsx`.
- **Kolom Subscription** - `src/features/subscriptions/_components/subscription-columns.tsx`.
- **Hook Tabel** - `src/features/subscriptions/_hooks/use-subscriptions-table.ts`.
- **Tipe Subscription** - `src/features/subscriptions/types/subscription.ts`.

Contoh penghubungan utama:

```tsx
import { fetchSubscriptions } from "@/src/features/subscriptions/actions";
import { SubscriptionsTable } from "@/src/features/subscriptions/subscriptions-table";
```

### Menambahkan Filter Subscription

Tambahkan parameter di `PageProps`, perbarui `fetchSubscriptions`, dan sambungkan kontrol filter di `SubscriptionsTable`. Untuk filter status pembayaran, selaraskan nilai dengan sistem billing.

---
*Deskripsi ini menjelaskan alur daftar subscription dari query URL sampai tabel feature.*
