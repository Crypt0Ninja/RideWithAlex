# T004 · Hero секция

**Status:** 🟢 Ready
**Priority:** **Critical** (централна страница, първо впечатление)
**Depends on:** T001 ✅, T002 ✅, T003 ✅, T018 ✅
**Estimated effort:** ~60–90 минути за downstream агент
**Assigned:** pending

## Цел

Пълна имплементация на hero секцията по спец `docs/03-design-direction.md § Hero секция — спец`. Fullscreen видео фон, floating pill navbar (3 pills), 3 гигантски staggered lowercase думи (`ride`/`with`/`alex`), малък описателен параграф, 3 stat блока (+8 / +500 / +12), черен gradient към долу. Stagger анимация при зареждане. Responsive — mobile крие центърния nav pill и scale-ва текста.

## Scope на промените

**Нови файлове:**
- `components/brand/Logo.tsx` — inline SVG, Peak варианта, currentColor
- `components/hero/Hero.tsx` — top-level section wrapper
- `components/hero/HeroVideo.tsx` — background video + overlays
- `components/hero/HeroNavbar.tsx` — floating pill navbar
- `components/hero/HeroStaggeredText.tsx` — 3 animated думи
- `components/hero/HeroDescription.tsx` — описателен параграф
- `components/hero/HeroStats.tsx` — 3 StatBlock-a позиционирани

**Модифицирани:**
- `app/[locale]/page.tsx` — рендерира `<Hero />` вместо просто h1
- `app/globals.css` — `@keyframes hero-word-in` и utility за stagger
- `messages/en.json` — добавя `home.tagline`, `stats.*`
- `messages/bg.json` — same keys, BG преводи

## Acceptance criteria

- [ ] `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint` — всички минават
- [ ] `/en` и `/bg` показват пълния hero
- [ ] Видео се lazy-loop-ва (autoplay, muted, loop, playsInline)
- [ ] 3 думи `ride` / `with` / `alex` позиционирани според спеца, stagger-нати при зареждане
- [ ] Navbar pill-ове правилно разпределени (left: logo, center: nav, right: locale + CTA)
- [ ] Center nav pill е скрит на мобилен (`hidden md:flex`)
- [ ] 3 stat блока позиционирани (top-right, bottom-left, bottom-right) с диагонални divider-и
- [ ] `/bg` показва преводените stat labels (напр. `години опит`) и BG tagline
- [ ] Текстът остава читаем над видеото (overlay работи)
- [ ] `prefers-reduced-motion` спира stagger анимацията

## Agent prompt

