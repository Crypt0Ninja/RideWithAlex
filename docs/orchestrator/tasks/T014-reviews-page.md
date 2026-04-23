# T014 · `/reviews` страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Другите страници (`/lessons`, `/pricing`, `/about`, `/contact`, `/gallery`) вече са готови. Shared layout (PageShell, PageHeader) е готов. Твоята задача е да построиш **страницата `/reviews`** с **placeholder отзиви** — Alex ще замени реалните отзиви по-късно.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ започване И отново ПРЕДИ push. Преди `git push` направи `git diff --cached`.

Прочети преди работа:
- `docs/03-design-direction.md` — визуални правила
- `docs/02-sitemap.md` §`⭐ Отзиви` — какво съдържание влиза
- `docs/01-business-brief.md` — USP и tone of voice (отзивите отразяват USP-то)
- `components/shared/PageShell.tsx`, `PageHeader.tsx` — задължителни primitives
- `i18n/routing.ts` — `Link` от `@/i18n/routing`
- `messages/en.json`, `messages/bg.json` — добавяш САМО `reviews.*` namespace

## Your task

Placeholder reviews страница:
1. PageHeader (eyebrow, title, subtitle с disclaimer че това са placeholder)
2. ReviewsGrid — 6 placeholder review cards с quote / name / country / level / date / language
3. Stats bar — 3 числа: общо ученика, страни, години (reuse от home stats)
4. Upload hint за Alex
5. CTA към `/lessons` и `/contact`

## Файлове за създаване (4)

### 1. `app/[locale]/reviews/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReviewsStats } from "@/components/reviews/ReviewsStats";
import { ReviewsGrid } from "@/components/reviews/ReviewsGrid";
import { ReviewsCta } from "@/components/reviews/ReviewsCta";

export default function ReviewsPage() {
  const t = useTranslations("reviews");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ReviewsStats />
      <ReviewsGrid />
      <ReviewsCta />
    </PageShell>
  );
}
```

### 2. `components/reviews/ReviewsStats.tsx` (server component)

```tsx
import { useTranslations } from "next-intl";
import { StatBlock } from "@/components/ui/StatBlock";

export function ReviewsStats() {
  const t = useTranslations("stats");

  return (
    <section className="px-6 md:px-10 pb-16 md:pb-24 max-w-6xl">
      <div className="grid grid-cols-3 gap-6 md:gap-12 border-t border-b border-white/10 py-10 md:py-14">
        <StatBlock
          value="+500"
          label={t("riders.label")}
          align="left"
          dividerDirection="down"
        />
        <StatBlock
          value="+12"
          label={t("countries.label")}
          align="left"
          dividerDirection="down"
        />
        <StatBlock
          value="+8"
          label={t("years.label")}
          align="left"
          dividerDirection="down"
        />
      </div>
    </section>
  );
}
```

### 3. `components/reviews/ReviewsGrid.tsx` (server component)

6 review cards. Всяка с quote + name + country + level + date. Placeholder съдържание базирано на USP-то от брифа.

```tsx
import { useTranslations } from "next-intl";

const reviewKeys = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;

