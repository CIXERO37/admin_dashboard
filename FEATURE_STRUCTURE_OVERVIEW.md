# Feature Structure Overview

Dokumen ini adalah gambaran awal untuk merapikan `src/features` agar setiap domain punya susunan seperti:

```txt
src/features/<feature-name>/
├── components/
├── hooks/
├── services/
├── types/
└── index.ts
```

Untuk route yang punya subhalaman, tetap boleh punya folder route-segment seperti `[id]`, `add`, `edit`, `dashboard`, `profile`, atau `security`. Isi private UI dan logic di dalamnya tetap mengikuti pola yang sama.

## Pola Target

```txt
src/features/users/
├── components/
│   ├── user-table.tsx
│   ├── user-columns.tsx
│   ├── user-dialogs.tsx
│   └── user-filters.tsx
├── hooks/
│   └── use-users-table.ts
├── services/
│   └── user-service.ts
├── types/
│   └── user.ts
├── detail/
│   ├── components/
│   │   ├── user-detail-client.tsx
│   │   └── profile-client.tsx
│   └── page-content.tsx
└── index.ts
```

Catatan:

- `src/app` tetap menjadi tempat route Next.js App Router.
- `src/features` berisi UI feature, hooks, service/action, dan types.
- File yang sekarang bernama `_components` dan `_hooks` bisa diganti menjadi `components` dan `hooks` jika ingin sama persis seperti contoh.
- `actions.ts` boleh tetap di root feature jika itu server action route-level. Jika ingin konsisten dengan contoh gambar, pindahkan ke `services/actions.ts` atau `services/<feature>-actions.ts`.
- `index.ts` berfungsi sebagai public export. Export hanya entrypoint yang memang dipakai dari luar feature.

## Tetap Global atau Shared

File ini sebaiknya tetap global karena dipakai lintas domain atau merupakan primitive UI:

| Area | File/folder | Alasan |
| --- | --- | --- |
| UI primitive | `src/components/ui/*` | Shadcn/base UI, bukan domain feature. |
| Shared component | `components/shared/search-input.tsx` | Dipakai banyak table feature. |
| Shared component | `components/shared/confirm-action-dialog.tsx` | Dipakai banyak dialog action. |
| Shared component | `components/shared/confirm-delete-dialog.tsx` | Dipakai banyak dialog delete. |
| Shared component | `components/shared/time-ago.tsx` | Dipakai banyak column/detail view. |
| Dashboard primitive | `components/dashboard/data-table.tsx` | Table reusable lintas feature. |
| Dashboard primitive | `components/dashboard/stat-card.tsx` | KPI card reusable lintas dashboard. |
| Dashboard primitive | `components/dashboard/action-card.tsx` | Card reusable settings/dashboard. |
| Dashboard primitive | `components/dashboard/section-header.tsx` | Header reusable dashboard. |
| Layout | `components/layout/*` | App shell global. |
| Provider | `components/providers/auth-provider.tsx` | App-level provider. |
| Provider | `components/theme-provider.tsx` | App-level provider. |
| Hook shared | `hooks/use-pagination.ts` | Generic pagination hook. |
| Hook shared | `hooks/use-mobile.ts` | Generic responsive hook. |
| Hook shared | `hooks/use-toast.ts` | UI toast hook. |
| Hook auth/app-shell | `hooks/useCurrentUser.ts` | Dipakai header/layout, boleh tetap global atau pindah ke `features/auth/hooks`. |
| Supabase core | `lib/supabase-admin.ts`, `lib/supabase-browser.ts`, `lib/supabase-server.ts` | Core infrastructure, jangan masuk feature. |
| Utility core | `lib/utils.ts`, `lib/id-generator.ts`, `lib/game-registry.ts` | Helper/core registry lintas feature. |
| I18n | `lib/i18n/*` | Global localization. |

## Mapping Root ke Feature

