# T001 · Next.js 15 scaffold

**Status:** 🟢 Ready
**Priority:** Critical (blocker за всичко останало)
**Depends on:** —
**Estimated effort:** ~30–60 минути за downstream агент
**Assigned:** pending (ще се изпълни от downstream Claude Code сесия)

## Цел

Инициализация на Next.js 15 проект с минимална функционалност: Tailwind v4, TypeScript strict mode, Readex Pro зареден, черен фон с бял lowercase текст. Нищо повече. Всичко останало (hero, i18n, страници) идва в следващите задачи.

## Acceptance criteria

- [ ] `pnpm install` завършва без грешки
- [ ] `pnpm dev` стартира на `http://localhost:3000` без грешки
- [ ] `pnpm build` завършва успешно
- [ ] `pnpm tsc --noEmit` минава без грешки
- [ ] `pnpm lint` минава без грешки
- [ ] Черен фон (`bg-black`), бял текст (`text-white`)
- [ ] Readex Pro е заредено от Google Fonts (weights 300, 400, 500, 600, 700) — видимо в devtools Network tab
- [ ] На `/` се вижда само думата `ridewithalex` lowercase, центрирана, около 32px
- [ ] Има `favicon.svg` в `public/` копиран от `assets/brand/favicon.svg`
- [ ] Folder struct: `app/`, `components/`, `lib/`, `public/`
- [ ] `package.json` има `"packageManager": "pnpm@X.X.X"`
- [ ] Всичко е commit-нато и push-нато на `origin/main`

## Пълен промпт за downstream агент

Виж секцията "Agent prompt" по-долу. Alex копира целия блок и го пуска на нов агент.

---

## Agent prompt

```markdown
# T001 · Next.js 15 scaffold — RideWithAlex

You are working on **RideWithAlex** — a website for Alex, a snowboard instructor in Bansko, Bulgaria. This task is atomic and self-contained.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`. The repo already contains `docs/`, `assets/brand/`, `README.md`, and `.gitignore`. Everything else needs to be created by you.

Before you start, read:
- `docs/03-design-direction.md` — visual rules (monochrome, lowercase, Readex Pro)
- `docs/04-tech-stack.md` — required technologies
- `docs/orchestrator/tasks/T001-nextjs-scaffold.md` — this task's full spec

## Your task

Scaffold a minimal Next.js 15 project with Tailwind v4 and Readex Pro, that serves a black page with the word `ridewithalex` (lowercase, white, Readex Pro, ~32px) centered. That's it. No hero, no i18n, no extra pages.

## Requirements

- Use **pnpm** as package manager (not npm/yarn)
- Next.js **15+** with App Router
- TypeScript strict mode (`"strict": true` + `"noUncheckedIndexedAccess": true`)
- Tailwind CSS **v4** (new config via `@theme` in CSS, not `tailwind.config.js`)
- ESLint with Next.js defaults
- Font: Readex Pro via `next/font/google` (weights: 300, 400, 500, 600, 700)
- Folder structure at repo root:
  ```
  app/
    layout.tsx
    page.tsx
    globals.css
  components/     (empty, with .gitkeep)
  lib/            (empty, with .gitkeep)
  public/
    favicon.svg   (copy from assets/brand/favicon.svg)
  package.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  .eslintrc (if needed)
  ```
- `package.json` includes `"packageManager": "pnpm@X.X.X"` (latest stable)
- `app/layout.tsx` sets `<html lang="en">`, applies Readex Pro as default font via `className`, and sets `<body>` to `bg-black text-white antialiased min-h-screen`
- `app/page.tsx` renders a `<main>` with `flex min-h-screen items-center justify-center` and a single `<h1>` with `text-3xl font-medium tracking-tight lowercase` saying `ridewithalex`
- `app/globals.css` has Tailwind v4 imports and a `@theme` block with at least the `--font-sans: "Readex Pro", system-ui, sans-serif;` declaration

## Design rules (enforce strictly)

- Background: `bg-black` only
- Text: `text-white` only
- **All UI text lowercase** — no exceptions
- Readex Pro everywhere
- No color accents (no orange, blue, green, purple)
- Tailwind v4 syntax (`@import "tailwindcss"`, `@theme`)

## Do NOT

- ❌ Build any hero section — that's T004
- ❌ Add i18n / next-intl — that's T003
- ❌ Create a README (one already exists at root)
- ❌ Modify files in `docs/`, `assets/`, or `README.md`
- ❌ Change `.gitignore` except to add Next.js paths (`.next/`, `out/`, `build/`) — if they're not already there
- ❌ Add shadcn/ui, Framer Motion, or any other dependency beyond Tailwind + Next.js core in this task
- ❌ Skip git hooks (`--no-verify`)

## Git workflow

- Commit messages: `<type>(T001): <short description>`
- Example: `feat(T001): scaffold next.js 15 with tailwind v4 and readex pro`
- Push to `origin/main` when all acceptance criteria pass
- If stuck: commit partial work with `wip(T001): <what's done>` and report the blocker

## Acceptance criteria (all must pass)

- [ ] `pnpm install` succeeds
- [ ] `pnpm dev` starts at `http://localhost:3000` without errors
- [ ] `pnpm build` succeeds
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `/` shows `ridewithalex` centered, white on black, lowercase, Readex Pro (verify in browser)
- [ ] Readex Pro visible in devtools Network tab with weights 300-700
- [ ] `public/favicon.svg` exists (copied from `assets/brand/favicon.svg`)
- [ ] All files committed and pushed to `origin/main`

## Report back with

Respond with exactly this markdown block, filled in:

```markdown
## Report — T001

**Status:** completed | partial | blocked
**Commits:** [SHA1 — message]
**Time spent:** ~X minutes

### What I did
(1-3 paragraphs, ≤ 200 words)

### Acceptance criteria
- [x] `pnpm install` succeeds — evidence: ...
- [x] `pnpm dev` works — evidence: ...
- (etc.)

### Deviations from spec
(If any — why, and what was different)

### Blockers / questions
(If any)

### Files changed
- `package.json` — created
- `app/layout.tsx` — created
- (etc.)
```
```

---

## Reports

_(празно — ще се попълни когато Alex донесе доклад от downstream агента)_
