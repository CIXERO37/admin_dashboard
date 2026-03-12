---
name: shadcn-patterns
description: "Master shadcn/ui component usage: strict styling rules, form composition, and layout architecture."
risk: safe
source: self
---

# Shadcn/UI Patterns & Best Practices

## Core Principles
1. **Use existing components first**: Don't build custom generic elements if Shadcn provides them (e.g., `Alert`, `Badge`, `Separator`, `Skeleton`).
2. **Composition over custom markup**: Use `CardTitle`, `CardHeader`, `CardContent`, not custom divs inside `Card`.
3. **Semantic styling ONLY**: Use predefined CSS variables (`bg-primary`, `text-muted-foreground`), NEVER raw colors (`bg-blue-500`).

## Strict Rules
### 1. Styling & Layout
- **No `space-y-*` or `space-x-*`**: Use `flex flex-col gap-*` or `flex gap-*`.
- **Dimensions**: Use `size-*` instead of `w-* h-*` for equal width/height.
- **Truncation**: Use `truncate` instead of `overflow-hidden text-ellipsis whitespace-nowrap`.
- **Conditional Classes**: Always use the `cn()` utility.

### 2. Forms
- **Structure**: Always use `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` for React Hook Form wrappers.
- **No raw divs for forms**: Avoid arbitrary `<div>` with `gap-*`. Group them semantically.

### 3. Overlays & Accessibility
- Components like `Dialog`, `Sheet`, `Drawer` **must** have a title component (`DialogTitle`, `SheetTitle`) even if visually hidden (`className="sr-only"`).
- **Z-Index**: Never manually set `z-index` on overlay components; they handle their own stacking contexts.

### 4. Icons
- Standardize on the active icon library (e.g., Lucide React).
- Pass icons as React elements or objects, not string keys. Use `size-*` explicitly if needed outside the component's internal handling, but rely on component sizes when available.