| File sekarang | Target yang disarankan | Catatan |
| --- | --- | --- |
| `types/address.ts` | `src/features/address/types/address.ts` | Dipakai country/state/city. |
| `types/blog.ts` | `src/features/manage-blog/types/blog.ts` atau `src/features/blog/types/blog.ts` | Karena dipakai `manage-blog` dan `blog-category`, bisa pilih parent domain `blog`. |
| `types/category.ts` | `src/features/category/types/category.ts` | Sejalan dengan CategoryService dan table category. |
| `types/competition.ts` | `src/features/manage-competitions/types/competition.ts` | Banyak dipakai flow manage competition/detail. |
| `types/game-dashboard.ts` | `src/features/game/dashboard/types/game-dashboard.ts` | Khusus dashboard game. |
| `types/game-session.ts` | `src/features/game-sessions/types/game-session.ts` | Khusus game sessions. |
| `types/game.ts` | `src/features/games/types/game.ts` | Khusus daftar/detail games. |
| `types/group.ts` | `src/features/groups/types/group.ts` | Khusus groups. |
| `types/manage-session.ts` | `src/features/manage-sessions/types/manage-session.ts` | Khusus stale/manage sessions. |
| `types/master-game.ts` | `src/features/manage-games/types/master-game.ts` | Khusus manage games. |
| `types/profile.ts` | `src/features/profiles/types/profile.ts` | Khusus profile detail. |
| `types/quiz.ts` | `src/features/quizzes/types/quiz.ts` | Khusus quizzes. |
| `types/quiz-approval.ts` | `src/features/quiz-approval/types/quiz-approval.ts` | Khusus approval queue/detail. |
| `types/receptionist.ts` | `src/features/receptionist/types/receptionist.ts` | Khusus receptionist. |
| `types/rejection-template.ts` | `src/features/rejection-templates/types/rejection-template.ts` | Khusus rejection templates. |
| `types/report.ts` | `src/features/reports/types/report.ts` | Khusus report list/detail. |
| `types/subscription.ts` | `src/features/subscriptions/types/subscription.ts` | Khusus subscriptions. |
| `types/trash-bin.ts` | `src/features/trash-bin/types/trash-bin.ts` | Khusus trash bin. |
| `types/user.ts` | `src/features/users/types/user.ts` | Khusus users. |
| `types/supabase.ts` | Tetap `types/supabase.ts` atau split ke feature | Saat ini dipakai hook lama dan chart dashboard. Lebih aman tetap global dulu. |
| `lib/services/blogs-service.ts` | `src/features/blog/services/blogs-service.ts` | Dipakai `blog-category` dan `manage-blog`, jadi lebih cocok di parent `blog`. |
| `lib/services/category-service.ts` | `src/features/category/services/category-service.ts` | Satu domain. |
| `lib/services/competition-service.ts` | `src/features/manage-competitions/services/competition-service.ts` | Dipakai list, round, group, member competition. |
| `lib/services/master-games-service.ts` | `src/features/manage-games/services/master-games-service.ts` | Satu domain. |
| `lib/services/quiz-approval-service.ts` | `src/features/quiz-approval/services/quiz-approval-service.ts` | Satu domain. |
| `lib/services/quiz-service.ts` | `src/features/quizzes/services/quiz-service.ts` | Satu domain. |
| `lib/services/rejection-template-service.ts` | `src/features/rejection-templates/services/rejection-template-service.ts` | Satu domain. |
| `lib/services/user-service.ts` | `src/features/users/services/user-service.ts` | Satu domain. |
| `hooks/useCities.ts` | `src/features/address/hooks/use-cities.ts` | Ada duplicate type dengan `types/address.ts`. |
| `hooks/useCountries.ts` | `src/features/address/hooks/use-countries.ts` | Ada duplicate type dengan `types/address.ts`. |
| `hooks/useStates.ts` | `src/features/address/hooks/use-states.ts` | Ada duplicate type dengan `types/address.ts`. |
| `hooks/useDashboardStats.ts` | `src/features/dashboard/hooks/use-dashboard-stats.ts` | Khusus dashboard utama. |
| `hooks/useGameStats.ts` | `src/features/quiz/dashboard/hooks/use-game-stats.ts` atau `src/features/game-sessions/hooks/use-game-stats.ts` | Dipakai quiz dashboard, tapi datanya dari `game_sessions`. |
| `hooks/useProfiles.ts` | `src/features/administrator/dashboard/hooks/use-profiles.ts` atau `src/features/profiles/hooks/use-profiles.ts` | Saat ini dipakai administrator dashboard. |
| `hooks/useQuizzes.ts` | `src/features/quizzes/hooks/use-quizzes.ts` | Hook lama untuk quizzes, cek apakah masih dipakai sebelum dipindah. |
| `hooks/useReports.ts` | `src/features/reports/hooks/use-reports.ts` | Dipakai support dashboard, bisa tetap export dari reports. |
| `components/competitions/add-competition-form.tsx` | `src/features/manage-competitions/components/add-competition-form.tsx` | Saat ini masih di root components tapi domainnya competition. |
| `components/dashboard/demographic-chart.tsx` | `src/features/administrator/dashboard/components/demographic-chart.tsx` | Dipakai administrator dashboard. |
| `components/dashboard/location-chart.tsx` | `src/features/administrator/dashboard/components/location-chart.tsx` | Dipakai administrator dashboard. |
| `components/dashboard/support-charts.tsx` | `src/features/support/dashboard/components/support-charts.tsx` | Khusus support dashboard. |
| `components/dashboard/quiz-stats-charts.tsx` | `src/features/quiz/dashboard/components/quiz-stats-charts.tsx` | Khusus quiz dashboard. |
| `components/dashboard/revenue-chart.tsx` | `src/features/billing/dashboard/components/revenue-chart.tsx` | Khusus billing dashboard. |
| `components/dashboard/plan-distribution-pie.tsx` | `src/features/billing/dashboard/components/plan-distribution-pie.tsx` | Khusus billing dashboard. |
| `components/dashboard/master-stats-charts.tsx` | `src/features/master/dashboard/components/master-stats-charts.tsx` | Khusus master dashboard jika masih dipakai. |

