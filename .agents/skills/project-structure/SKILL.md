---
name: Project Structure & Organization
description: Guidelines for a clean, modular, and scalable Feature-Based architecture in a Next.js + Supabase project.
---

# Project Structure & Organization

Follow this structure to ensure the project remains "Clean, Modular, and Easy to Understand", adopting a **Feature-Based Architecture**.

## 1. High-Level Folder Overview

```txt
src/
├── app/                  # Next.js App Router (Routing only, no complex logic)
├── features/             # Core Feature Domains (The heart of the app)
├── components/           # Global Shared UI Components (Shadcn, generic UI)
├── lib/                  # Core infrastructure (Supabase, utils, i18n)
├── hooks/                # Global React hooks
├── types/                # Global TypeScript types
└── styles/               # Global CSS and Tailwind configs
```

## 2. The `src/features/` Directory (The Core Hub)

All business logic, state, and feature-specific UI must be grouped by domain (e.g., `users`, `groups`, `manage-competitions`, `game`). 
Inside each feature folder, adhere to this structure:

```txt
src/features/<feature-name>/
├── components/           # UI components used globally across the feature
├── _components/          # Private UI components used ONLY for specific pages/routes
├── hooks/                # Custom hooks used globally across the feature
├── _hooks/               # Private hooks used ONLY for specific pages/routes
├── types/                # Types/Interfaces specific to this feature
├── services/             # Abstractions, API calls, or Server Actions for this feature
├── actions.ts            # Next.js Server Actions (can also be inside services/)
├── [id]/                 # Sub-routes or detailed views for this domain
│   ├── _components/      # Components strictly private to this sub-route
│   └── page-client.tsx
└── index.ts              # Public API for this feature (exporting what others can use)
```

### The Underscore Prefix Rule (`_`)
- **Public / Shared (No Underscore)**: Directories like `components/` and `hooks/` mean the files inside are intended to be shared and reused **globally** (across the feature or even the app).
- **Private (With Underscore)**: Directories like `_components/` and `_hooks/` mean the files are **private** and strictly used only by the immediate surrounding pages or a few closely related pages. They should NOT be imported globally.

## 3. The `src/app/` Directory (App Router)

Keep the `app/` directory as a **thin wrapper**. Do **not** put complex business logic here.
Use `page.tsx` and `layout.tsx` purely for routing, fetching initial server data (if necessary), and rendering the main Client/Server components imported from `src/features/`.

```txt
src/app/(dashboard)/groups/
├── page.tsx              # Imports <GroupDetailClient /> from src/features/groups/
└── layout.tsx
```

## 4. The `src/components/` Directory (Global Shared UI)

Use this directory ONLY for components that are truly global and cross-domain.
- **`components/ui/`**: Base primitive components (e.g., Shadcn UI).
- **`components/shared/`**: Generic reusable UI (e.g., `ConfirmActionDialog`, `SearchInput`).
- **`components/dashboard/`**: Reusable primitives for dashboards (e.g., `StatCard`, generic `DataTable`).

## 5. The `src/lib/` Directory (Core Infrastructure)
Avoid putting feature business logic here. This is strictly for:
- **`lib/supabase/`**: Supabase client configurations (browser, server, admin).
- **`lib/utils.ts`**: Helper functions (date formatting, classNames, id generators).
- **`lib/i18n/`**: Localization setup.

## 6. Naming Conventions

- **Files**: Use `kebab-case` for all files (e.g., `group-detail-client.tsx`, `manage-competitions.tsx`). Be consistent.
- **Directories**: Always use `kebab-case` (e.g., `competition-detail`).
- **Feature Folders**: Use plural names when representing collections (e.g., `users`, `groups`) or specific domain names (e.g., `manage-competitions`, `game`).
