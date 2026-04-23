# T013 · `/gallery` страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Страниците `/lessons`, `/pricing`, `/about`, `/contact` са вече готови. Shared layout (PageShell, PageHeader) е готов. Твоята задача е да построиш **страницата `/gallery`** с **placeholder съдържание** — Alex все още няма реални снимки, така че правим визуално завършена страница с placeholder карти които той по-късно ще замени.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ започване И отново ПРЕДИ push. Преди финалното `git push` направи `git diff --cached` и провери че stage-нал си точно каквото спеца казва.

Прочети преди работа:
- `docs/03-design-direction.md` §`Галерия` — визуални правила за галерия
- `docs/02-sitemap.md` §`🖼️ Галерия` — какво съдържание влиза
- `components/shared/PageShell.tsx`, `PageHeader.tsx` — задължителни primitives
- `i18n/routing.ts` — `Link` от `@/i18n/routing`
- `messages/en.json`, `messages/bg.json` — добавяш САМО `gallery.*` namespace

## Your task

Placeholder галерия:
1. PageHeader (eyebrow, title, subtitle с disclaimer "placeholder — snimki idvat")
2. Filter bar (4 pills): all / lessons / kids / bansko — **визуален placeholder**, clickable но без реална filter логика в тази задача
3. Grid от 12 placeholder плочки с различни aspect ratios за editorial mason feel
4. Upload hint секция за Alex ("send me your best photos")
5. CTA към `/lessons` и `/contact`

## Файлове за създаване (4)

### 1. `app/[locale]/gallery/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryUploadHint } from "@/components/gallery/GalleryUploadHint";
import { GalleryCta } from "@/components/gallery/GalleryCta";

export default function GalleryPage() {
  const t = useTranslations("gallery");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <GalleryGrid />
      <GalleryUploadHint />
      <GalleryCta />
    </PageShell>
  );
}
```

### 2. `components/gallery/GalleryGrid.tsx` (CLIENT component — filter state)

Client component заради filter state (въпреки че filtering не е активно — нулевата логика е интерактивна).

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";

const filters = ["all", "lessons", "kids", "bansko"] as const;
type FilterKey = (typeof filters)[number];

type Tile = {
  id: number;
  category: Exclude<FilterKey, "all">;
  aspect: string; // Tailwind aspect class
};

const tiles: Tile[] = [
  { id: 1, category: "lessons", aspect: "aspect-[4/5]" },
  { id: 2, category: "bansko", aspect: "aspect-[3/2]" },
  { id: 3, category: "lessons", aspect: "aspect-square" },
  { id: 4, category: "kids", aspect: "aspect-[4/5]" },
  { id: 5, category: "bansko", aspect: "aspect-[4/3]" },
  { id: 6, category: "lessons", aspect: "aspect-[3/4]" },
  { id: 7, category: "kids", aspect: "aspect-square" },
  { id: 8, category: "bansko", aspect: "aspect-[5/4]" },
  { id: 9, category: "lessons", aspect: "aspect-[2/3]" },
  { id: 10, category: "kids", aspect: "aspect-[4/3]" },
  { id: 11, category: "bansko", aspect: "aspect-[3/2]" },
  { id: 12, category: "lessons", aspect: "aspect-[4/5]" },
];

export function GalleryGrid() {
  const t = useTranslations("gallery");
  const [active, setActive] = useState<FilterKey>("all");

  const visible = active === "all" ? tiles : tiles.filter((tile) => tile.category === active);

  return (
    <section className="px-6 md:px-10 pb-16 md:pb-24 max-w-6xl">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={cn(
              "px-5 py-2 rounded-full text-sm lowercase transition-colors border",
              active === key
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/70 border-white/20 hover:border-white/40 hover:text-white"
            )}
          >
            {t(`filters.${key}`)}
          </button>
        ))}
      </div>

      {/* Mason grid */}
      <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4">
        {visible.map((tile) => (
          <div
            key={tile.id}
            className={cn(
              "relative w-full break-inside-avoid rounded-3xl overflow-hidden bg-neutral-900 border border-white/5",
              tile.aspect
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">
                  {t(`filters.${tile.category}`)}
                </p>
                <p className="text-white/30 text-xs lowercase mt-2">
                  {t("tilePlaceholder")}
                </p>
              </div>
            </div>
            <span
              aria-hidden
              className="absolute top-4 right-4 diagonal-divider-right"
            />
          </div>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-white/40 text-sm lowercase text-center py-12">
          {t("emptyState")}
        </p>
      ) : null}
    </section>
  );
}
```

### 3. `components/gallery/GalleryUploadHint.tsx` (server component)