## Feature List

| Feature | Route terkait | Components | Hooks | Services/actions | Types |
| --- | --- | --- | --- | --- | --- |
| `address` | `/address/country`, `/address/state`, `/address/city` | `country-table`, `country-columns`, `state-table`, `state-columns`, `city-table`, `city-columns` | `use-countries-table`, `use-states-table`, `use-cities-table`, plus root `useCountries/useStates/useCities` jika masih dipakai | `country/actions.ts`, `state/actions.ts`, `city/actions.ts` | `address.ts` |
| `administrator` | `/administrator/dashboard` | `location-chart`, `demographic-chart`, `stat-card` usage | root `useProfiles` | belum ada service khusus | `supabase.Profile` atau `profile.ts` jika disatukan |
| `appearance` | `/appearance` | `theme-card` | `use-appearance` | belum ada | belum ada |
| `billing` | `/billing/dashboard` | `revenue-chart`, `plan-distribution-pie`, `stat-card`, `data-table` usage | belum ada | belum ada | bisa pakai `subscription.ts` jika billing dan subscription digabung |
| `blog` | `/blog/dashboard` | belum banyak, bisa jadi parent domain untuk `blog-category` dan `manage-blog` | belum ada | `blogs-service.ts` | `blog.ts` |
| `blog-category` | `/blog-category` | `blog-category-client` | belum ada | `blogs-service.ts` | `blog.ts` (`BlogCategory`) |
| `category` | `/category` | `category-table`, `category-columns`, `category-dialogs` | `use-category-table` | `actions.ts`, `category-service.ts` | `category.ts` |
| `competition` | `/competition/dashboard` | dashboard-only page | belum ada | belum ada | bisa pakai `competition.ts` jika dashboard perlu domain type |
| `dashboard` | `/dashboard` | `dashboard-stats-grid`, `dashboard-charts`, `activity-columns` | root `useDashboardStats` | query masih di hook | types inline di hook, bisa jadi `dashboard.ts` |
| `game` | `/game/dashboard` | `game-dashboard-client`, `game-dashboard-wrapper`, `dashboard-filter`, `kpi-cards`, `horizontal-bar-chart`, `game-dashboard-skeleton` | `use-game-dashboard` | `actions.ts` | `game-dashboard.ts` |
| `game-sessions` | `/game-sessions`, `/game-sessions/[id]` | `game-sessions-table`, `game-session-columns`, `game-session-dialogs`, `session-stats`, `statistic-button` | `use-game-sessions-table` | `actions.ts` | `game-session.ts` |
| `games` | `/games`, `/games/[name]` | `game-card`, `player-map` | `use-games` | `actions.ts`, `[name]/actions.ts` | `game.ts`, detail types currently in `[name]/actions.ts` |
| `groups` | `/groups`, `/groups/[id]` | `group-table`, `group-card`, `group-dialogs`, `group-detail-client` | `use-groups-table` | `actions.ts`, `stats-actions.ts` | `group.ts` |
| `login` | `/login` | form masih di `src/app/login/page.tsx` | belum ada | `actions.ts` | belum ada |
| `manage-blog` | `/manage-blog`, `/manage-blog/add`, `/manage-blog/[id]` | `manage-blog-client`, `manage-blog-form`, `manage-blog-columns`, `manage-blog-dialogs` | `use-manage-blog-table` | `blogs-service.ts` | `blog.ts` |
| `manage-competitions` | `/manage-competitions`, `/manage-competitions/add`, `/manage-competitions/[id]`, `/edit` | `manage-competitions-client`, `competition-columns`, `competition-dialogs`, `add-competition-form`, phase components, bracket/group/round components | `use-competitions-table` | `competition-service.ts`, `[id]/actions.ts` | `competition.ts`, plus exported local types in `phase-group-stage.tsx` |
| `manage-games` | `/manage-games`, `/manage-games/add`, `/manage-games/[id]` | `manage-games-client`, `manage-game-form`, `manage-games-columns`, `manage-games-dialogs` | `use-manage-games-table` | `master-games-service.ts` | `master-game.ts` |
| `manage-sessions` | `/manage-sessions` | `manage-sessions-table`, `manage-sessions-columns` | `use-manage-sessions-table` | `actions.ts` | `manage-session.ts` |
| `master` | `/master/dashboard` | `master-stats-charts` jika masih dipakai, page dashboard | belum ada | `dashboard/actions.ts` | `DashboardData` masih inline, bisa jadi `master-dashboard.ts` |
| `profiles` | `/profiles/[id]` | `profile-view`, `profile-client` | root `useProfiles` jika ingin disatukan | `actions.ts` | `profile.ts` |
| `quiz` | `/quiz/dashboard` | `quiz-stats-charts`, `stat-card` usage | root `useGameStats` | belum ada | bisa buat `quiz-dashboard.ts` jika perlu |
| `quiz-approval` | `/quiz-approval`, `/quiz-approval/[id]` | `quiz-approval-table`, `quiz-approval-columns`, `quiz-approval-dialogs` | `use-quiz-approval-table` | `actions.ts`, `quiz-approval-service.ts` | `quiz-approval.ts` |
| `quizzes` | `/quizzes`, `/quizzes/[id]` | `quiz-table`, `quiz-columns`, `quiz-dialogs`, `quiz-client`, `quiz-detail-view` | `use-quizzes-table`, root `useQuizzes` jika masih dipakai | `actions.ts`, `quiz-service.ts` | `quiz.ts` |
| `receptionist` | `/receptionist`, `/receptionist/[id]` | `receptionist-table`, `receptionist-columns` | `use-receptionist-table` | `actions.ts` | `receptionist.ts` |
| `rejection-templates` | `/rejection-templates` | `template-table`, `template-columns`, `template-dialogs` | `use-templates-table` | `actions.ts`, `rejection-template-service.ts` | `rejection-template.ts` |
| `reports` | `/reports`, `/reports/[id]` | `report-table`, `report-columns`, `report-dialogs`, detail report view still in page | `use-reports-table`, root `useReports` | `actions.ts` | `report.ts` |
| `settings` | `/settings`, `/settings/profile`, `/settings/security` | `system-status-card`, profile/security forms still in pages | belum ada | belum ada | bisa buat `settings.ts` jika form schema/type mulai banyak |
| `subscriptions` | `/subscriptions` | `subscriptions-table`, `subscription-columns` | `use-subscriptions-table` | `actions.ts` | `subscription.ts` |
| `support` | `/support/dashboard` | `support-charts`, `stat-card` usage | root `useReports` from reports | memakai `quiz-approval/actions`, `groups/actions`, `groups/stats-actions` | bisa buat `support-dashboard.ts` untuk aggregate view model |
| `trash-bin` | `/trash-bin` | `trash-bin-tabs`, `trash-user-table`, `trash-quiz-table`, `trash-group-table`, `trash-dialogs`, trash columns | `use-trash-table` | `actions.ts` | `trash-bin.ts` |
| `users` | `/users`, `/users/[id]` | `user-table`, `user-columns`, `user-dialogs`, `user-filters`, `user-detail-client`, `profile-client` | `use-users-table` | `actions.ts`, `user-service.ts` | `user.ts` |

