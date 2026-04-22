---
name: Project Structure & Organization
description: Guidelines for a clean, modular, and scalable folder structure in a Next.js + Supabase project.
---

# Project Structure & Organization

Follow this structure to ensure the project remains "Clean, Modular, and Easy to Understand" (Poin 1 & 2 of the Briefing).

## 1. High-Level Folder Overview

```txt
├── app/                  # Routing, Layouts, and Page components
├── components/           # UI and Feature-specific components
├── lib/                  # Core logic, services, and shared utilities
├── hooks/                # Global reusable React hooks
├── types/                # Global TypeScript interfaces/types
├── public/               # Static assets (images, icons, WebP)
└── styles/               # Global CSS and Tailwind theme configs
```

## 2. The `app/` Directory (App Router) & Colocation
Use **Colocation** extensively. Keep route-specific components, hooks, and server actions closely coupled to the route where they belong.

```txt
app/(dashboard)/users/
├── page.tsx              # Main Page (Server/Client Component)
├── actions.ts            # Next.js Server Actions specific to this route
├── _components/          # Private UI components (e.g., user-table.tsx)
├── _hooks/               # Private hooks (e.g., use-users-table.ts)
└── [id]/                 # Nested Route
    └── page.tsx
```

## 3. The `lib/` Directory (The Logic Hub)
Avoid putting business logic in the `app/` directory.

- **`lib/services/`**: Centralized, reusable data fetching services. If logic is only for ONE route, prefer putting it in an `actions.ts` inside that route folder instead of here.
- **`lib/utils.ts`**: Helper functions (date formatting, currency, etc.).
- **`lib/supabase/`**: Supabase client configurations (browser/server).
- **`lib/i18n/`**: Localization setup.

## 4. The `components/` Directory
Follow the Atomic/Layered approach:

- **`components/ui/`**: Base Shadcn components.
- **`components/dashboard/`**: Reusable dashboard-specific elements (e.g. `DataTable`, `Sidebar`).
- **`components/shared/`**: Generic reusable UI (e.g. `ConfirmDialog`, `LoadingSpinner`).

## 5. Metadata & SEO
Every page in `app/` should have a `metadata` object or a `generateMetadata` function for SEO and browser titles.

## 6. Naming Conventions
- **Files**: Use kebab-case (e.g., `manage-competitions.tsx`) or PascalCase for components (e.g., `DataTable.tsx`). Be consistent.
- **Directories**: Always use kebab-case (e.g., `competition-detail`).
- **Private Folders**: Prefix with an underscore (e.g., `_components`) to signal they are not routes.
