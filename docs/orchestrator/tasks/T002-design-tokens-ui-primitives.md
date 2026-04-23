# T002 · Design tokens + UI primitives

**Status:** 🟢 Ready
**Priority:** High (blocker за T004 hero)
**Depends on:** T001 ✅
**Estimated effort:** ~20–40 минути за downstream агент
**Assigned:** pending

## Цел

Създаване на минималния споделен речник от design tokens и UI примитиви, с които T004 (hero) и следващите страници ще се сглобят без да преизмисляме основите. Чист scope: `components/`, `lib/`, и append към `globals.css`. **НЕ пипа `app/`** — това е територията на T003.

## Scope на промените

**Създава:**
- `lib/cn.ts` — classname merge utility
- `components/ui/Button.tsx` — primary + secondary pill бутон
- `components/ui/NavPill.tsx` — контейнер за floating navbar pills
- `components/ui/StatBlock.tsx` — голямо число + диагонален разделител + sub-label

**Модифицира:**
- `app/globals.css` — добавя `@utility hero-title` + `@utility diagonal-divider` (Tailwind v4 custom utilities)

**НЕ пипа:** `app/layout.tsx`, `app/page.tsx`, никакви route файлове, `package.json`, `tsconfig.json`.

## Acceptance criteria

- [ ] `pnpm build` минава без грешки
- [ ] `pnpm tsc --noEmit` минава
- [ ] `pnpm lint` минава
- [ ] `lib/cn.ts` exports `cn(...classes)` която филтрира falsy и join-ва с " "
- [ ] `components/ui/Button.tsx` — React component с `variant: "primary" | "secondary"`, lowercase текст, rounded-full, pill форма
- [ ] `components/ui/NavPill.tsx` — полиморфен контейнер с `bg-neutral-900/90 backdrop-blur rounded-full`
- [ ] `components/ui/StatBlock.tsx` — приема `value`, `label`, `align: "left" | "right"`, диагонален divider
- [ ] `app/globals.css` има `@utility hero-title` с `letter-spacing: -0.04em; line-height: 0.95; text-transform: lowercase;`
- [ ] Всички компоненти са TypeScript с proper типове (никакви `any`)
- [ ] Commit-нато и push-нато

## Agent prompt

```markdown
# T002 · Design tokens + UI primitives — RideWithAlex

You are working on **RideWithAlex** — a website for Alex, a snowboard instructor in Bansko, Bulgaria. This task is atomic and self-contained.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`. T001 (Next.js scaffold) is already done — you're adding to an existing Next.js 15 + Tailwind v4 + Readex Pro app.

**IMPORTANT:** Run `git pull --rebase origin main` BEFORE you start and BEFORE you push — another agent may be working on T003 in parallel.

Before you start, read:
- `docs/03-design-direction.md` — visual rules (monochrome, lowercase, Readex Pro)
- `docs/orchestrator/tasks/T002-design-tokens-ui-primitives.md` — this task's full spec
- `app/globals.css` — current Tailwind v4 theme
- `app/layout.tsx`, `app/page.tsx` — current app structure (DO NOT MODIFY)

## Your task

Add design tokens and 3 UI primitive components. Nothing else. No pages, no hero, no routing. The goal is to hand T004 (hero) a ready toolbox.

## Files to create / modify

### 1. `lib/cn.ts` (new)

```ts
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

### 2. `app/globals.css` (append, do not remove existing)

After the existing `@theme { ... }` block, add:

```css
@utility hero-title {
  letter-spacing: -0.04em;
  line-height: 0.95;
  text-transform: lowercase;
}

@utility diagonal-divider-right {
  display: block;
  height: 1px;
  width: 6rem;
  background-color: rgb(255 255 255 / 0.4);
  transform: rotate(20deg);
}

@utility diagonal-divider-left {
  display: block;
  height: 1px;
  width: 6rem;
  background-color: rgb(255 255 255 / 0.4);
  transform: rotate(-20deg);
}
```

### 3. `components/ui/Button.tsx` (new)

```tsx
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-normal lowercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-white text-black hover:bg-neutral-200",
    secondary:
      "border border-white/20 text-white hover:bg-white/5 hover:border-white/40",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