## Struktur Detail per Feature

### `address`

```txt
src/features/address/
├── country/
│   ├── components/
│   │   ├── country-columns.tsx
│   │   └── country-table.tsx
│   ├── hooks/
│   │   └── use-countries-table.ts
│   └── services/
│       └── actions.ts
├── state/
│   ├── components/
│   │   ├── state-columns.tsx
│   │   └── state-table.tsx
│   ├── hooks/
│   │   └── use-states-table.ts
│   └── services/
│       └── actions.ts
├── city/
│   ├── components/
│   │   ├── city-columns.tsx
│   │   └── city-table.tsx
│   ├── hooks/
│   │   └── use-cities-table.ts
│   └── services/
│       └── actions.ts
├── hooks/
│   ├── use-countries.ts
│   ├── use-states.ts
│   └── use-cities.ts
├── types/
│   └── address.ts
└── index.ts
```

### `category`

```txt
src/features/category/
├── components/
│   ├── category-table.tsx
│   ├── category-columns.tsx
│   └── category-dialogs.tsx
├── hooks/
│   └── use-category-table.ts
├── services/
│   ├── actions.ts
│   └── category-service.ts
├── types/
│   └── category.ts
└── index.ts
```

### `manage-competitions`

```txt
src/features/manage-competitions/
├── components/
│   ├── manage-competitions-client.tsx
│   ├── competition-columns.tsx
│   ├── competition-dialogs.tsx
│   └── add-competition-form.tsx
├── detail/
│   ├── components/
│   │   ├── assign-participants-dialog.tsx
│   │   ├── bracket-view.tsx
│   │   ├── group-card.tsx
│   │   ├── local-bracket-view.tsx
│   │   ├── phase-completed.tsx
│   │   ├── phase-group-stage.tsx
│   │   ├── phase-payment.tsx
│   │   ├── phase-qualification.tsx
│   │   ├── phase-registration.tsx
│   │   ├── phase-stepper.tsx
│   │   └── round-manager.tsx
│   └── services/
│       └── actions.ts
├── hooks/
│   └── use-competitions-table.ts
├── services/
│   └── competition-service.ts
├── types/
│   └── competition.ts
└── index.ts
```

