# T018 · Font swap (Readex Pro → Onest за cyrillic)

**Status:** ✅ Completed (2026-04-23)
**Priority:** High (blocker за T004 hero на BG локала)
**Depends on:** T003 ✅
**Estimated effort:** ~15–20 минути за downstream агент
**Actual effort:** ~7 минути
**Assigned:** downstream Claude Code агент (agent 4)
**Commit:** [`b9faac6`](https://github.com/Crypt0Ninja/RideWithAlex/commit/b9faac6)

## Защо съществува тази задача

T003 surface-на проблем: **Readex Pro в Google Fonts няма cyrillic subset**. Шрифтът не съдържа cyrillic глифове и в OpenType source-а си (базиран на IBM Plex Arabic + Latin variants). Понеже BG е first-class locale за RideWithAlex, трябва да сменим на шрифт с пълен cyrillic.

**Решение на оркестратора:** смяна на **Onest** — geometric rounded sans, визуално близо до Readex Pro, пълен cyrillic в Google Fonts.

## Сравнение Readex Pro vs Onest

| Свойство | Readex Pro | Onest |
|---|---|---|
| Стил | Geometric, леко rounded | Geometric, леко rounded |
| Weights | 160-700 (variable) | 100-900 |
| Latin | ✅ | ✅ |
| Cyrillic | ❌ | ✅ |
| Arabic | ✅ | ❌ (не ни трябва) |
| Vibe | Modern, friendly, читаем | Modern, sharper, editorial |
| Editorial feel | Добър | По-добър за минималистичен дизайн |

## Scope на промените

**Модифицира:**
- `app/[locale]/layout.tsx` — `Readex_Pro` → `Onest`, subsets `["latin", "latin-ext", "cyrillic"]`
- `app/globals.css` — `--font-sans: "Onest", system-ui, sans-serif`
- `docs/03-design-direction.md` — шрифт секцията обновена с Onest + рационал
- `docs/01-business-brief.md` — ако споменава Readex Pro

**НЕ пипа:** `middleware.ts`, `i18n/`, `messages/`, `components/`, `lib/`, други docs.

## Acceptance criteria

- [ ] `pnpm build` минава
- [ ] `pnpm tsc --noEmit` минава
- [ ] `pnpm lint` минава
- [ ] `/en` показва `ridewithalex` с Onest (Network tab: `.woff2` файлове с `onest`)
- [ ] `/bg` показва `ridewithalex` (без system font fallback — shrift-ът е Onest за cyrillic)
- [ ] Никакви останали референции към `Readex_Pro` или `Readex Pro` в `app/`, `components/`, `lib/`
- [ ] `docs/03-design-direction.md` обновен с Onest
- [ ] `--font-sans` в globals.css използва `"Onest"` като първи избор
- [ ] Commit-нато и push-нато

## Agent prompt

```markdown
# T018 · Font swap (Readex Pro → Onest) — RideWithAlex

You are working on **RideWithAlex**. T003 surfaced a blocker: Readex Pro has no Cyrillic subset, and Bulgarian is a first-class locale. The orchestrator decided to swap to **Onest** (geometric sans with full Cyrillic, aesthetically close to Readex Pro).

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**IMPORTANT:** `git pull --rebase origin main` BEFORE start AND before push.

Before starting, read:
- `docs/orchestrator/tasks/T018-font-swap-cyrillic.md` — this task
- `app/[locale]/layout.tsx` — current Readex Pro import (will change)
- `app/globals.css` — current `@theme` with `--font-sans`
- `docs/03-design-direction.md` — font section to update

## Your task

Swap Readex Pro for Onest across the app. Update docs to reflect.

## Files to change

### 1. `app/[locale]/layout.tsx`

Replace:
```tsx
import { Readex_Pro } from "next/font/google";

const readexPro = Readex_Pro({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
```

With:
```tsx
import { Onest } from "next/font/google";

const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
```

And rename the usage in JSX from `readexPro.className` to `onest.className`.

### 2. `app/globals.css`

Change the `@theme` block from:
```css
@theme {
  --font-sans: "Readex Pro", system-ui, sans-serif;
}
```

To:
```css
@theme {
  --font-sans: "Onest", system-ui, sans-serif;
}
```

Leave the `@utility` blocks (hero-title + diagonal dividers) unchanged.

### 3. `docs/03-design-direction.md`

Find the "Типография" (Typography) section. Update it to reflect the new font choice. The new content for that section should be:

```markdown
## Типография

**Шрифт:** [Onest](https://fonts.google.com/specimen/Onest) — geometric, леко rounded sans-serif. Чете се отлично и на латиница, и на кирилица — което е критично, понеже BG е first-class locale за сайта.

**Защо Onest, а не Readex Pro (първоначален избор):** Readex Pro няма cyrillic subset в Google Fonts (нито в source-а), което би значило system font fallback за BG страниците. Onest запазва същия geometric editorial feel, но с пълна cyrillic поддръжка.

**Weights за зареждане:** 300, 400, 500, 600, 700

**Правила за заглавия (`.hero-title`):**
\`\`\`css
font-family: 'Onest', system-ui, sans-serif;
letter-spacing: -0.04em;
line-height: 0.95;
text-transform: lowercase;
\`\`\`

[... rest of the section unchanged — keep the scales table and "всичко lowercase" note]
```

Keep the surrounding content (скали table, lowercase note, and any other parts of the typography section) intact. Only the font name and rationale paragraph change.

### 4. `docs/01-business-brief.md` (if it mentions Readex Pro)

Search for "Readex Pro" and replace with "Onest". Likely nothing to change — most font references are in the design doc.

### 5. Check other docs

Search the repo for any remaining `Readex Pro` / `Readex_Pro` / `readexPro` references using `grep -r` and update as needed. Exception: the session notes and task reports in `docs/orchestrator/sessions/` and `docs/orchestrator/tasks/` — these are historical records of what happened and MUST NOT be changed (they document the pre-swap state).

## Design rules

- All UI text lowercase
- Black background, white text
- `<html lang="{locale}">` still set correctly (don't touch routing)

## Do NOT

- ❌ Touch `middleware.ts`, `i18n/`, `messages/`, or routing
- ❌ Rewrite the entire design-direction doc — only the typography section
- ❌ Change historical records in `docs/orchestrator/sessions/` or existing `docs/orchestrator/tasks/T00X.md` reports
- ❌ Add new dependencies beyond what `next/font/google` provides
- ❌ Remove `latin-ext` subset (useful for proper quotation marks and extended diacritics)
- ❌ Skip git hooks

## Git workflow

1. `git pull --rebase origin main` BEFORE starting
2. Make all edits
3. Run `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint` — all must pass
4. Manual check in dev: `/en` and `/bg` both render with Onest (inspect `.woff2` in Network tab)
5. Commit: `refactor(T018): swap readex pro → onest for cyrillic support`
6. `git pull --rebase origin main` again before push
7. `git push origin main`

## Acceptance criteria (all must pass)

- [ ] `pnpm build` succeeds
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `grep -rn "Readex" app/ components/ lib/` returns zero results
- [ ] `grep -rn "readexPro" app/ components/ lib/` returns zero results
- [ ] `app/globals.css` `--font-sans` uses `"Onest"` first
- [ ] `docs/03-design-direction.md` Typography section updated (font + rationale)
- [ ] Dev manual: `/bg` displays `ridewithalex` in Onest (not system sans)
- [ ] Commit pushed to `origin/main`

## Report back with

```markdown
## Report — T018

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X minutes

### What I did
(1-3 paragraphs)

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

### Report 1 — 2026-04-23 · agent 4 · ✅ completed

**Commit:** `b9faac6` — `refactor(T018): swap readex pro → onest for cyrillic support`
**Time:** ~7 min

#### Обобщение

`app/[locale]/layout.tsx`: `Readex_Pro` → `Onest` import, rename `readexPro` → `onest`, subsets `["latin", "latin-ext"]` → `["latin", "latin-ext", "cyrillic"]`, `className={onest.className}` на `<html>`. `app/globals.css`: `--font-sans` value обновено до `"Onest"`; `@utility` блоковете незасегнати. `docs/03-design-direction.md`: Typography секция пренаписана + `.hero-title` CSS в Hero спеца + wordmark bullet в logo секцията.

Grep sweep върху `app/`, `components/`, `lib/`: нула hits за `Readex\|readexPro\|Readex_Pro`.

Manual dev test: `/bg` върна HTTP 200 с `<html lang="bg" class="__className_1942c7">` (нов Onest hash; предишен Readex hash беше `e554b7`). 4 нови `.woff2` файла в `.next/static/media/` покриващи latin/latin-ext/cyrillic subsets.

#### Acceptance criteria — verified ✅

| Criterion | Evidence |
|---|---|
| `pnpm build` succeeds | `✓ Compiled successfully in 3.6s`, 5/5 static pages (`/en`, `/bg` + error/notfound) |
| `pnpm tsc --noEmit` passes | Exit 0, no output |
| `pnpm lint` passes | `✔ No ESLint warnings or errors` |
| `grep Readex` in app/components/lib | Zero hits (orchestrator re-verified) |
| `grep readexPro` | Zero hits |
| `--font-sans` е `"Onest"` | ✅ L4 на globals.css |
| design-direction.md typography section updated | ✅ (orchestrator inspected) |
| `/bg` с Onest (не system fallback) | ✅ new className hash + 4 нови .woff2 (cyrillic subset) |
| Pushed to main | `59aee54..b9faac6 main -> main` |

#### Deviations from spec — всички приети

Агентът направи **по-широк sweep** от explicit-спецификацията. Всички допълнителни промени са валидни:

1. **`README.md`** — имаше "Readex Pro · editorial" в таблицата-резюме. Корекция необходима (forward-looking документ, не historical record).
2. **`docs/06-content-checklist.md`** — "шрифтове: монохром + Readex Pro" в checklist-а. Корекция необходима.
3. **`assets/brand/logo-wordmark.svg`** — SVG-то имаше `font-family: 'Readex Pro'` в `<style>` тага. Ако не се обновеше, wordmark-ът би поискал Readex Pro шрифт при рендер. **Критично коректно е обновен.**
4. **`docs/orchestrator/PROMPT_TEMPLATE.md`** — 2 референции в template-а, който бъдещи агенти ще копират. Ако не се обновеше, новите промпти биха казвали "Font: Readex Pro" → агентите биха го инсталирали наново. **Критично коректно е обновен.**
5. **`docs/orchestrator/STATUS.md`** **НЕ** е пипнат — правилно (active kanban, orchestrator територия).
6. **`docs/orchestrator/sessions/` и `tasks/T00X.md` reports** **НЕ** са пипнати — правилно (historical records).
7. **`docs/03-design-direction.md` L30** задържа думата "Readex Pro" в рационалния параграф "Защо Onest, а не Readex Pro (първоначален избор)". **Правилно** — това е semantic explanation защо направихме swap-а, не brand directive.

Agent demonstrated **excellent judgement** в разграничението между forward-looking docs (update) и historical records (don't touch).

#### Blockers / questions

Няма. Dev сървърът избра port 3002 защото 3000/3001 са заети от други dev процеси — не влияе на теста.

#### Files changed (7)

- `app/[locale]/layout.tsx` — modified (Onest, cyrillic subset)
- `app/globals.css` — modified (--font-sans value)
- `docs/03-design-direction.md` — modified (Typography + hero-title + wordmark bullet)
- `docs/06-content-checklist.md` — modified (brand font line)
- `README.md` — modified (design-posoka row)
- `assets/brand/logo-wordmark.svg` — modified (SVG font-family)
- `docs/orchestrator/PROMPT_TEMPLATE.md` — modified (2 template refs)

#### Orchestrator verification

- `app/[locale]/layout.tsx` прочетен — Onest със subsets `["latin", "latin-ext", "cyrillic"]` ✅
- `app/globals.css` прочетен — `--font-sans: "Onest"` ✅
- 3 × grep в `app/`, `components/`, `lib/` — zero hits ✅
- Wider sweep files (README, checklist, SVG, PROMPT_TEMPLATE) потвърдени в system reminders

**Вердикт:** T018 приет без revision. **Q8 (шрифт) resolved: Onest.** T004 (Hero) е напълно unblocked.
