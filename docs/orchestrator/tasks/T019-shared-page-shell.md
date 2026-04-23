# T019 · Shared page shell (SiteNav + SiteFooter + PageShell + PageHeader)

**Status:** 🟢 Ready
**Priority:** **High** (blocker за T006/T007/T008)
**Depends on:** T002 ✅, T003 ✅, T004 ✅, T018 ✅
**Estimated effort:** ~30–45 минути downstream
**Assigned:** downstream Claude Code агент (agent 6)

## Цел

Създаване на reusable layout компоненти за всички non-home страници (`/lessons`, `/pricing`, `/about`, и бъдещи). Целта е T006/T007/T008 да могат да бягат **паралелно** без да преоткриват navbar/footer/page-header и без да пипат еднакви файлове.

**Hero-то остава ненарушено.** `HeroNavbar.tsx` продължава да съществува за `/` home route. `SiteNav` е за другите страници — визуално идентичен floating pill design, но отделен компонент (защото hero nav е `absolute` над видео, а site nav е на черен фон).

## Scope на промените

**Нови файлове (4):**
- `components/shared/SiteNav.tsx` — floating pill navbar (reuse-ва `NavPill`, `Button`, `Logo`, `LocaleSwitcher`)
- `components/shared/SiteFooter.tsx` — 3-column черен footer + bottom bar
- `components/shared/PageShell.tsx` — wrapper `<div>SiteNav + <main>children</main> + SiteFooter</div>`
- `components/shared/PageHeader.tsx` — reusable hero-style title (eyebrow + lowercase title + subtitle)

**Модифицирани (2):**
- `messages/en.json` — добавя `footer.*` namespace
- `messages/bg.json` — same keys, BG преводи

**Не се пипа:**
- `components/hero/*` (нищо)
- `app/[locale]/page.tsx` (hero остава)
- `app/[locale]/layout.tsx` (passthrough)
- `i18n/*`, `middleware.ts`
- Nav keys (`nav.lessons`, `nav.pricing`, etc.) вече съществуват в messages от T004 — **използват се както са**

## Acceptance criteria

- [ ] `pnpm build` succeeds — brand new routes са 0, защото T019 само добавя компоненти без pages
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `/en` и `/bg` home все още рендерират hero-то **без визуални промени** (regression check — curl или dev browser)
- [ ] `SiteNav` e importable от `components/shared/SiteNav` и не чупи hero
- [ ] `SiteFooter` rend-ва 3 колони + bottom bar с contact info от business brief
- [ ] `PageShell` приема `children` и wrap-ва ги между nav + footer
- [ ] `PageHeader` приема `eyebrow`, `title`, `subtitle` props; title е lowercase, голям (`clamp(48px, 8vw, 120px)`), font-medium
- [ ] `footer.*` keys съществуват в двата messages файла
- [ ] Footer links сочат към `/lessons`, `/pricing`, `/gallery`, `/reviews`, `/contact` (използвай `Link` от `@/i18n/routing`)
- [ ] Instagram линк: `https://instagram.com/ridewithalex`
- [ ] Email mailto: `alex@ridewithalex.com`
- [ ] Phone tel: `+359 88 513 7471`
- [ ] Committed + pushed

---

## Agent prompt — copy/paste this to a fresh Claude Code session

