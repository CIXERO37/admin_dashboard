---
name: tailwind-patterns
description: "Tailwind CSS modern patterns, layout architecture, semantic tokens, and v4 readiness."
risk: safe
source: self
---

# Tailwind CSS Patterns

## Architecture & Conventions

### 1. Semantic Colors First
- **Always** use semantic CSS variables in classes (`bg-primary`, `bg-background`, `text-muted-foreground`).
- **Never** use raw utility colors (`bg-blue-500`, `text-gray-900`) for structural elements like headers, cards, texts.

### 2. Layouts
- **Flexbox**: Use `flex flex-col gap-4` for vertical stacks. **Avoid `space-y-*` or `space-x-*`**.
- **Flex Center**: `flex items-center justify-center`
- **Flex Justify**: `flex items-center justify-between`
- **Grid Layouts**: Prefer `grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` for responsive card grids instead of manual Breakpoints everywhere.

### 3. Container Queries & Breakpoints
- **Mobile First**: Write default styles for mobile. Use `md:`, `lg:` only for larger screen overrides.
- **Container queries**: Use `@container` on parent containers when elements need to be responsive to their parent's container width rather than the viewport.

### 4. Code Cleanliness
- **Merge Classes**: Use a class merging utility like `cn()` or `twMerge` (`tailwind-merge`) when composing components to overwrite styles efficiently.
- **Extraction**: If a tailwind string becomes longer than 50 characters, format it cleanly or abstract repeated combinations into components, **never** random CSS `@apply` blocks unless absolutely necessary.

### 5. Typography & Resiliency
- Ensure texts truncate with `truncate` or `line-clamp-*` for long strings (like names, IDs, addresses).
- Use `size-*` for explicit square dimensions (e.g., `size-10` instead of `w-10 h-10`).