```

### 4. `components/ui/NavPill.tsx` (new)

```tsx
import { cn } from "@/lib/cn";

type NavPillProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "nav";
};

export function NavPill({ as = "div", className, children, ...props }: NavPillProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "bg-neutral-900/90 backdrop-blur rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
```

### 5. `components/ui/StatBlock.tsx` (new)

```tsx
import { cn } from "@/lib/cn";

type StatBlockProps = {
  value: string;       // e.g. "+500"
  label: string;       // e.g. "riders taught"
  align?: "left" | "right";
  dividerDirection?: "up" | "down"; // "up" = rotate 20deg, "down" = rotate -20deg
  className?: string;
};

export function StatBlock({
  value,
  label,
  align = "left",
  dividerDirection = "up",
  className,
}: StatBlockProps) {
  const rowJustify = align === "right" ? "justify-end" : "justify-start";
  const labelAlign = align === "right" ? "text-right" : "text-left";
  const dividerClass =
    dividerDirection === "up" ? "diagonal-divider-right" : "diagonal-divider-left";
  const divider = <span aria-hidden className={cn("hidden md:block", dividerClass)} />;
  return (
    <div className={className}>
      <div className={cn("flex items-center gap-3", rowJustify)}>
        {align === "right" ? (
          <>
            {divider}
            <span className="text-4xl md:text-5xl font-medium tracking-tight">
              {value}
            </span>
          </>
        ) : (
          <>
            <span className="text-4xl md:text-5xl font-medium tracking-tight">
              {value}
            </span>
            {divider}
          </>
        )}
      </div>
      <p className={cn("text-xs md:text-sm text-white/70 mt-1 lowercase", labelAlign)}>
        {label}
      </p>
    </div>
  );
}
```

## Design rules (enforce strictly)

- Background: `bg-black` only (but these components don't set their own background)
- Text: `text-white`, `text-white/90`, `text-white/70` only
- **All UI text lowercase** — no exceptions
- Readex Pro is already loaded globally; don't re-import
- No color accents
- No new dependencies (no shadcn, no framer-motion, no clsx, no tailwind-merge)

## Do NOT

- ❌ Modify `app/layout.tsx` or `app/page.tsx` — that's T003's territory
- ❌ Install any new dependencies — `cn` is hand-rolled for a reason
- ❌ Create a showcase/demo page for these components
- ❌ Add Storybook / tests in this task — that's future infra
- ❌ Use `tailwind-merge` or `clsx` — the hand-rolled `cn` is enough
- ❌ Skip git hooks (`--no-verify`)

## Git workflow

1. `git pull --rebase origin main` BEFORE starting (parallel work possible)
2. Create all files above
3. Verify `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint` all pass
4. `git add` only the files you changed — NOT `lib/.gitkeep` (delete if `lib/cn.ts` replaces it)
5. Commit with `feat(T002): add design tokens + button/navpill/statblock primitives`
6. `git pull --rebase origin main` AGAIN just before push (in case T003 landed meanwhile)
7. `git push origin main`

If rebase surfaces conflicts: `git rebase --abort` and report the conflict in your report — don't try to resolve.

## Acceptance criteria (all must pass)

- [ ] `pnpm build` succeeds
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `lib/cn.ts` exists and exports `cn`
- [ ] `components/ui/Button.tsx` exists with variant prop
- [ ] `components/ui/NavPill.tsx` exists
- [ ] `components/ui/StatBlock.tsx` exists with align and dividerDirection props
- [ ] `app/globals.css` has `@utility hero-title` + both diagonal-divider utilities
- [ ] Zero `any` types in the new files
- [ ] `app/layout.tsx` and `app/page.tsx` untouched (`git diff` empty for them)
- [ ] Commits pushed to `origin/main`

## Report back with

Respond with exactly this markdown block, filled in:

```markdown
## Report — T002

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X minutes

### What I did
(1-3 paragraphs, ≤ 200 words)

### Acceptance criteria
(checked against spec)

### Deviations from spec
(If any)

### Blockers / questions
(If any)

### Files changed
- path — created | modified | deleted
```
```

---

## Reports

_(празно — чака downstream агента)_