```markdown
# T019 · Shared page shell — RideWithAlex

You are working on **RideWithAlex**, a monochrome editorial website for a snowboard instructor in Bansko. The hero section is already built and live on https://ridewithalex.vercel.app. Your job is to build **shared layout components** that all non-home pages (`/lessons`, `/pricing`, `/about`) will reuse. You will NOT touch the hero.

## Context (read these first)

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**IMPORTANT: `git pull --rebase origin main` BEFORE starting and BEFORE push.**

Read before you start:
- `docs/03-design-direction.md` — visual rules (monochrome, lowercase, Onest, floating pills, rounded-3xl cards)
- `docs/01-business-brief.md` — contact info, brand voice
- `docs/orchestrator/tasks/T019-shared-page-shell.md` — this task
- `components/hero/HeroNavbar.tsx` — reference implementation for pill navbar (you're building the non-hero variant)
- `components/ui/NavPill.tsx`, `Button.tsx`, `StatBlock.tsx` — T002 primitives (USE these)
- `components/brand/Logo.tsx` — T004 Logo component (USE this)
- `components/LocaleSwitcher.tsx` — T003 locale switcher (USE this)
- `i18n/routing.ts` — `Link` export from next-intl navigation (USE this for all internal links)
- `messages/en.json`, `messages/bg.json` — current state (you're adding `footer.*`)
- `app/[locale]/layout.tsx` — root layout (do NOT modify)
- `app/globals.css` — Tailwind v4 utilities (do NOT modify)

## Your task

Build 4 shared layout components in `components/shared/` + add `footer.*` messages. No new pages are built in this task — that's T006/T007/T008's job.

## Components to create

### 1. `components/shared/SiteNav.tsx`

Floating pill navbar for **non-hero pages**. Visually identical to `HeroNavbar` but:
- Positioned at top of a dark page (not over video) → use `bg-black/60 backdrop-blur` on the wrapper's padding area via the pills themselves (`NavPill` already has `bg-neutral-900/90 backdrop-blur`)
- **Not `absolute`** — it's part of the document flow as the first child of `<body>` via `PageShell`
- Same 3-pill layout: left (logo), center (nav links, hidden on mobile), right (locale + book CTA)

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NavPill } from "@/components/ui/NavPill";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function SiteNav() {
  const t = useTranslations("nav");
  const navLinks = [
    { href: "/lessons", key: "lessons" as const },
    { href: "/pricing", key: "pricing" as const },
    { href: "/gallery", key: "gallery" as const },
    { href: "/reviews", key: "reviews" as const },
    { href: "/contact", key: "contact" as const },
  ];

  return (
    <nav className="sticky top-0 z-30 px-6 md:px-10 pt-6 pb-4 flex items-center justify-between gap-4 bg-black/60 backdrop-blur-sm">
      {/* Left: logo pill — clickable home link */}
      <Link href="/" aria-label="ridewithalex home">
        <NavPill className="flex items-center gap-2 pl-4 pr-6 py-3 hover:bg-neutral-900 transition-colors">
          <Logo className="h-5 w-5 text-white" />
          <span className="text-white text-sm font-normal tracking-tight lowercase">
            ridewithalex
          </span>
        </NavPill>
      </Link>

      {/* Center: nav links (hidden on mobile) */}
      <NavPill
        as="div"
        className="hidden md:flex items-center gap-1 px-3 py-2"
      >
        {navLinks.map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full lowercase"
          >
            {t(key)}
          </Link>
        ))}
      </NavPill>

      {/* Right: locale switcher + book CTA */}
      <div className="flex items-center gap-3">
        <NavPill className="hidden sm:flex items-center px-4 py-2">
          <LocaleSwitcher />
        </NavPill>
        <Link href="/contact">
          <Button variant="primary" className="text-sm">
            {t("book")}
          </Button>
        </Link>
      </div>
    </nav>
  );
}
```

### 2. `components/shared/SiteFooter.tsx`

