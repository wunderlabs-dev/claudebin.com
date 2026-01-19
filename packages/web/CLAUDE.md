# Claudebin Web - TypeScript UI Engineering Standards

## Project Structure

```
src/
├── app/             # Next.js App Router pages
├── components/      # Reusable UI components
│   └── ui/          # shadcn/ui components
├── sections/        # Page-level section components
├── utils/           # Utilities, constants, helpers
├── copy/            # i18n translations (en-EN.json)
├── i18n/            # i18n config
└── static/          # CSS, fonts
```

## Critical Rules

### NEVER Use Tailwind Arbitrary Values

```tsx
// Wrong
<div className="w-[347px] text-[#ff0000] mt-[23px]" />

// Correct
<div className="w-full max-w-md text-destructive mt-6" />
```

**If you need a custom value:** Add it to `globals.css` @theme first.

### ALWAYS Use `const`

```tsx
// Correct
const items = data.items;

// Wrong
let items = data.items;
```

Use `let` only when reassignment is absolutely necessary.

### Import Ordering

```tsx
// 1. CSS imports
import "@/static/css/globals.css";

// 2. Vendors (React, third-party)
import { useRef } from "react";

// 3. Custom hooks
import { useUiState } from "@/hooks/useUiState";

// 4. UI components (shadcn/ui)
import { Button } from "@/components/ui/Button";

// 5. Custom components
import { SessionAppBar } from "@/components/SessionAppBar";

// 6. Sections
import { SessionSection } from "@/sections/SessionSection";
```

Each group separated by blank line. Always use `@/*` path alias.

## Component Conventions

### Structure

Each component lives in its own directory:

```
components/Button/
├── Button.tsx    # Component implementation
├── types.ts      # Types and variant definitions
└── index.ts      # Barrel exports
```

### Arrow Functions Only

```tsx
// Correct
export const DashboardAppBar = () => { ... }

// Wrong
export function DashboardAppBar() { ... }
```

### Props

- Use `type` (never `interface`)
- Spread native HTML attributes: `& HTMLAttributes<HTMLElement>`
- Set defaults in parameters: `variant = "default"`

```tsx
type ButtonProps = {
  variant?: ButtonVariant;
} & HTMLButtonAttributes<HTMLButtonElement>;

export const Button = ({ variant = "default", ...props }: ButtonProps) => { ... }
```

### Type Patterns

Use `as const` for variant unions:

```typescript
export const ButtonVariants = ["default", "outline", "ghost"] as const;
export type ButtonVariant = (typeof ButtonVariants)[number];
export type ButtonVariantMapping = Record<ButtonVariant, string>;
```

Use discriminated unions when variant affects required props:

```typescript
type ChipDefaultProps = ChipBaseProps & {
  variant?: "default";
  color: ChipColor;
};
type ChipOutlinedProps = ChipBaseProps & { variant: "outlined"; color?: never };
export type ChipProps = ChipDefaultProps | ChipOutlinedProps;
```

### Exports

Barrel exports in `index.ts`:

```typescript
export { default as Button } from "./Button";
export * from "./types";
```

### Event Handlers

Named handlers only, never inline callbacks:

```tsx
// Wrong
<Button onClick={() => console.log("clicked")}>Click</Button>

// Correct
const handleClick = () => {
  console.log("clicked");
};

<Button onClick={handleClick}>Click</Button>
```

Naming: `handle[Action]` (e.g., `handleSignUp`, `handleSubmit`)

### Naming Conventions

- **Files**: PascalCase for components (`Button.tsx`), camelCase for utils (`helpers.ts`)
- **Types**: `ComponentNameProps`, `ComponentNameVariant`, `ComponentNameVariantMapping`
- **Mapping objects**: `xxxClassNames` (e.g., `buttonVariantClassNames`)
- **Const arrays**: Plural form (`ButtonVariants`)

## Styling

### Variant Mapping Objects

```typescript
const buttonVariantClassNames: ButtonVariantMapping = {
  default: "bg-primary text-primary-foreground",
  outline: "border border-input bg-background",
  ghost: "hover:bg-accent hover:text-accent-foreground"
};

// Use cn() for class merging
className={cn("base-classes", buttonVariantClassNames[variant])}
```

### Tailwind Rules

- Reference `globals.css` @theme for all values
- Use semantic color names (`primary`, `secondary`, `muted`)
- Use spacing scale (`gap-4`, `p-6`, `mt-8`)
- Check `globals.css` @theme before styling anything

### Tailwind Class Ordering

Order classes by visual hierarchy (outside-in, structure to details):

1. **Layout** - display, position, flex/grid setup (`flex`, `grid`, `absolute`, `relative`)
2. **Flex/Grid modifiers** - alignment, justify, direction (`items-center`, `justify-between`, `flex-col`)
3. **Sizing** - width, height, max/min (`w-full`, `max-w-6xl`, `h-screen`)
4. **Spacing** - margin, padding, gap (`mx-auto`, `p-2`, `gap-8`)
5. **Background** - colors, gradients, images (`bg-gray-100`, `bg-radial`)
6. **Border** - border, rounded (`border`, `border-gray-500/20`, `rounded-3xl`)
7. **Typography** - font, text, leading (`text-xl`, `font-bold`, `leading-normal`)
8. **Effects** - shadow, opacity, blur (`shadow-lg`, `opacity-50`)
9. **Transitions** - transition, duration, ease (`transition`, `duration-200`)
10. **Selectors** - child/descendant selectors last (`[&_video]:w-full`)

```tsx
// Correct ordering
<div className="flex items-center w-full max-w-6xl mx-auto p-2 bg-radial from-gray-100/50 to-gray-200/50 border border-gray-500/20 rounded-3xl [&_video]:w-full [&_video]:rounded-2xl" />

// Categories visible:
// flex items-center          → layout + flex modifiers
// w-full max-w-6xl           → sizing
// mx-auto p-2                → spacing
// bg-radial from-* to-*      → background
// border border-* rounded-*  → border
// [&_video]:*                → selectors
```

## Internationalization

- ALL rendered strings MUST be in `copy/en-EN.json`
- Use `useTranslations` hook for all text
- Add strings to translations BEFORE using in components

```tsx
const t = useTranslations("auth");
<p>{t("termsAgreement")}</p>
```

Rich text with inline renderers:

```tsx
{t.rich("error404.doesNotExist", {
  serif: (chunks: ReactNode) => (
    <span className="font-serif italic">{chunks}</span>
  ),
})}
```

Translation strings use XML-like tags:

```json
{
  "error404.doesNotExist": "The page does <serif>not exist</serif>."
}
```

## Clean Code

### Variables

- Use meaningful, pronounceable names
- Never use single-letter variables
- Use default parameters

```tsx
// Bad
items.filter((i) => i.id !== id);

// Good
items.filter((item) => item.id !== id);
```

### Functions

- Do one thing (single responsibility)
- Limit parameters (2 or fewer, use object destructuring)
- Avoid side effects - don't mutate
- Encapsulate conditionals
- Avoid negative conditionals

### Error Handling

- Don't ignore caught errors
- Use async/await over promise chains

### Comments

- Use `// ABOUTME:` prefix for explanation comments on complex patterns
- Only comment WHY, not WHAT
- Delete commented code (use version control)

### Animations

Define in `/src/utils/keyframes.ts` and reuse across components.

## Code Organization

- One component per file
- Co-locate related files (component, types, hooks)
- Group by feature, not by type
- Keep functions small and focused
- Extract complex logic into custom hooks
- Prefer composition over prop drilling

## Commit Convention

Follow conventional commits: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `ci`, `test`, `revert`, `perf`
