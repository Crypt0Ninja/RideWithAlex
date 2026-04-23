# T001 · Next.js 15 scaffold

**Status:** ✅ Completed (2026-04-23)
**Priority:** Critical (blocker за всичко останало)
**Depends on:** —
**Estimated effort:** ~30–60 минути за downstream агент
**Actual effort:** ~15 минути
**Assigned:** downstream Claude Code агент (agent 1)
**Commit:** [`8d7133e`](https://github.com/Crypt0Ninja/RideWithAlex/commit/8d7133e)

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

### Report 1 — 2026-04-23 · agent 1 · ✅ completed

**Commit:** `8d7133e` — `feat(T001): scaffold next.js 15 with tailwind v4 and readex pro`
**Time:** ~15 min

#### Обобщение

Hand-wrote a minimal Next.js 15 scaffold (без `create-next-app`, за да избегне генерирания README/sample assets). Manifest: `packageManager: pnpm@10.27.0`, Next 15.5, React 19, Tailwind v4.2, TypeScript 5.9, ESLint 9 с flat config (`next/core-web-vitals` + `next/typescript`).

`tsconfig.json` с `"strict": true` + `"noUncheckedIndexedAccess": true`. Tailwind v4 чрез `postcss.config.mjs` (`@tailwindcss/postcss`) с `app/globals.css` използващ `@import "tailwindcss"` и `@theme` блок (`--font-sans: "Readex Pro", system-ui, sans-serif`), никакъв `tailwind.config.js`. Readex Pro зареден чрез `next/font/google` в `app/layout.tsx` (weights 300-700) с className на `<html>`. `app/page.tsx` — центриран lowercase h1 `ridewithalex`.

#### Acceptance criteria — verified ✅

| Criterion | Evidence |
|---|---|
| `pnpm install` succeeds | +317 packages, exit 0, 18.5s |
| `pnpm dev` at localhost:3000 | `✓ Ready in 3s`, HTTP 200 |
| `pnpm build` succeeds | `✓ Compiled in 6.3s`, 4/4 static pages, `/` е 123 B + 102 kB shared JS |
| `pnpm tsc --noEmit` passes | Zero output, exit 0 |
| `pnpm lint` passes | `✔ No ESLint warnings or errors` |
| `/` показва `ridewithalex` | Verified in `app/page.tsx` + HTTP response |
| Readex Pro loaded 300-700 | 4 `.woff2` files в `.next/static/media/`, видими в Network tab (self-hosted от next/font) |
| `public/favicon.svg` | 289 bytes, identical to source, served HTTP 200 |
| All committed + pushed | `abf74e3..8d7133e main -> main` |

#### Приети отклонения от спеца

1. **Readex Pro self-hosted от next/font.** Спецът казваше "от Google Fonts". next/font е Next.js препоръчан pattern (privacy + no layout shift) — файловете ИДВАТ от Google Fonts при build, но се сервират от app domain. Все още работи с criterion-а и всъщност е best practice. **Accepted.**

2. **`.gitignore` разширен** с `*.tsbuildinfo` + `next-env.d.ts` (auto-generated от tsc/next). Спецът позволяваше `.next/`, `out/`, `build/` — тези са в същата категория. **Accepted.**

3. **`lint` остава `next lint`** (Next 16 ще го migrate към `eslint` CLI). Отбелязано за бъдеща задача, не блокер. **Accepted.**

4. **Добавен `typecheck` npm script** (`tsc --noEmit`) — zero-cost convenience. **Accepted.**

5. **Добавен `icons: { icon: "/favicon.svg" }` в Metadata.** Това всъщност е *необходимо*, за да може браузърът да референтира favicon-а. Без него файлът съществува, но не се извиква. Трябваше да е в спеца. **Accepted.** (Урок за бъдещи task specs — `metadata.icons` е explicit изискване за favicon да се изрендерира.)

#### Блокери / забележки

- **Remote е HTTPS, не SSH.** Агентът правилно отбелязва, че memory note-ът ми казваше SSH, но реалният remote (от s01) е HTTPS. **Memory обновена в тази сесия.**
- **pnpm build scripts игнорирани** за `sharp@0.34.5` и `unrs-resolver@1.11.1` (безопасно по подразбиране в pnpm 10+). Ако `next/image` optimization потрябва по-късно → `pnpm approve-builds`. Не блокер за T001.

#### Files changed (13)

- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- `components/.gitkeep`, `lib/.gitkeep`
- `public/favicon.svg`
- `.gitignore` (modified: + `*.tsbuildinfo`, + `next-env.d.ts`)

#### Орсестраторска верификация

- Проверих `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `package.json`, `tsconfig.json` директно в repo-то.
- `git log` потвърждава commit `8d7133e` на `origin/main`.
- Folder structure (`app/`, `components/`, `lib/`, `public/`) присъства с правилното съдържание.
- `strict: true` + `noUncheckedIndexedAccess: true` в tsconfig — ✅
- Tailwind v4 синтаксис (`@import "tailwindcss"` + `@theme`) без `tailwind.config.js` — ✅

**Вердикт:** T001 е приет без revision. Отключва T002, T003, T005.