3-column footer + bottom bar. Black background, white/70 body text, white/40 divider.

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const navLinks = [
    { href: "/lessons" as const, key: "lessons" as const },
    { href: "/pricing" as const, key: "pricing" as const },
    { href: "/gallery" as const, key: "gallery" as const },
    { href: "/reviews" as const, key: "reviews" as const },
    { href: "/contact" as const, key: "contact" as const },
  ];

  return (
    <footer className="bg-black text-white border-t border-white/10 mt-24">
      <div className="px-6 md:px-10 py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Logo className="h-6 w-6 text-white" />
            <span className="text-white text-lg font-medium tracking-tight lowercase">
              ridewithalex
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed lowercase max-w-xs">
            {t("tagline")}
          </p>
        </div>

        {/* Nav column */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
            {t("explore")}
          </p>
          <ul className="space-y-2">
            {navLinks.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-white/70 hover:text-white transition-colors text-sm lowercase"
                >
                  {tn(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
            {t("contact")}
          </p>
          <ul className="space-y-2 text-sm lowercase">
            <li>
              <a
                href="mailto:alex@ridewithalex.com"
                className="text-white/70 hover:text-white transition-colors"
              >
                alex@ridewithalex.com
              </a>
            </li>
            <li>
              <a
                href="tel:+359885137471"
                className="text-white/70 hover:text-white transition-colors"
              >
                +359 88 513 7471
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/ridewithalex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                @ridewithalex
              </a>
            </li>
            <li className="text-white/50 not-italic">
              {t("meetingPoint")}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50 lowercase">
        <p>© 2026 ridewithalex · {t("rights")}</p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-white transition-colors">
            {t("terms")}
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

**Note on `/terms` and `/privacy`:** these routes don't exist yet. The `Link` will resolve at click-time — next-intl will render a plain anchor until the route exists. That's acceptable for now. Do NOT create those pages.

### 3. `components/shared/PageShell.tsx`

Wrapper for all non-home pages. Server component.

```tsx
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
```

### 4. `components/shared/PageHeader.tsx`

Reusable big-title block for the top of each non-home page. Props-driven.

```tsx
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, subtitle, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "px-6 md:px-10 pt-16 md:pt-24 pb-12 md:pb-20 max-w-6xl",
        className
      )}
    >
      <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] mb-6">
        {eyebrow}
      </p>
      <h1 className="hero-title text-white font-medium text-[clamp(48px,8vw,120px)]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-8 text-white/70 text-base md:text-lg leading-relaxed lowercase max-w-2xl">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
```

**Note:** `eyebrow` stays uppercase (tracked letters — it's a label, not body copy). Everything else lowercase.

## Files to modify

### `messages/en.json`

Add `footer` namespace (append, don't remove anything):

```json
{
  "home": { ... keep as is ... },
  "nav": { ... keep as is ... },
  "stats": { ... keep as is ... },
  "locale": { ... keep as is ... },
  "footer": {
    "tagline": "private snowboard lessons in bansko. your pace, your mountain, your progress.",
    "explore": "explore",
    "contact": "contact",
    "meetingPoint": "meeting point: пред гондолата, ул. пирин 1, банско",
    "rights": "all rights reserved.",
    "terms": "terms",
    "privacy": "privacy"
  }
}
```

### `messages/bg.json`

```json
{
  "home": { ... keep as is ... },
  "nav": { ... keep as is ... },
  "stats": { ... keep as is ... },
  "locale": { ... keep as is ... },
  "footer": {
    "tagline": "частни сноуборд уроци в банско. твоето темпо, твоята планина, твоят прогрес.",
    "explore": "разгледай",
    "contact": "контакти",
    "meetingPoint": "среща: пред гондолата, ул. пирин 1, банско",
    "rights": "всички права запазени.",
    "terms": "условия",
    "privacy": "поверителност"
  }
}
```

**Important:** keep the existing `home`, `nav`, `stats`, `locale` keys EXACTLY as they are. Only ADD the `footer` key. Any whitespace/formatting changes to the existing keys will cause merge conflicts in parallel waves.

## Design rules (enforce strictly)

- Black background (`bg-black`)
- Text: `text-white`, `text-white/90`, `text-white/70`, `text-white/50`, `text-white/40`
- All UI copy **lowercase** — no exceptions except `eyebrow` labels (which use `tracked uppercase` styling)
- Font: Onest (loaded globally via `layout.tsx`)
- No color accents (no orange, blue, green)
- `rounded-full` for pills & buttons, `rounded-3xl` for cards (not used in this task, but keep convention in mind)
- Tailwind CSS v4 syntax only (no `tailwind.config.js`)
- TypeScript strict mode
- `Link` import MUST come from `@/i18n/routing` (NOT `next/link`) for all internal navigation
- External links (Instagram, mailto, tel): plain `<a>` with `target`/`rel` as appropriate

## Do NOT

- ❌ Touch any file in `components/hero/*`
- ❌ Touch `app/[locale]/page.tsx` — home route stays pure hero
- ❌ Touch `app/[locale]/layout.tsx`, `i18n/routing.ts`, `middleware.ts`, `i18n/request.ts`
- ❌ Touch `app/globals.css` — no new utilities needed
- ❌ Create any pages (no `/lessons/page.tsx`, no `/terms/page.tsx`, etc.)
- ❌ Add new dependencies
- ❌ Modify existing `home`, `nav`, `stats`, `locale` keys in `messages/*.json` — only ADD `footer`
- ❌ Skip git hooks (no `--no-verify`)
- ❌ Self-host any video/images
- ❌ Make `SiteNav` or `SiteFooter` a client component — they're server components (no hooks, no event handlers beyond `<a>`/`<Link>`)

## Git workflow

1. `git pull --rebase origin main` BEFORE starting
2. Implement all 4 components + messages update
3. Run full check: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: `pnpm dev`, curl `/en` and `/bg` — hero must still render **identically** (no layout shift, no visual change on home)
5. Commit: `feat(T019): shared site nav, footer, page shell, page header`
6. `git pull --rebase origin main` again before push
7. `git push origin main`

## Acceptance criteria (all must pass)

- [ ] `pnpm build` succeeds (route count unchanged — only `/`, `/en`, `/bg`, `/en/...`, `/bg/...` from existing)
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `/en` and `/bg` home render the hero **with zero visual changes** (verify via curl — response body unchanged apart from possibly reorganized imports)
- [ ] 4 new files exist: `SiteNav.tsx`, `SiteFooter.tsx`, `PageShell.tsx`, `PageHeader.tsx` under `components/shared/`
- [ ] `messages/en.json` and `messages/bg.json` have `footer` namespace with all 7 keys
- [ ] `messages/*.json` existing keys (`home`, `nav`, `stats`, `locale`) are byte-identical to pre-change except for the comma separating `locale` from new `footer` block
- [ ] All imports use `@/...` path aliases (no relative `../../`)
- [ ] `Link` imports come from `@/i18n/routing`, NOT `next/link`
- [ ] Committed + pushed to `origin/main`

## Report back with exactly this block

```markdown
## Report — T019

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X minutes

### What I did
(1-3 paragraphs, ≤ 200 words)

### Acceptance criteria
- [x] pnpm build — evidence: `✓ Compiled in Xs, N routes`
- [x] pnpm tsc --noEmit — evidence: exit 0
- [x] pnpm lint — evidence: `✔ No warnings or errors`
- [x] Home hero unchanged — evidence: curl diff or visual
- [x] 4 new components — evidence: file list
- [x] footer namespace in both locales — evidence: jq output
- [x] No changes to existing message keys — evidence: git diff
- [x] Pushed — evidence: commit SHA on origin/main

### Deviations from spec
(If any — why, and what was different)

### Blockers / questions
(If any — what would unblock you)

### Files changed
- components/shared/SiteNav.tsx — created
- components/shared/SiteFooter.tsx — created
- components/shared/PageShell.tsx — created
- components/shared/PageHeader.tsx — created
- messages/en.json — modified (added footer namespace)
- messages/bg.json — modified (added footer namespace)
```
```

---

## Reports

### Report 1 — 2026-04-23 · agent 6 · ✅ completed

**Commit:** `1763786` — `feat(T019): shared site nav, footer, page shell, page header`
**Time:** ~15 минути

#### Обобщение

4 server компонента под `components/shared/`: `SiteNav` (sticky `z-30` pill navbar с `bg-black/60 backdrop-blur-sm` и clickable logo към `/`), `SiteFooter` (3-колонен grid + bottom bar с © + terms/privacy), `PageShell` (flex-column wrapper над `bg-black min-h-screen`), `PageHeader` (eyebrow/title/subtitle с `hero-title` класа и `clamp(48px,8vw,120px)` размер). `footer` namespace добавен в двата messages файла с 7 keys; съществуващите keys (`home`/`nav`/`stats`/`locale`) байтово непипнати.

#### Acceptance criteria — verified ✅

| Criterion | Evidence |
|---|---|
| `pnpm build` | `✓ Compiled successfully in 3.3s`, 5 static pages, route count непроменен |
| `pnpm tsc --noEmit` | Exit 0 |
| `pnpm lint` | `✔ No ESLint warnings or errors` |
| Home hero unchanged | `/en` + `/bg` 200; hero markers в DOM; няма `SiteNav`/`SiteFooter` в rendered markup (footer tagline се появява само в client JSON payload — очаквано при `NextIntlClientProvider` без scoped messages) |
| 4 нови компонента | `components/shared/{SiteNav,SiteFooter,PageShell,PageHeader}.tsx` — всички server components |
| `footer` namespace в двата locale-а | 7 keys всеки (tagline, explore, contact, meetingPoint, rights, terms, privacy) |
| Existing keys unchanged | `git diff` показва само additive hunks — 9 insertions на файл, всички вътре в новия `footer` блок |
| Pushed | `1047d59..1763786 main -> main` |

#### Deviations from spec

**Нула.** Имплементацията е байтово съвпадение със спеца.

#### Orchestrator verification

- `SiteNav.tsx:1-56` — всички import-и от правилните path aliases (`@/i18n/routing`, `@/components/ui/*`, `@/components/brand/Logo`, `@/components/LocaleSwitcher`) ✅
- `SiteFooter.tsx:1-100` — 3 колони (brand / explore / contact) + bottom bar; контакти точно (`alex@ridewithalex.com`, `+359 88 513 7471`, `@ridewithalex`) ✅
- `PageShell.tsx:1-17` — 17 реда flex-column wrapper, точно според спеца ✅
- `PageHeader.tsx:1-32` — eyebrow е `uppercase tracking-[0.3em]` (правилно), title `hero-title` клас, subtitle optional ✅
- `messages/en.json` + `bg.json` — JSON-ите валидни, `footer` блок в края, existing keys непипнати ✅
- Hero files не са засегнати — `git show --stat 1763786` показва само 6 файла, нито един под `components/hero/*` ✅

**Вердикт:** T019 приет без revision. Shared primitives са готови — T006/T007/T008 могат да бягат паралелно отгоре им.
