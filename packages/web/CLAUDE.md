# Claudebin Web - TypeScript UI Engineering Standards

For Senior TypeScript UI Engineers. Write clean, maintainable code.

## CRITICAL RULES

### NEVER Use Tailwind Arbitrary Values

Arbitrary values are FORBIDDEN.

```tsx
// WRONG - Will be rejected
<div className="w-[347px] text-[#ff0000] mt-[23px] bg-[#f5f5f5]" />

// CORRECT - Use theme values only
<div className="w-full max-w-md text-destructive mt-6 bg-muted" />
```

**If you need a custom value:** Add it to `globals.css` @theme first.

### ALWAYS Use `const`

```tsx
// Correct
const items = data.items;
const totalCount = items.length;

// Wrong
let items = data.items;
var totalCount = items.length;
```

Use `let` only when reassignment is absolutely necessary (rare).

### Import Ordering

When working with imports in ANY file (new or existing), follow this order with blank lines between groups:

```tsx
// 1. CSS imports (at the very top, use alias when possible)
import "@/static/css/globals.css";

// 2. Vendors (React, third-party libraries)
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

// 3. Custom hooks
import { useUiState } from "@/hooks/useUiState";

// 4. UI components (shadcn/ui)
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// 5. Custom components
import { SessionBrowserAppBar } from "@/components/SessionBrowserAppBar";
import { SessionBrowserIframe } from "@/components/SessionBrowserIframe";

// 6. Sections
import { SessionBrowserSection } from "@/sections/SessionBrowserSection";
```

**Order Summary:**

1. CSS files
2. Vendors (React, third-party libraries)
3. Custom hooks
4. UI components (shadcn/ui)
5. Custom components
6. Sections

**Rules:**

- Each group MUST be separated by a blank line
- ALWAYS organize imports according to the groups above
- Always use `@/*` path alias

## TypeScript Conventions

### Components

- ALWAYS use arrow functions
- NEVER use function declarations

```tsx
// Correct
export const DashboardAppBar = () => { ... }

// Wrong
export function DashboardAppBar() { ... }
```

### Props

- ALWAYS use `type` (NEVER `interface`)
- Define `type ComponentNameProps = {}` at the top

```tsx
// Correct
type DashboardAppBarProps = {
  title: string;
  onMenuClick: () => void;
}

export const DashboardAppBar = ({ title, onMenuClick }: DashboardAppBarProps) => { ... }

// Wrong
interface DashboardAppBarProps { ... }
```

### Event Handlers

- NEVER use inline callbacks
- ALWAYS define named handler functions

```tsx
// Wrong - inline callback
<Button onClick={() => console.log("clicked")}>Click me</Button>;

// Correct - named handler
const handleClick = () => {
  console.log("clicked");
};

<Button onClick={handleClick}>Click me</Button>;
```

**Handler naming convention:** `handle[Action]` (e.g., `handleSignUp`, `handleSubmit`, `handleDelete`)

### Internationalization

- ALL rendered strings MUST be in `copy/en-EN.json`
- NEVER hardcode strings directly in components
- Use `useTranslations` hook for all text
- **ALWAYS add strings to translations BEFORE using them in components**

```tsx
// Wrong - hardcoded string
<p>By continuing, you agree to our Terms of Service</p>
<Button>Save</Button>

// Correct - from translations
const t = useTranslations("auth");
<p>{t("termsAgreement")}</p>

const t = useTranslations("common");
<Button>{t("save")}</Button>
```

**Workflow:**

1. First, add the string to `copy/en-EN.json`
2. Then, use it in the component with `t()`
3. Never use hardcoded strings, even temporarily

## Architecture

### Structure

```
src/
  app/             # Next.js App Router pages
  components/      # Reusable UI components
    ui/            # shadcn/ui components
  sections/        # Page-level section components
  utils/           # Utilities and helpers
  copy/            # i18n translations
  i18n/            # i18n config
  static/          # CSS, fonts
```

### Component Naming

Prefix components by page/context:

```
SessionBrowserAppBar, SessionBrowserSideBar, ProfileHeaderCard
AppBar, SideBar (too generic, missing context)
```

### shadcn/ui Structure