export function ReviewsGrid() {
  const t = useTranslations("reviews");

  return (
    <section className="px-6 md:px-10 pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
      {reviewKeys.map((key) => (
        <article
          key={key}
          className="bg-neutral-900 rounded-3xl p-8 border border-white/5 flex flex-col gap-6"
        >
          <span aria-hidden className="text-white/20 text-6xl leading-none font-medium">
            &ldquo;
          </span>
          <p className="text-white/90 text-base md:text-lg leading-relaxed lowercase -mt-6">
            {t(`items.${key}.quote`)}
          </p>
          <footer className="border-t border-white/10 pt-6 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 text-sm lowercase">
              <p className="text-white font-medium">{t(`items.${key}.name`)}</p>
              <p className="text-white/60">{t(`items.${key}.country`)}</p>
            </div>
            <div className="flex flex-col gap-1 text-xs text-right text-white/40 uppercase tracking-[0.2em]">
              <p>{t(`items.${key}.level`)}</p>
              <p>{t(`items.${key}.date`)}</p>
            </div>
          </footer>
        </article>
      ))}
    </section>
  );
}
```

### 4. `components/reviews/ReviewsCta.tsx` (server component)

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function ReviewsCta() {
  const t = useTranslations("reviews.cta");

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

### `messages/en.json` — ДОБАВЯШ САМО `reviews` namespace

```json
"reviews": {
  "eyebrow": "reviews",
  "title": "what riders say.",
  "subtitle": "placeholder testimonials for now — real reviews from recent students are coming. the tone matches the feedback alex hears most often.",
  "items": {
    "r1": {
      "quote": "alex adapts to your pace instead of drilling a generic curriculum. by day three i was linking turns on the red run.",
      "name": "james w.",
      "country": "manchester, uk",
      "level": "beginner",
      "date": "feb 2026"
    },
    "r2": {
      "quote": "brought my two kids (7 and 9). patient, safety-first, fun. they asked to go back the next day.",
      "name": "maria k.",
      "country": "sofia, bg",
      "level": "kids",
      "date": "jan 2026"
    },
    "r3": {
      "quote": "three of us friends at different levels. alex kept us together with routes that worked for everyone — not easy.",
      "name": "daniel r.",
      "country": "bucharest, ro",
      "level": "group",
      "date": "mar 2026"
    },
    "r4": {
      "quote": "booked a full week to polish carving. finally feel the edge work on harder terrain. video review after each day was a game-changer.",
      "name": "yoav b.",
      "country": "tel aviv, il",
      "level": "advanced",
      "date": "feb 2026"
    },
    "r5": {
      "quote": "first-time snowboarder, nervous. alex made it feel safe without babying me. left with real confidence, not just 'i survived'.",
      "name": "elena p.",
      "country": "plovdiv, bg",
      "level": "beginner",
      "date": "dec 2025"
    },
    "r6": {
      "quote": "flexibility was huge. we changed start time twice because of weather and never felt like a hassle.",
      "name": "tomás s.",
      "country": "madrid, es",
      "level": "intermediate",
      "date": "jan 2026"
    }
  },
  "cta": {
    "eyebrow": "ready to join the list?",
    "title": "your session next.",
    "subtitle": "pick a package, send me a message — we'll lock in a date.",
    "lessons": "see lessons",
    "book": "get in touch"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `reviews` namespace

```json
"reviews": {
  "eyebrow": "отзиви",
  "title": "какво казват райдърите.",
  "subtitle": "засега placeholder отзиви — реални отзиви от последни ученици идват. тонът отразява това което alex най-често чува.",
  "items": {
    "r1": {
      "quote": "alex се адаптира към твоето темпо, вместо да минава през стандартна програма. на третия ден свързвах завоите на червената писта.",
      "name": "james w.",
      "country": "манчестър, uk",
      "level": "начинаещ",
      "date": "фев 2026"
    },
    "r2": {
      "quote": "заведох двете си деца (7 и 9). търпелив, фокус върху безопасност, забавно. поискаха да отидат и на следващия ден.",
      "name": "мария к.",
      "country": "софия, bg",
      "level": "деца",
      "date": "ян 2026"
    },
    "r3": {
      "quote": "трима приятели на различни нива. alex ни задържа заедно с маршрути подходящи за всички — не е лесно.",
      "name": "даниел р.",
      "country": "букурещ, ro",
      "level": "група",
      "date": "мар 2026"
    },
    "r4": {
      "quote": "резервирах цяла седмица за полиране на карвинга. най-накрая усещам канта на по-труден терен. видео ревю след всеки ден беше game-changer.",
      "name": "йоав б.",
      "country": "тел авив, il",
      "level": "напреднал",
      "date": "фев 2026"
    },
    "r5": {
      "quote": "първи път на сноуборд, нервна. alex направи да се чувствам сигурна, без да ме глези. излязох с истинска увереност, не просто 'оцелях'.",
      "name": "елена п.",
      "country": "пловдив, bg",
      "level": "начинаещ",
      "date": "дек 2025"
    },
    "r6": {
      "quote": "гъвкавостта беше ключова. сменяхме начален час два пъти заради времето и нито веднъж не се почувствахме като пречка.",
      "name": "томас с.",
      "country": "мадрид, es",
      "level": "средно",
      "date": "ян 2026"
    }
  },
  "cta": {
    "eyebrow": "готов/а да си в списъка?",
    "title": "твоята сесия е следваща.",
    "subtitle": "избери пакет, пиши ми — ще фиксираме дата.",
    "lessons": "виж уроците",
    "book": "свържи се"
  }
}
```

## Дизайн правила

- Фон `bg-black`, карти `bg-neutral-900 rounded-3xl border border-white/5`
- Quote mark е `text-white/20 text-6xl leading-none font-medium` (голяма декоративна кавичка)
- Text: `text-white`, `text-white/90` (quote), `text-white/60` (country), `text-white/40` (level/date)
- Всичко lowercase
- Ревю-ята са 6, в 2-колонен grid на desktop, 1-колонен на mobile
- Stats блокът reuse-ва съществуващия `StatBlock` primitive от `@/components/ui/StatBlock`
- **Всички компоненти са server components** — няма state, няма интерактивност
- Tailwind v4, TypeScript strict
- Всички вътрешни линкове през `@/i18n/routing`

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`
- ❌ Пипаш други pages
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Измисляш съвсем нов tone — придържай се към USP-то от business brief (персонален подход, темпо, гъвкавост, езици)
- ❌ Използваш реални имена от google / facebook отзиви — placeholder имена + инициали
- ❌ Добавяш star rating компонент — keep минималистично
- ❌ Добавяш nov message namespace освен `reviews`
- ❌ Модифицираш съществуващите namespace-и
- ❌ Install нови dependencies
- ❌ Правиш компонентите client components
- ❌ Skip git hooks (`--no-verify`)
- ❌ Забравиш `git diff --cached` преди `git push`

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 4-те нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: curl `/en/reviews` и `/bg/reviews`
5. **`git add` точно 6-те файла; после `git diff --cached`**
6. Commit: `feat(T014): reviews page with 6 placeholder testimonials and stats`
7. `git pull --rebase origin main`
8. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/reviews`, `/bg/reviews`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/reviews` + `/bg/reviews` рендерират PageHeader + stats bar + 6 review карти + CTA
- [ ] 6-те review карти имат различно съдържание (6 различни countries, 6 различни levels/dates)
- [ ] Stats блокът показва `+500` / `+12` / `+8`
- [ ] Съществуващите messages keys са байтово непипнати (`git diff --cached messages/*.json`)
- [ ] Committed + pushed с точно 6 файла

## Report формат

```markdown
## Report — T014

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X минути

### Какво направих
(1-3 параграфа)

### Acceptance criteria
- [x] pnpm build — evidence
- [x] pnpm tsc --noEmit — exit 0
- [x] pnpm lint — без warnings
- [x] Routes рендерират — evidence
- [x] 6 различни ревюта — evidence
- [x] Stats показва +500/+12/+8 — evidence
- [x] Existing keys unchanged — evidence: git diff --cached summary (6 файла)
- [x] Pushed — evidence: commit SHA

### Отклонения от спеца
(ако има)

### Променени файлове
- app/[locale]/reviews/page.tsx — създаден
- components/reviews/ReviewsStats.tsx — създаден
- components/reviews/ReviewsGrid.tsx — създаден
- components/reviews/ReviewsCta.tsx — създаден
- messages/en.json — модифициран (добавен reviews namespace)
- messages/bg.json — модифициран (добавен reviews namespace)
```

---

## Reports

_(downstream агентът попълва след завършване)_