Catatan khusus: `src/features/manage-competitions/detail-table` berisi SQL schema dan tidak punya ekstensi. Lebih rapi dipindah ke `docs/`, `database/`, atau `lib/migrations/` dengan nama seperti `competition-detail-tables.sql`.

### `users`

```txt
src/features/users/
├── components/
│   ├── user-table.tsx
│   ├── user-columns.tsx
│   ├── user-dialogs.tsx
│   └── user-filters.tsx
├── detail/
│   └── components/
│       ├── user-detail-client.tsx
│       └── profile-client.tsx
├── hooks/
│   └── use-users-table.ts
├── services/
│   ├── actions.ts
│   └── user-service.ts
├── types/
│   └── user.ts
└── index.ts
```

### `quizzes`

```txt
src/features/quizzes/
├── components/
│   ├── quiz-table.tsx
│   ├── quiz-columns.tsx
│   └── quiz-dialogs.tsx
├── detail/
│   └── components/
│       ├── quiz-client.tsx
│       └── quiz-detail-view.tsx
├── hooks/
│   ├── use-quizzes-table.ts
│   └── use-quizzes.ts
├── services/
│   ├── actions.ts
│   └── quiz-service.ts
├── types/
│   └── quiz.ts
└── index.ts
```

### `reports`

```txt
src/features/reports/
├── components/
│   ├── report-table.tsx
│   ├── report-columns.tsx
│   └── report-dialogs.tsx
├── detail/
│   └── components/
│       └── report-detail-view.tsx
├── hooks/
│   ├── use-reports-table.ts
│   └── use-reports.ts
├── services/
│   └── actions.ts
├── types/
│   └── report.ts
└── index.ts
```

