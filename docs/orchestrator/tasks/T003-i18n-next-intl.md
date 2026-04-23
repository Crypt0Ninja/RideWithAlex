# T003 · i18n setup (next-intl, BG + EN)

**Status:** 🟢 Ready
**Priority:** High (блокер за T004 hero и всички страници)
**Depends on:** T001 ✅
**Estimated effort:** ~30–50 минути за downstream агент
**Assigned:** pending

## Цел

Интеграция на `next-intl` за пълна BG + EN поддръжка: `[locale]` dynamic segment, middleware за locale detection, messages JSON файлове, locale switcher компонент. Default локал: **`en`** (международни туристи са основният пазар; /bg е равностоен).

URL structure:
- `/en` → английски
- `/bg` → български
- `/` → redirect към `/en` (или `/bg` според Accept-Language header)

## Scope на промените

**Добавя:**
- Dependency: `next-intl` (latest)
- `i18n/routing.ts` + `i18n/request.ts`
- `middleware.ts` в root
- `messages/en.json` + `messages/bg.json`
- `app/[locale]/layout.tsx` + `app/[locale]/page.tsx`
- `components/LocaleSwitcher.tsx`

**Модифицира:**
- `next.config.ts` — обвива с `createNextIntlPlugin`
- `app/layout.tsx` — опростява се до минимален pass-through (само `<html>`/`<body>` се местят в `[locale]/layout.tsx` за правилен `lang` атрибут)

**Изтрива:**
- `app/page.tsx` (съдържанието се мести в `app/[locale]/page.tsx`)

**НЕ пипа:** `components/ui/`, `lib/`, `app/globals.css` — това е територията на T002.

## Acceptance criteria

- [ ] `pnpm install` и `pnpm build` минават
- [ ] `pnpm tsc --noEmit` и `pnpm lint` минават
- [ ] `/` прави redirect към `/en` (или съвпадащия Accept-Language локал)
- [ ] `/en` показва `ridewithalex` (от `messages/en.json`)
- [ ] `/bg` показва `ridewithalex` (от `messages/bg.json` — същият текст, но от BG файла)
- [ ] `<html lang="en">` на `/en`, `<html lang="bg">` на `/bg`
- [ ] `components/LocaleSwitcher.tsx` рендерира BG / EN линкове, които запазват текущия path
- [ ] Всички текстове остават lowercase
- [ ] Readex Pro все още работи на двата локала
- [ ] Commit-нато и push-нато

## Agent prompt

```markdown
# T003 · i18n setup (next-intl) — RideWithAlex

You are working on **RideWithAlex** — a website for Alex, a snowboard instructor in Bansko, Bulgaria. This task is atomic and self-contained.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`. T001 (Next.js scaffold) is done. You're restructuring `app/` to support BG + EN locales using `next-intl`.

**IMPORTANT:** Run `git pull --rebase origin main` BEFORE you start and BEFORE you push — another agent may be working on T002 in parallel.

Before you start, read:
- `docs/03-design-direction.md` — lowercase everywhere
- `docs/02-sitemap.md` — URL structure for BG/EN
- `docs/orchestrator/tasks/T003-i18n-next-intl.md` — this task's full spec
- Current `app/layout.tsx`, `app/page.tsx`

## Your task

Install `next-intl` and restructure `app/` so `/en` and `/bg` both render the home page with their own translation. Add a `LocaleSwitcher` component. That's it.

## Supported locales

- `en` — default (international tourists primary)
- `bg` — Bulgarian

## File plan

### 1. Install dependency

```bash
pnpm add next-intl
```

### 2. `i18n/routing.ts` (new)

```ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "bg"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### 3. `i18n/request.ts` (new)

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 4. `middleware.ts` (new, at repo root)

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match everything except static assets, API routes, and _next internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

### 5. `next.config.ts` (modify)

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

### 6. `messages/en.json` (new)

```json
{
  "home": {
    "title": "ridewithalex",
    "tagline": "private snowboard lessons in bansko"
  },
  "nav": {
    "lessons": "lessons",
    "pricing": "pricing",
    "gallery": "gallery",
    "reviews": "reviews",
    "contact": "contact",
    "book": "book now"
  },
  "locale": {
    "en": "en",
    "bg": "bg"
  }
}
```

### 7. `messages/bg.json` (new)

```json
{
  "home": {
    "title": "ridewithalex",
    "tagline": "частни сноуборд уроци в банско"
  },
  "nav": {
    "lessons": "уроци",
    "pricing": "цени",
    "gallery": "галерия",
    "reviews": "отзиви",
    "contact": "контакти",
    "book": "резервирай"
  },
  "locale": {
    "en": "en",
    "bg": "bg"
  }
}
```

### 8. `app/layout.tsx` (modify — simplify to minimal passthrough)

Remove the `<html>` and `<body>` from here; they move to `[locale]/layout.tsx` so `lang` is correct per locale.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### 9. `app/[locale]/layout.tsx` (new)

```tsx
import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const readexPro = Readex_Pro({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ridewithalex",
  description: "private snowboard lessons in bansko",
  icons: { icon: "/favicon.svg" },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={readexPro.className}>
      <body className="bg-black text-white antialiased min-h-screen">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 10. `app/[locale]/page.tsx` (new)

```tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-medium tracking-tight lowercase">
        {t("title")}
      </h1>
    </main>
  );
}
```

### 11. `app/page.tsx` (DELETE)

Remove it. The root `/` is handled by middleware redirecting to `/en` or `/bg`.

### 12. `components/LocaleSwitcher.tsx` (new)

```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const current = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm lowercase">
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/30">/</span>}
          <Link
            href={pathname}
            locale={locale}
            className={
              locale === current
                ? "text-white"
                : "text-white/50 hover:text-white transition-colors"
            }
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
```

## Design rules (enforce strictly)

- **All UI text lowercase** — no exceptions, including in messages JSON
- Black background, white text only
- Readex Pro with `["latin", "cyrillic"]` subsets (BG needs Cyrillic)
- `lang` attribute must match the current locale

## Do NOT

- ❌ Modify files in `components/ui/`, `lib/`, or `app/globals.css` — that's T002's territory
- ❌ Add translations for pages that don't exist yet (lessons, pricing, etc.)
- ❌ Add route groups like `(marketing)` — keep it flat for now
- ❌ Configure SEO/sitemap — that's T016
- ❌ Use Server Actions or advanced next-intl features (just what's in the spec)

## Git workflow

1. `git pull --rebase origin main` BEFORE starting
2. Implement files above
3. Verify `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint` all pass
4. Manual verify: visit `/`, `/en`, `/bg` in dev mode, confirm redirects and content
5. Commit: `feat(T003): add next-intl i18n with en + bg locales`
6. `git pull --rebase origin main` again before push
7. `git push origin main`

If rebase conflicts: `git rebase --abort` and report.

## Acceptance criteria (all must pass)

- [ ] `pnpm install` adds `next-intl`
- [ ] `pnpm build` succeeds
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] Dev server: `/` redirects to `/en` (or `/bg` if Accept-Language is Bulgarian)
- [ ] Dev server: `/en` shows `ridewithalex`, `/bg` shows `ridewithalex` (same text from BG JSON file)
- [ ] `<html lang="en">` at `/en`, `<html lang="bg">` at `/bg`
- [ ] `LocaleSwitcher` component compiles (not yet rendered on page — that's T004's job)
- [ ] `app/page.tsx` is deleted (doesn't exist in repo)
- [ ] Files in `components/ui/`, `lib/`, `app/globals.css` NOT modified
- [ ] Commits pushed to `origin/main`

## Report back with

Respond with exactly this markdown block, filled in:

```markdown
## Report — T003

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