```
components/ui/
  Button/
    Button.tsx       # Component implementation with type definitions
    index.ts         # Exports
```

**Notes:**

- Props types MUST be defined in the component file (NOT in separate types.ts)
- Use index.ts for exports

**components/ui/Button/index.ts:**

```typescript
export { default as Button } from "./Button";
```

## Clean Code Principles

### Variables

**Use meaningful, pronounceable, searchable names**

```tsx
// Bad
const yyyymmdstr = moment().format("YYYY/MM/DD");
const d = new Date();

// Good
const currentDate = moment().format("YYYY/MM/DD");
const elapsedTimeInDays = new Date();
```

**NEVER use single-letter variable names**

```tsx
// Bad - single letter variables
locations.forEach((l) => dispatch(l));
items.filter((i) => i.id !== id);

// Good - descriptive names
locations.forEach((location) => dispatch(location));
items.filter((item) => item.id !== id);
```

**Use default parameters**

```tsx
// Bad
const createUser = (name) => {
  const userName = name || "Guest";
}

// Good
const createUser = (name = "Guest") => { ... }
```

### Functions

**Do one thing**

```tsx
// Bad - doing multiple things
const emailClients = (clients) => {
  clients.forEach((client) => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}

// Good - single responsibility
const emailActiveClients = (clients) => {
  clients.filter(isActiveClient).forEach(email);
}

const isActiveClient = (client) => {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

**Limit function parameters (2 or fewer ideally)**

```tsx
// Bad
const createMenu = (title, body, buttonText, cancellable) => { ... }

// Good - use object destructuring
const createMenu = ({ title, body, buttonText, cancellable }) => { ... }

createMenu({
  title: "Foo",
  body: "Bar",
  buttonText: "Baz",
  cancellable: true
});
```

**Avoid side effects - don't mutate**

```tsx
// Bad - mutates input
const addItemToCart = (cart, item) => {
  cart.push({ item, date: Date.now() });
};

// Good - returns new array
const addItemToCart = (cart, item) => {
  return [...cart, { item, date: Date.now() }];
};
```

### Conditionals

**Encapsulate conditionals**

```tsx
// Bad
if (fsm.state === "fetching" && isEmpty(listNode)) { ... }

// Good
const shouldShowSpinner = (fsm, listNode) => {
  return fsm.state === "fetching" && isEmpty(listNode);
}

if (shouldShowSpinner(fsmInstance, listNodeInstance)) { ... }
```

**Avoid negative conditionals**

```tsx
// Bad
if (!isDOMNodeNotPresent(node)) { ... }

// Good
if (isDOMNodePresent(node)) { ... }
```

### Error Handling

**Don't ignore caught errors**

```tsx
// Bad
try {
  functionThatMightThrow();
} catch (error) {
  console.log(error);
}

// Good
try {
  functionThatMightThrow();
} catch (error) {
  console.error(error);
  notifyUserOfError(error);
  reportErrorToService(error);
}
```

**Use async/await over promises**

```tsx
// Less clean
get("https://api.example.com")
  .then((body) => writeFile("data.json", body))
  .then(() => console.log("File written"))
  .catch((err) => console.error(err));

// Cleaner
const fetchAndSaveData = async () => {
  try {
    const body = await get("https://api.example.com");
    await writeFile("data.json", body);
    console.log("File written");
  } catch (err) {
    console.error(err);
  }
}
```

### Comments

**Only comment complex business logic**

Good code documents itself. Comments are for WHY, not WHAT.

**Don't leave commented code**

Use version control. Delete dead code.

```tsx
// Bad
doStuff();
// doOtherStuff();
// doSomeMoreStuff();

// Good
doStuff();
```

## Styling with Tailwind

- Reference `globals.css` @theme for all values
- Use semantic color names (`primary`, `secondary`, `muted`)
- Use spacing scale (`space-4`, `gap-6`, `p-8`)
- Use theme breakpoints (`md:`, `lg:`)

**Check `globals.css` @theme before styling anything.**

## Code Organization

- One component per file
- Co-locate related files (component, types, hooks)
- Group by feature, not by type
- Keep functions small and focused
- Extract complex logic into custom hooks
- Prefer composition over prop drilling