Секция която обяснява на посетителите (и напомня на Alex) че галерията ще се enrich-не.

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function GalleryUploadHint() {
  const t = useTranslations("gallery.hint");

  return (
    <section className="px-6 md:px-10 py-16 md:py-24 border-t border-white/10 max-w-4xl">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="text-white text-2xl md:text-3xl font-medium lowercase tracking-tight mb-6">
        {t("title")}
      </h2>
      <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase max-w-2xl mb-8">
        {t("body")}
      </p>
      <Link href="/contact">
        <Button variant="secondary">{t("cta")}</Button>
      </Link>
    </section>
  );
}
```

### 4. `components/gallery/GalleryCta.tsx` (server component)

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function GalleryCta() {
  const t = useTranslations("gallery.cta");

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/10 max-w-6xl">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)]">
            {t("title")}
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase mt-6">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/lessons">
            <Button variant="secondary">{t("lessons")}</Button>
          </Link>
          <Link href="/contact">
            <Button variant="primary">{t("book")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

## Файлове за модифициране (2)

### `messages/en.json` — ДОБАВЯШ САМО `gallery` namespace

```json
"gallery": {
  "eyebrow": "gallery",
  "title": "on the mountain.",
  "subtitle": "placeholder tiles for now — real photos from lessons, kids, and bansko landscapes are on the way.",
  "filters": {
    "all": "all",
    "lessons": "lessons",
    "kids": "kids",
    "bansko": "bansko"
  },
  "tilePlaceholder": "photo coming soon",
  "emptyState": "no photos in this category yet.",
  "hint": {
    "eyebrow": "for alex",
    "title": "upload real photos here.",
    "body": "send me 15–20 high-resolution action shots from recent lessons and a few landscape frames of bansko. i'll wire them into the grid. tagged by category: lessons, kids, bansko.",
    "cta": "message alex"
  },
  "cta": {
    "eyebrow": "like what you see?",
    "title": "ride with me next.",
    "subtitle": "pick a package, pick a date — see you on the mountain.",
    "lessons": "see lessons",
    "book": "get in touch"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `gallery` namespace

```json
"gallery": {
  "eyebrow": "галерия",
  "title": "на планината.",
  "subtitle": "засега placeholder плочки — реални снимки от уроци, деца и пейзажи от банско идват.",
  "filters": {
    "all": "всички",
    "lessons": "уроци",
    "kids": "деца",
    "bansko": "банско"
  },
  "tilePlaceholder": "снимка идва скоро",
  "emptyState": "все още няма снимки в тази категория.",
  "hint": {
    "eyebrow": "за alex",
    "title": "качи реални снимки тук.",
    "body": "изпрати 15–20 action снимки от последни уроци и няколко пейзажа от банско. ще ги вградя в мрежата, разделени по категории: уроци, деца, банско.",
    "cta": "пиши на alex"
  },
  "cta": {
    "eyebrow": "харесва ли ти?",
    "title": "следващият път карай с мен.",
    "subtitle": "избери пакет, избери дата — ще се видим на планината.",
    "lessons": "виж уроците",
    "book": "свържи се"
  }
}
```

## Дизайн правила

- Фон `bg-black`, placeholder плочки `bg-neutral-900 rounded-3xl border border-white/5`
- **Mason grid:** Tailwind `columns-2 md:columns-3 gap-4 [&>*]:mb-4` + `break-inside-avoid` на всяка плочка — native CSS columns за true mason без library
- Aspect ratios: mix от `aspect-square`, `aspect-[3/2]`, `aspect-[4/5]`, `aspect-[2/3]`, `aspect-[4/3]` за editorial ритъм
- Filter pills: active = `bg-white text-black`; inactive = `bg-transparent text-white/70 border-white/20`
- Всяка placeholder плочка има диагонален accent (`diagonal-divider-right` utility от T002)
- Всичко lowercase освен eyebrow-ите
- GalleryGrid е **client component** (filter state); останалото server
- Tailwind v4, TypeScript strict
- Всички вътрешни линкове през `@/i18n/routing`
- Без нови dependencies (no lightbox library — lightbox ще добавим когато има реални снимки)

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`
- ❌ Пипаш други pages
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Използваш real photos / stock images / CDN URLs — placeholder only
- ❌ Install lightbox / image-gallery library — placeholder няма реални снимки
- ❌ Добавяш nov message namespace освен `gallery`
- ❌ Модифицираш съществуващите namespace-и
- ❌ Install нови dependencies
- ❌ Skip git hooks (`--no-verify`)
- ❌ Забравиш `git diff --cached` преди `git push`

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 4-те нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: `pnpm dev`, curl `/en/gallery` и `/bg/gallery`
5. **`git add` точно 6-те файла; после `git diff --cached`** — потвърди 6 файла, не повече
6. Commit: `feat(T013): gallery page with placeholder mason grid and filter bar`
7. `git pull --rebase origin main`
8. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/gallery`, `/bg/gallery`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/gallery` и `/bg/gallery` рендерират PageHeader + filter bar + 12 placeholder плочки + upload hint + CTA
- [ ] Filter bar е интерактивен (клик променя active state, `"use client"` директива присъства в GalleryGrid)
- [ ] Placeholder плочките използват `bg-neutral-900` + `break-inside-avoid` + mixed aspect ratios
- [ ] Съществуващите messages keys са байтово непипнати (`git diff --cached messages/*.json` — само добавка `gallery`)
- [ ] Committed + pushed с точно 6 променени файла (verify чрез `git diff --cached --stat`)

## Report формат

```markdown
## Report — T013

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X минути

### Какво направих
(1-3 параграфа, ≤ 200 думи)

### Acceptance criteria
- [x] pnpm build — evidence
- [x] pnpm tsc --noEmit — exit 0
- [x] pnpm lint — без warnings
- [x] Routes рендерират — evidence
- [x] Filter bar интерактивен — evidence: `"use client"` + useState
- [x] Mason grid с различни aspect ratios — evidence
- [x] Existing keys unchanged — evidence: git diff --cached summary (6 файла)
- [x] Pushed — evidence: commit SHA

### Отклонения от спеца
(ако има)

### Променени файлове
- app/[locale]/gallery/page.tsx — създаден
- components/gallery/GalleryGrid.tsx — създаден (client component)
- components/gallery/GalleryUploadHint.tsx — създаден
- components/gallery/GalleryCta.tsx — създаден
- messages/en.json — модифициран (добавен gallery namespace)
- messages/bg.json — модифициран (добавен gallery namespace)
```

---

## Reports

_(downstream агентът попълва след завършване)_
