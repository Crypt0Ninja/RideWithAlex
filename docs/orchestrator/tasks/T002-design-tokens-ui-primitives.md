# T002 · Design tokens + UI primitives

**Status:** ✅ Completed (2026-04-23)
**Priority:** High (blocker за T004 hero)
**Depends on:** T001 ✅
**Estimated effort:** ~20–40 минути за downstream агент
**Actual effort:** ~10 минути
**Assigned:** downstream Claude Code агент (agent 2)
**Commit:** [`f105ef8`](https://github.com/Crypt0Ninja/RideWithAlex/commit/f105ef8)

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

### Report 1 — 2026-04-23 · agent 2 · ✅ completed

**Commit:** `f105ef8` — `feat(T002): add design tokens + button/navpill/statblock primitives`
**Time:** ~10 min

#### Обобщение

Добавен shared design-token слой и три UI примитива — буквално от спеца. `lib/cn.ts` е 3-редов hand-rolled classname joiner (без `clsx`/`tailwind-merge`). Изтрит `lib/.gitkeep` (lib/ вече има реално съдържание). Добавени 3 Tailwind v4 `@utility` правила в `app/globals.css` (`hero-title`, `diagonal-divider-right`, `diagonal-divider-left`) след `@theme` блока, без да се пипа `--font-sans`.

Създадени: `Button.tsx` (primary/secondary, pill, lowercase, focus-visible ring), `NavPill.tsx` (polymorphic div|nav, backdrop-blur), `StatBlock.tsx` (value + label + diagonal divider с `align` + `dividerDirection` пропове, hidden md:block). Всички TypeScript, zero `any`. `app/layout.tsx` и `app/page.tsx` — непипнати.

Pre-start `git pull --rebase` е взел orchestrator docs commits (`1f518aa`, `597bf54`). Commit-ът landed чисто върху `597bf54` без conflicts.

#### Acceptance criteria — verified ✅

| Criterion | Evidence |
|---|---|
| `pnpm build` succeeds | `✓ Compiled successfully in 3.0s`, 4/4 static pages |
| `pnpm tsc --noEmit` passes | Exit 0, no output |
| `pnpm lint` passes | `✔ No ESLint warnings or errors` |
| `lib/cn.ts` exists and exports `cn` | ✅ (orchestrator inspected) |
| `Button.tsx` с `variant: "primary" \| "secondary"` | ✅ (orchestrator inspected) |
| `NavPill.tsx` с `as: "div" \| "nav"` | ✅ |
| `StatBlock.tsx` с `align` + `dividerDirection` | ✅ |
| 3 `@utility` декларации в globals.css | ✅ (orchestrator inspected — след `@theme` блока) |
| Zero `any` types | ✅ |
| `app/layout.tsx` + `app/page.tsx` untouched | ✅ (git diff empty) |
| Committed + pushed | `597bf54..f105ef8 main -> main` |

#### Deviations from spec

**None.** Всички 5 файла са създадени/променени точно по спеца.

Лек git history nuance: `pull --rebase` pre-start е взел 2 междинни docs commit-а (`1f518aa`, `597bf54`), така че `f105ef8` е наследник на `597bf54`, не на `8d7133e` — това е коректна rebase семантика.

#### Orchestrator verification

- `lib/cn.ts` — 3 реда, точно според спеца ✅
- `components/ui/Button.tsx` — `ButtonVariant` type, Record mapping, всички classes верни ✅
- `components/ui/NavPill.tsx` — polymorphic `as` prop, `Tag = as`, spread props ✅
- `components/ui/StatBlock.tsx` — conditional rendering за left/right align с divider преди/след value ✅
- `app/globals.css` — `@import` → `@theme` → 3× `@utility`, в правилен ред ✅
- `git diff --stat` на `app/layout.tsx` + `app/page.tsx`: празно ✅

**Вердикт:** T002 е приет без revision. Примитивите чакат T004 (hero) да ги използва.

#### Files changed (6)

- `lib/cn.ts` — created
- `lib/.gitkeep` — deleted (вече не е нужен)
- `components/ui/Button.tsx` — created
- `components/ui/NavPill.tsx` — created
- `components/ui/StatBlock.tsx` — created
- `app/globals.css` — modified (3 × `@utility` блока добавени)