```markdown
# T004 · Hero секция — RideWithAlex

You are working on **RideWithAlex**. This is the biggest UI task so far — you're building the full hero section that opens the site. Get the minimalist editorial feel right and the rest of the site falls in line.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**IMPORTANT:** `git pull --rebase origin main` BEFORE start AND before push.

Before starting, read:
- `docs/03-design-direction.md` — **entire file**, especially § Hero секция, § Navbar, § Типография
- `docs/orchestrator/tasks/T004-hero-section.md` — this task
- `app/[locale]/layout.tsx` — current root layout (Onest loaded)
- `app/[locale]/page.tsx` — current placeholder (will replace)
- `app/globals.css` — current `@theme` + `@utility` blocks
- `components/ui/Button.tsx`, `NavPill.tsx`, `StatBlock.tsx` — primitives from T002 (USE THESE)
- `components/LocaleSwitcher.tsx` — from T003 (USE THIS)
- `messages/en.json`, `messages/bg.json` — add to these
- `assets/brand/logo-icon-peak.svg` — SOURCE for the inline Logo component

## Your task

Build the complete hero section per the design-direction spec. Break it into composed components in `components/hero/`. Use primitives from T002 where applicable.

## Components to create

### 1. `components/brand/Logo.tsx`

Inline SVG of the Peak variant, `currentColor`, accepts `className`:

```tsx
type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="ridewithalex"
    >
      <path d="M5 27 L16 5 L27 27" />
      <path d="M10 19 L22 19" />
    </svg>
  );
}
```

### 2. `components/hero/HeroVideo.tsx`

```tsx
export function HeroVideo() {
  return (
    <>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/favicon.svg"
        aria-hidden
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
          type="video/mp4"
        />
      </video>
      {/* легко затъмнение за четимост */}
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      {/* gradient към дъното за долните stats */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black"
        aria-hidden
      />
    </>
  );
}
```

### 3. `components/hero/HeroNavbar.tsx`

Three pills: logo pill, center nav pill (hidden on mobile), right cluster (locale switcher + book CTA). Uses `NavPill` primitive from T002.

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NavPill } from "@/components/ui/NavPill";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function HeroNavbar() {
  const t = useTranslations("nav");
  const navLinks = [
    { href: "/lessons", key: "lessons" as const },
    { href: "/pricing", key: "pricing" as const },
    { href: "/gallery", key: "gallery" as const },
    { href: "/reviews", key: "reviews" as const },
    { href: "/contact", key: "contact" as const },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 md:px-10 pt-6 flex items-center justify-between gap-4">
      {/* Left: logo pill */}
      <NavPill className="flex items-center gap-2 pl-4 pr-6 py-3">
        <Logo className="h-5 w-5 text-white" />
        <span className="text-white text-sm font-normal tracking-tight lowercase">
          ridewithalex
        </span>
      </NavPill>

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
        <Button variant="primary" className="text-sm">
          {t("book")}
        </Button>
      </div>
    </nav>
  );
}
```

### 4. `components/hero/HeroStaggeredText.tsx`

Three giant lowercase words, absolute positioned. Stagger animation via inline `animationDelay`.

```tsx
import { cn } from "@/lib/cn";

const words = [
  { text: "ride", className: "left-4 md:left-10 top-[18%]", delay: 0 },
  { text: "with", className: "right-4 md:right-10 top-[38%]", delay: 120 },
  { text: "alex", className: "left-[18%] md:left-[28%] top-[58%]", delay: 240 },
];

export function HeroStaggeredText() {
  return (
    <>
      {words.map(({ text, className, delay }) => (
        <h1
          key={text}
          className={cn(
            "hero-title absolute text-white font-medium text-[18vw] md:text-[13vw] leading-none",
            "opacity-0 translate-y-3 motion-safe:animate-[hero-word-in_600ms_ease-out_forwards]",
            "motion-reduce:opacity-100 motion-reduce:translate-y-0",
            className
          )}
          style={{ animationDelay: `${delay}ms` }}
        >
          {text}
        </h1>
      ))}
    </>
  );
}
```

### 5. `components/hero/HeroDescription.tsx`

```tsx
import { useTranslations } from "next-intl";

export function HeroDescription() {
  const t = useTranslations("home");
  return (
    <p className="absolute left-6 md:left-10 top-[46%] max-w-[260px] text-[15px] leading-snug text-white/90 lowercase hidden md:block">
      {t("tagline")}
    </p>
  );
}
```

### 6. `components/hero/HeroStats.tsx`

Uses `StatBlock` from T002. Three stats positioned absolute. Translations come from `stats.*` namespace.

```tsx
import { useTranslations } from "next-intl";
import { StatBlock } from "@/components/ui/StatBlock";

export function HeroStats() {
  const t = useTranslations("stats");
  return (
    <>
      {/* top-right */}
      <div className="absolute right-6 md:right-24 top-[14%]">
        <StatBlock
          value="+8"
          label={t("years.label")}
          align="right"
          dividerDirection="up"
        />
      </div>

      {/* bottom-left */}
      <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
        <StatBlock
          value="+500"
          label={t("riders.label")}
          align="left"
          dividerDirection="down"
        />
      </div>

      {/* bottom-right */}
      <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
        <StatBlock
          value="+12"
          label={t("countries.label")}
          align="right"
          dividerDirection="down"
        />
      </div>
    </>
  );
}
```

### 7. `components/hero/Hero.tsx`

Top-level wrapper composing all pieces.

```tsx
import { HeroVideo } from "./HeroVideo";
import { HeroNavbar } from "./HeroNavbar";
import { HeroStaggeredText } from "./HeroStaggeredText";
import { HeroDescription } from "./HeroDescription";
import { HeroStats } from "./HeroStats";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <HeroVideo />
      <HeroNavbar />
      <div className="relative h-full w-full">
        <HeroStaggeredText />
        <HeroDescription />
        <HeroStats />
      </div>
    </section>
  );
}
```

## Files to modify

### `app/[locale]/page.tsx`

Replace the current placeholder with:

```tsx
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return <Hero />;
}
```

### `app/globals.css`

Add to end of file (after existing `@utility` blocks):

```css
@keyframes hero-word-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### `messages/en.json`

Update to:

```json
{
  "home": {
    "title": "ridewithalex",
    "tagline": "private snowboard lessons in bansko. your pace, your mountain, your progress."
  },
  "nav": {
    "lessons": "lessons",
    "pricing": "pricing",
    "gallery": "gallery",
    "reviews": "reviews",
    "contact": "contact",
    "book": "book now"
  },
  "stats": {
    "years": { "value": "+8", "label": "years teaching" },
    "riders": { "value": "+500", "label": "riders taught" },
    "countries": { "value": "+12", "label": "countries served" }
  },
  "locale": {
    "en": "en",
    "bg": "bg"
  }
}
```

### `messages/bg.json`

```json
{
  "home": {
    "title": "ridewithalex",
    "tagline": "частни сноуборд уроци в банско. твоето темпо, твоята планина, твоят прогрес."
  },
  "nav": {
    "lessons": "уроци",
    "pricing": "цени",
    "gallery": "галерия",
    "reviews": "отзиви",
    "contact": "контакти",
    "book": "резервирай"
  },
  "stats": {
    "years": { "value": "+8", "label": "години опит" },
    "riders": { "value": "+500", "label": "ученика" },
    "countries": { "value": "+12", "label": "държави" }
  },
  "locale": {
    "en": "en",
    "bg": "bg"
  }
}
```

Забележка: hero-то използва **hard-coded** `ride`, `with`, `alex` (не от messages) — това е brand typography, не UI text. Същото за stat values (`+8`, `+500`, `+12`).

## Design rules (enforce strictly)

- Black background, white text, white opacity variants only
- All UI text lowercase
- Onest font (вече loaded globally)
- No new dependencies — all animations via CSS `@keyframes` и inline `style`, no Framer Motion
- Responsive: mobile крие centrer nav pill и locale pill; hero words scale с vw units (18vw mobile, 13vw desktop)
- `motion-reduce` спира stagger анимацията (използвай Tailwind `motion-safe:` и `motion-reduce:` variants)
- Video е hidden от screen readers (`aria-hidden`)
- Pause/mute контрол не е нужен в този спец (video е silent и короткосрочен loop)

## Do NOT

- ❌ Self-host видеото (използвай CloudFront URL директно)
- ❌ Добавяй Framer Motion, GSAP, или други animation libraries
- ❌ Създавай Storybook / tests в тази задача
- ❌ Добавяй footer, other pages, other sections — само hero-то
- ❌ Пипай `components/ui/*` — те са от T002 и работят
- ❌ Пипай `i18n/`, `middleware.ts` — от T003
- ❌ Променяй `app/layout.tsx` (passthrough, остава)
- ❌ Skip git hooks

## Git workflow

1. `git pull --rebase origin main` BEFORE starting
2. Implement всички компоненти + модификации
3. Run full check: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Manual dev проверка: `/en` и `/bg` — видео върви, текст staggers, stat labels правилно преведени
5. Проверка на responsive: resize до mobile width — center nav pill изчезва, hero words scale
6. Commit: `feat(T004): hero section with video, staggered text, navbar, stats`
7. `git pull --rebase origin main` again преди push
8. `git push origin main`

## Acceptance criteria (all must pass)

- [ ] `pnpm build` succeeds (5 static pages, unchanged count)
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `/en` renders full hero — видео, navbar, 3 думи, tagline, 3 stats
- [ ] `/bg` same, с BG преводени tagline + stat labels (hero думите остават английски)
- [ ] Hero думите fade+slide при зареждане (stagger 0/120/240ms)
- [ ] Center nav pill е `hidden md:flex` (не се вижда под 768px)
- [ ] Video autoplay-ва, loop-ва, muted, playsInline
- [ ] `<html lang={locale}>` остава правилно за двата локала
- [ ] Видими в Network tab: 1× `.mp4` от CloudFront, 4× `.woff2` (Onest, 3 subsets)
- [ ] Committed + pushed

## Report back with

```markdown
## Report — T004

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

_(празно — чака downstream агента)_