### `groups`

```txt
src/features/groups/
├── components/
│   ├── group-table.tsx
│   ├── group-card.tsx
│   └── group-dialogs.tsx
├── detail/
│   └── components/
│       └── group-detail-client.tsx
├── hooks/
│   └── use-groups-table.ts
├── services/
│   ├── actions.ts
│   └── stats-actions.ts
├── types/
│   └── group.ts
└── index.ts
```

### `dashboard`, `administrator`, `support`, `billing`, `master`, `quiz/dashboard`

Dashboard feature cenderung punya view-model aggregate dan memakai beberapa shared primitive.

```txt
src/features/dashboard/
├── components/
│   ├── activity-columns.tsx
│   ├── dashboard-charts.tsx
│   └── dashboard-stats-grid.tsx
├── hooks/
│   └── use-dashboard-stats.ts
├── types/
│   └── dashboard.ts
└── index.ts
```

Untuk dashboard lain, gunakan pola serupa:

- `src/features/administrator/dashboard/components/location-chart.tsx`
- `src/features/administrator/dashboard/components/demographic-chart.tsx`
- `src/features/support/dashboard/components/support-charts.tsx`
- `src/features/billing/dashboard/components/revenue-chart.tsx`
- `src/features/billing/dashboard/components/plan-distribution-pie.tsx`
- `src/features/quiz/dashboard/components/quiz-stats-charts.tsx`
- `src/features/master/dashboard/components/master-stats-charts.tsx`

## Urutan Rapikan yang Disarankan

1. Rapikan naming folder dulu: `_components` ke `components`, `_hooks` ke `hooks`.
2. Pindahkan type per domain dari `types/*` ke `src/features/<feature>/types/*`.
3. Pindahkan service per domain dari `lib/services/*` ke `src/features/<feature>/services/*`.
4. Pindahkan component root yang domain-specific dari `components/dashboard/*` atau `components/competitions/*` ke feature terkait.
5. Tambahkan `index.ts` di tiap feature sebagai public API.
6. Update import secara bertahap per feature, jangan sekaligus semua.
7. Terakhir, cek duplicate route-like file di `src/features/**/page.tsx`; route utama tetap di `src/app/**/page.tsx`.

