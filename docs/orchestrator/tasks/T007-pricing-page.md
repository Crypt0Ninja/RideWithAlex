# T007 · `/pricing` страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Hero-то и shared layout компонентите (SiteNav, SiteFooter, PageShell, PageHeader) са готови. Твоята задача е да построиш **само страницата `/pricing`**, използвайки shared primitives. Страниците `/lessons` и `/about` се правят **паралелно от други агенти** — пипаш само своите файлове и своя `pricing.*` namespace в messages.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ започване И отново ПРЕДИ push. Други агенти работят паралелно върху същия branch.

Прочети преди работа:
- `docs/03-design-direction.md` — визуални правила (монохром, lowercase, Onest, rounded-3xl карти)
- `docs/01-business-brief.md` §`Цени на пакетите` — финализираните цени (**не ги променяш**)
- `docs/02-sitemap.md` §`💰 Цени` — какво съдържание влиза
- `components/shared/PageShell.tsx` — wrapper който **задължително** обгръща цялата страница
- `components/shared/PageHeader.tsx` — reusable header
- `components/ui/Button.tsx` — T002 primitive
- `i18n/routing.ts` — `Link` от `@/i18n/routing` (НЕ от `next/link`)
- `messages/en.json`, `messages/bg.json` — съществуващи ключове; добавяш САМО `pricing.*` namespace

## Цени (от business brief, не променяй)

| Пакет | Продължителност | Цена |
|---|---|---|
| 2 hours | 1 урок / 2ч | €100 |
| 4 hours | 1 ден / 4ч | €200 |
| Full day | 6ч (2 сесии с пауза) | €250 |
| Week | 5 дни | €1000 |

**Капаро:** 30% онлайн, остатъкът в брой на място.

## Your task

Създаваш страница на `/pricing` с:
1. PageHeader (eyebrow, title, subtitle)
2. Grid с 4 пакета (price карти)
3. Бележка долу с капаро + какво е включено + политика на отмяна
4. CTA блок към `/lessons` и `/contact`

## Файлове за създаване (3)

### 1. `app/[locale]/pricing/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { PriceCard } from "@/components/pricing/PriceCard";
import { PricingNote } from "@/components/pricing/PricingNote";
import { PricingCta } from "@/components/pricing/PricingCta";

export default function PricingPage() {
  const t = useTranslations("pricing");

  const packages = [
    { key: "twoHours" as const, price: "€100", featured: false },
    { key: "fourHours" as const, price: "€200", featured: false },
    { key: "fullDay" as const, price: "€250", featured: true },
    { key: "week" as const, price: "€1000", featured: false },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="px-6 md:px-10 pb-16 md:pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
        {packages.map(({ key, price, featured }) => (
          <PriceCard
            key={key}
            name={t(`packages.${key}.name`)}
            duration={t(`packages.${key}.duration`)}
            price={price}
            description={t(`packages.${key}.description`)}
            featured={featured}
            bestValueLabel={t("bestValue")}
          />
        ))}
      </section>

      <PricingNote />
      <PricingCta />
    </PageShell>
  );
}
```

### 2. `components/pricing/PriceCard.tsx`

```tsx
import { cn } from "@/lib/cn";

type PriceCardProps = {
  name: string;
  duration: string;
  price: string;
  description: string;
  featured?: boolean;
  bestValueLabel: string;
};

export function PriceCard({
  name,
  duration,
  price,
  description,
  featured = false,
  bestValueLabel,
}: PriceCardProps) {
  return (
    <article
      className={cn(
        "relative rounded-3xl p-8 flex flex-col gap-6 border transition-colors",
        featured
          ? "bg-white text-black border-white"
          : "bg-neutral-900 text-white border-white/5 hover:border-white/20"
      )}
    >
      {featured ? (
        <span
          className={cn(
            "absolute -top-3 right-6 bg-black text-white text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full"
          )}
        >
          {bestValueLabel}
        </span>
      ) : null}

      <header>
        <p
          className={cn(
            "uppercase tracking-[0.3em] text-[10px] mb-3",
            featured ? "text-black/50" : "text-white/40"
          )}
        >
          {duration}
        </p>
        <h2
          className={cn(
            "text-3xl md:text-4xl font-medium lowercase tracking-tight",
            featured ? "text-black" : "text-white"
          )}
        >
          {name}
        </h2>
      </header>

      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "hero-title font-medium text-5xl md:text-6xl",
            featured ? "text-black" : "text-white"
          )}
        >
          {price}
        </span>
      </div>

      <p
        className={cn(
          "text-sm leading-relaxed lowercase",
          featured ? "text-black/70" : "text-white/70"
        )}
      >
        {description}
      </p>
    </article>
  );
}
```

### 3. `components/pricing/PricingNote.tsx`

```tsx
import { useTranslations } from "next-intl";

export function PricingNote() {
  const t = useTranslations("pricing.note");

  const items = [
    { label: t("deposit.label"), value: t("deposit.value") },
    { label: t("included.label"), value: t("included.value") },
    { label: t("notIncluded.label"), value: t("notIncluded.value") },
    { label: t("cancellation.label"), value: t("cancellation.value") },
  ];

  return (
    <section className="px-6 md:px-10 py-16 md:py-20 border-t border-white/10 max-w-6xl">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-8">
        {t("eyebrow")}
      </p>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {items.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-2">
            <dt className="text-white text-lg font-medium lowercase tracking-tight">
              {label}
            </dt>
            <dd className="text-white/70 text-sm md:text-base leading-relaxed lowercase">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

### 4. `components/pricing/PricingCta.tsx`

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function PricingCta() {
  const t = useTranslations("pricing.cta");

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

### `messages/en.json` — ДОБАВЯШ САМО `pricing` namespace

Пипаш `messages/en.json`, добавяш нов top-level ключ `pricing` след съществуващия `footer`. **Не променяш нищо друго** — нито whitespace, нито стойности, нито подредба на съществуващите ключове (`home`, `nav`, `stats`, `locale`, `footer`).

```json
"pricing": {
  "eyebrow": "rates",
  "title": "pricing",
  "subtitle": "transparent per-session rates in euros. 30% deposit online when you book, the rest in cash on the day of the lesson.",
  "bestValue": "best value",
  "packages": {
    "twoHours": {
      "name": "2 hours",
      "duration": "single session",
      "description": "a complete first lesson, or a refresher. enough time to warm up, cover fundamentals, and ride a few runs."
    },
    "fourHours": {
      "name": "4 hours",
      "duration": "half day",
      "description": "the sweet spot for fast progress. two hours of focused drills, lunch break, two hours of applying what clicked."
    },
    "fullDay": {
      "name": "full day",
      "duration": "6 hours · two sessions",
      "description": "the best per-hour value. morning technique block, long lunch, afternoon free-riding with live coaching."
    },
    "week": {
      "name": "week",
      "duration": "5 days · 4h each",
      "description": "the transformation package. from first turn to confident on-piste rider, or intermediate to carving advanced terrain."
    }
  },
  "note": {
    "eyebrow": "what to know",
    "deposit": {
      "label": "deposit",
      "value": "30% deposit at booking via stripe. the remaining 70% in cash on the day of the first lesson."
    },
    "included": {
      "label": "included",
      "value": "coaching, route planning, session video review on request, progress feedback after each lesson."
    },
    "notIncluded": {
      "label": "not included",
      "value": "lift pass, rental equipment, insurance. i can help you sort all three — just ask."
    },
    "cancellation": {
      "label": "cancellation",
      "value": "free cancellation up to 48h before the lesson. inside 48h, the deposit is held; rescheduling is always free."
    }
  },
  "cta": {
    "eyebrow": "ready to book?",
    "title": "let's lock in a date.",
    "subtitle": "drop me a line — i'll confirm availability and send a stripe link for the deposit.",
    "lessons": "see lessons",
    "book": "book now"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `pricing` namespace

```json
"pricing": {
  "eyebrow": "цени",
  "title": "цени",
  "subtitle": "прозрачни цени на сесия в евро. 30% капаро онлайн при резервация, остатъкът в брой в деня на урока.",
  "bestValue": "най-добра стойност",
  "packages": {
    "twoHours": {
      "name": "2 часа",
      "duration": "една сесия",
      "description": "пълен първи урок или опресняване. достатъчно време за загряване, основи и няколко спускания."
    },
    "fourHours": {
      "name": "4 часа",
      "duration": "половин ден",
      "description": "идеалната продължителност за бърз прогрес. два часа фокусирани упражнения, обедна почивка, още два часа прилагане."
    },
    "fullDay": {
      "name": "цял ден",
      "duration": "6 часа · две сесии",
      "description": "най-добрата стойност на час. сутрешен блок по техника, дълъг обяд, следобедно свободно каране с live коучинг."
    },
    "week": {
      "name": "седмица",
      "duration": "5 дни · по 4ч",
      "description": "пакетът за трансформация. от първи завой до уверен райдър на пистата, или от среден до карвинг на напреднал терен."
    }
  },
  "note": {
    "eyebrow": "какво да знаеш",
    "deposit": {
      "label": "капаро",
      "value": "30% капаро при резервация през stripe. останалите 70% в брой в деня на първия урок."
    },
    "included": {
      "label": "включено",
      "value": "коучинг, планиране на маршрут, видео ревю при поискване, обратна връзка за прогреса след всеки урок."
    },
    "notIncluded": {
      "label": "не е включено",
      "value": "ски пас, екипировка под наем, застраховка. мога да помогна с всяко от трите — просто питай."
    },
    "cancellation": {
      "label": "отмяна",
      "value": "безплатна отмяна до 48 часа преди урока. в рамките на 48 часа капарото се задържа; пренасрочване винаги е безплатно."
    }
  },
  "cta": {
    "eyebrow": "готов/а за резервация?",
    "title": "нека фиксираме дата.",
    "subtitle": "пиши ми — ще потвърдя наличност и ще изпратя stripe линк за капарото.",
    "lessons": "виж уроците",
    "book": "резервирай"
  }
}
```

## Дизайн правила

- Фон `bg-black`, карти `bg-neutral-900 rounded-3xl border border-white/5`
- **Featured карта** (fullDay) е инвертирана — `bg-white text-black` с малък черен "best value" badge
- Текст: `text-white`, `text-white/90`, `text-white/70`, `text-white/40`, `text-white/30` (за non-featured)
- Всичко lowercase освен eyebrow-ите
- Шрифт: Onest (глобално зареден)
- Цените използват `hero-title` utility клас за lowercase + tight spacing
- Без цветни акценти
- Tailwind v4 синтаксис
- TypeScript strict
- Всички вътрешни линкове през `@/i18n/routing`
- Без нови dependencies
- Всички компоненти са server components

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`, `components/LocaleSwitcher.tsx`
- ❌ Пипаш `app/[locale]/page.tsx` (home остава hero)
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Пипаш `app/[locale]/lessons/*` или `app/[locale]/about/*` — те са на други агенти
- ❌ Модифицираш съществуващите namespace-и в messages (`home`, `nav`, `stats`, `locale`, `footer`) — дори whitespace ще причини merge конфликт
- ❌ Добавяш `lessons.*` или `about.*` в messages — само `pricing.*`
- ❌ Променяш цените — €100/€200/€250/€1000 са финализирани от Alex
- ❌ Добавяш нови dependencies
- ❌ Stripe интеграция в тази задача — само линк към `/contact` (бутонът казва "book")
- ❌ Правиш компонентите client components
- ❌ Skip git hooks (`--no-verify`)

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 4-те нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: `pnpm dev`, curl `/en/pricing` и `/bg/pricing`
5. Commit: `feat(T007): pricing page with four package cards and breakdown`
6. `git pull --rebase origin main` отново — ако има конфликт в `messages/*.json` (вероятно с `lessons` или `about` блок от паралелен агент), запази **и двата** блока и продължи
7. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/pricing`, `/bg/pricing`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/pricing` и `/bg/pricing` рендерират PageHeader + 4 price карти + note + CTA
- [ ] Full-day картата е featured (бял фон, черен текст, "best value" badge)
- [ ] Цените са €100 / €200 / €250 / €1000 (не променени)
- [ ] PricingNote показва 4 точки (deposit / included / not included / cancellation)
- [ ] CTA има 2 бутона — "see lessons" (secondary → `/lessons`) и "book now" (primary → `/contact`)
- [ ] Съществуващите messages keys (`home`, `nav`, `stats`, `locale`, `footer`) са байтово непипнати
- [ ] Committed + pushed

## Report формат (попълни и върни на оркестратора)

```markdown
## Report — T007

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X минути

### Какво направих
(1-3 параграфа, ≤ 200 думи)

### Acceptance criteria
- [x] pnpm build — evidence: `✓ Compiled in Xs, N routes`
- [x] pnpm tsc --noEmit — exit 0
- [x] pnpm lint — без warnings
- [x] `/en/pricing` и `/bg/pricing` рендерират — evidence: curl snippet с 4-те цени
- [x] Featured карта (fullDay) с bg-white + best value badge — evidence: DOM snippet
- [x] Цените непроменени — evidence: €100/€200/€250/€1000 в DOM
- [x] PricingNote с 4 точки — evidence: labels
- [x] CTA с правилни линкове — evidence: href стойности
- [x] Existing keys unchanged — evidence: git diff summary
- [x] Pushed — evidence: commit SHA на origin/main

### Отклонения от спеца
(ако има)

### Блокери / въпроси
(ако има)

### Merge конфликти
(ако `git pull --rebase` е извадил конфликт в `messages/*.json` — опиши как е решен)

### Променени файлове
- app/[locale]/pricing/page.tsx — създаден
- components/pricing/PriceCard.tsx — създаден
- components/pricing/PricingNote.tsx — създаден
- components/pricing/PricingCta.tsx — създаден
- messages/en.json — модифициран (добавен pricing namespace)
- messages/bg.json — модифициран (добавен pricing namespace)
```

---

## Reports

### Report 1 — 2026-04-23 · agent 8 · ✅ accepted with documented deviations

**Commit:** `a3eb13a` — `feat(T007): pricing page with four package cards and breakdown`
**Time:** ~20 минути

#### Обобщение (от downstream доклада)

4 нови файла: `app/[locale]/pricing/page.tsx` (route + 4-пакетен масив, `fullDay` featured), `components/pricing/PriceCard.tsx` (инверсия `bg-white/text-black` за featured + black "best value" badge), `components/pricing/PricingNote.tsx` (deposit / included / notIncluded / cancellation), `components/pricing/PricingCta.tsx` (2 бутона към `/lessons` secondary + `/contact` primary). `pricing` namespace добавен в `messages/*.json` след `footer`. Цените €100/€200/€250/€1000 непроменени.

#### Acceptance criteria — verified ✅

| Criterion | Evidence |
|---|---|
| `pnpm build` | `✓ Compiled successfully in 3.0s`, 11 routes (2 нови: `/en/pricing`, `/bg/pricing`) |
| `pnpm tsc --noEmit` | Exit 0 |
| `pnpm lint` | `✔ No ESLint warnings or errors` |
| `/en/pricing` + `/bg/pricing` рендерират | Curl: €100/€200/€250/€1000, "best value", "rates" EN + "най-добра стойност" BG |
| Featured карта (fullDay) | `PriceCard.tsx:24-26` — инверсия; `:29-36` — badge |
| Цените непроменени | `page.tsx:12-15` — €100, €200, €250, €1000 |
| PricingNote с 4 точки | `PricingNote.tsx:7-10` — deposit/included/notIncluded/cancellation |
| CTA линкове | `PricingCta.tsx:23` → `/lessons`; `:26` → `/contact` |
| Pushed | `5868d4d..a3eb13a main -> main` |

#### Отклонения от спеца (2)

**1. `stats` namespace re-formatted (inline → multi-line)** в двата messages файла. Whitespace-only, semantically identical, не чупи функционалност. Нарушава "byte-identical existing keys" правилото, но harmless.

**2. `about.*` scope creep в T007 commit.** Downstream agent-ът е направил `git checkout HEAD -- messages/*.json + re-apply` за да реши локален конфликт с T008 агента. При финалното staging е абсорбирал T008-овия `about` намеspace (≈65 реда EN + паралелна структура BG). Директна наруха на "Do NOT: добавяш about.* в messages — само pricing.*". Scope creep, но съдържанието точно съвпада с T008 спеца. Функционално OK.

**3. Typo hotfix изгубен при rebase.** `git checkout HEAD -- messages/bg.json` на downstream-а презаписа оркестраторския hotfix `chaeркинг → карвинг`. **Повторен сега като отделен clean commit в s12.**

#### Нарушено правило в downstream доклада

Downstream report първо твърди "Никакви отклонения" — **невярно**. Agent не е верифицирал byte integrity на `stats` и не е прочел staged diff преди commit. Правило за downstream агенти: **винаги `git diff --cached` преди commit**, особено на shared JSON файлове.

#### Orchestrator verification

- `git show --stat a3eb13a` — 6 файла, 450 insertions, 6 deletions ✅
- `git show a3eb13a -- messages/en.json` потвърждава `stats` reformat + `pricing` + `about` scope creep ✅
- T008 commit `8ea90ed` правилно не пипа messages (само 5 нови app/components файла) — downstream agent-ът е видял че about е вече там и не го е повторил ✅
- Текущият `messages/bg.json` съдържа всички 7 namespace-а (`home`, `nav`, `stats`, `locale`, `footer`, `pricing`, `lessons`, `about`) ✅
- Typo hotfix на `lessons.private.description` (`chaeркинг` → `карвинг`) приложен отново в s12

#### Вердикт

T007 приет с документирани deviations. Функционалността е 100% според спеца; отклоненията са workflow-related (race condition на shared JSON + липса на self-review), не code. Memory feedback `feedback_parallel_shared_files.md` записан за бъдещи Wave-и.

**Wave 2 е Complete: T006 ✅ · T007 ✅ · T008 ✅ · всички 3 страници живи.**
