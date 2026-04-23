# T008 · `/about` страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Hero-то и shared layout компонентите (SiteNav, SiteFooter, PageShell, PageHeader) са готови. Твоята задача е да построиш **само страницата `/about`**, използвайки shared primitives. Страниците `/lessons` и `/pricing` се правят **паралелно от други агенти** — пипаш само своите файлове и своя `about.*` namespace в messages.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ започване И отново ПРЕДИ push. Други агенти работят паралелно върху същия branch.

Прочети преди работа:
- `docs/03-design-direction.md` — визуални правила
- `docs/01-business-brief.md` — **source of truth за био и философия** (секции "Кратка био" и "Уникално предимство"). Не измисляш ново съдържание — използваш съществуващото.
- `docs/02-sitemap.md` §`👋 За мен` — какво влиза
- `components/shared/PageShell.tsx`, `PageHeader.tsx` — задължителни primitives
- `components/ui/Button.tsx` — T002 primitive
- `i18n/routing.ts` — `Link` от `@/i18n/routing`
- `messages/en.json`, `messages/bg.json` — добавяш САМО `about.*` namespace

## Your task

Създаваш страница на `/about` с:
1. PageHeader (eyebrow, title, subtitle)
2. Био секция — split layout: голям портретен placeholder (ляво) + bio текст (дясно)
3. "Why me" — 4 точки с принципите на Alex
4. Сертификати — списък с placeholder статус (чакат потвърждение от Alex)
5. CTA към `/lessons` и `/contact`

## Файлове за създаване (5)

### 1. `app/[locale]/about/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { BioBlock } from "@/components/about/BioBlock";
import { WhyMe } from "@/components/about/WhyMe";
import { Certifications } from "@/components/about/Certifications";
import { AboutCta } from "@/components/about/AboutCta";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <BioBlock />
      <WhyMe />
      <Certifications />
      <AboutCta />
    </PageShell>
  );
}
```

### 2. `components/about/BioBlock.tsx`

```tsx
import { useTranslations } from "next-intl";

export function BioBlock() {
  const t = useTranslations("about.bio");

  return (
    <section className="px-6 md:px-10 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 max-w-6xl">
      {/* Portrait placeholder */}
      <div className="md:col-span-5">
        <div
          className="relative aspect-[3/4] w-full bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center"
          aria-label="portrait placeholder"
        >
          <div className="text-center px-6">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
              portrait
            </p>
            <p className="text-white/50 text-sm lowercase">
              {t("portraitPlaceholder")}
            </p>
          </div>
          {/* thin diagonal accent */}
          <span
            aria-hidden
            className="absolute top-8 right-8 diagonal-divider-right"
          />
        </div>
      </div>

      {/* Bio text */}
      <div className="md:col-span-7 flex flex-col gap-6">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
          {t("eyebrow")}
        </p>
        <h2 className="text-white text-3xl md:text-5xl font-medium lowercase tracking-tight leading-tight">
          {t("heading")}
        </h2>
        <div className="flex flex-col gap-4 text-white/80 text-base md:text-lg leading-relaxed lowercase">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}
```

### 3. `components/about/WhyMe.tsx`

```tsx
import { useTranslations } from "next-intl";

export function WhyMe() {
  const t = useTranslations("about.why");

  const points = [
    { key: "pace" as const },
    { key: "language" as const },
    { key: "smallGroups" as const },
    { key: "flexibility" as const },
  ];

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/10 max-w-6xl">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)] mb-16">
        {t("title")}
      </h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {points.map(({ key }) => (
          <div key={key} className="flex flex-col gap-3 border-t border-white/10 pt-6">
            <dt className="text-white text-xl md:text-2xl font-medium lowercase tracking-tight">
              {t(`${key}.title`)}
            </dt>
            <dd className="text-white/70 text-sm md:text-base leading-relaxed lowercase">
              {t(`${key}.body`)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

### 4. `components/about/Certifications.tsx`

```tsx
import { useTranslations } from "next-intl";

export function Certifications() {
  const t = useTranslations("about.certifications");

  const certs = [
    { key: "isia" as const, pending: true },
    { key: "bss" as const, pending: true },
    { key: "basi" as const, pending: true },
    { key: "firstAid" as const, pending: false },
  ];

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/10 max-w-6xl">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)] mb-6">
        {t("title")}
      </h2>
      <p className="text-white/60 text-sm md:text-base leading-relaxed lowercase max-w-2xl mb-12">
        {t("note")}
      </p>
      <ul className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
        {certs.map(({ key, pending }) => (
          <li
            key={key}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-6"
          >
            <div className="flex flex-col gap-1">
              <p className="text-white text-lg md:text-xl font-medium lowercase tracking-tight">
                {t(`items.${key}.name`)}
              </p>
              <p className="text-white/60 text-sm lowercase">
                {t(`items.${key}.full`)}
              </p>
            </div>
            <span
              className={
                pending
                  ? "text-white/40 text-[10px] uppercase tracking-[0.3em]"
                  : "text-white/80 text-[10px] uppercase tracking-[0.3em]"
              }
            >
              {pending ? t("statusPending") : t("statusActive")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### 5. `components/about/AboutCta.tsx`

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function AboutCta() {
  const t = useTranslations("about.cta");

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

### `messages/en.json` — ДОБАВЯШ САМО `about` namespace

Пипаш `messages/en.json`, добавяш нов top-level ключ `about` след съществуващия `footer`. **Не променяш нищо друго** — нито whitespace, нито стойности, нито подредба на съществуващите ключове (`home`, `nav`, `stats`, `locale`, `footer`).

```json
"about": {
  "eyebrow": "instructor",
  "title": "about",
  "subtitle": "8 years of teaching on the slopes of bansko. 500+ riders from 12+ countries. every lesson shaped around the person, not a script.",
  "bio": {
    "eyebrow": "who i am",
    "heading": "hi, i'm alex.",
    "portraitPlaceholder": "photo goes here — board in hand, slopes behind.",
    "p1": "for the past 8 years i've been teaching snowboarding on the slopes of bansko — from first-timers strapping in for the very first run, to advanced riders refining their technique.",
    "p2": "over 500 students from more than 12 countries have ridden with me. every lesson is a real conversation — no conveyor-belt group sessions, no rushed drills.",
    "p3": "your pace. your line. your progress."
  },
  "why": {
    "eyebrow": "approach",
    "title": "what makes a lesson with me different.",
    "pace": {
      "title": "your pace",
      "body": "no rushed drills, no standard curriculum. the session plan adapts to how you're riding that morning, not how a textbook says you should be."
    },
    "language": {
      "title": "two languages",
      "body": "fluent english and bulgarian. i switch mid-sentence if that's what makes the feedback land clearer."
    },
    "smallGroups": {
      "title": "small groups only",
      "body": "one-on-one by default. groups max out at four riders at a similar level, pre-checked over whatsapp before we meet."
    },
    "flexibility": {
      "title": "flexible meeting",
      "body": "start time, meeting point, session length — all adjustable. tell me your schedule and we'll build around it."
    }
  },
  "certifications": {
    "eyebrow": "credentials",
    "title": "certifications.",
    "note": "the list below is being finalized. all certificates are current; the specific grades and numbers will be confirmed before launch.",
    "statusPending": "pending confirmation",
    "statusActive": "active",
    "items": {
      "isia": {
        "name": "isia",
        "full": "international ski instructors association"
      },
      "bss": {
        "name": "bss",
        "full": "bulgarian ski federation — snowboard instructor"
      },
      "basi": {
        "name": "basi",
        "full": "british association of snowsport instructors"
      },
      "firstAid": {
        "name": "first aid · cpr",
        "full": "certified in first aid and cpr"
      }
    }
  },
  "cta": {
    "eyebrow": "let's meet on the mountain",
    "title": "ready when you are.",
    "subtitle": "pick a package, drop me a line, we'll line up a date that works.",
    "lessons": "see lessons",
    "book": "get in touch"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `about` namespace

```json
"about": {
  "eyebrow": "инструктор",
  "title": "за мен",
  "subtitle": "8 години преподаване по пистите на банско. над 500 райдъри от повече от 12 страни. всеки урок съобразен с човека, не със сценарий.",
  "bio": {
    "eyebrow": "кой съм аз",
    "heading": "здравей, аз съм alex.",
    "portraitPlaceholder": "снимка идва тук — с борд в ръка, пистата зад гърба.",
    "p1": "от 8 години преподавам сноуборд по пистите на банско — от хора, които за първи път закопчават борда, до напреднали, които доглаждат техниката.",
    "p2": "над 500 ученика от повече от 12 страни са карали с мен. всеки урок е истински разговор — без конвейерни групови сесии, без прибързани упражнения.",
    "p3": "твоето темпо. твоята линия. твоят прогрес."
  },
  "why": {
    "eyebrow": "подход",
    "title": "какво прави урок с мен различен.",
    "pace": {
      "title": "твоето темпо",
      "body": "без прибързани упражнения, без стандартна програма. планът на сесията се адаптира към това как караш сутринта, не към това как учебник казва, че трябва."
    },
    "language": {
      "title": "два езика",
      "body": "свободен английски и български. превключвам насред изречение, ако така обратната връзка стига по-ясно."
    },
    "smallGroups": {
      "title": "само малки групи",
      "body": "индивидуални уроци по подразбиране. групите са максимум 4 райдъра на сходно ниво, с проверка през whatsapp преди да се видим."
    },
    "flexibility": {
      "title": "гъвкави срещи",
      "body": "начален час, място за среща, продължителност на сесията — всичко се нагласява. кажи ми графика си и ще го построим около него."
    }
  },
  "certifications": {
    "eyebrow": "квалификации",
    "title": "сертификати.",
    "note": "списъкът по-долу се финализира. всички сертификати са валидни; конкретните нива и номера ще бъдат потвърдени преди пускането.",
    "statusPending": "чака потвърждение",
    "statusActive": "активен",
    "items": {
      "isia": {
        "name": "isia",
        "full": "international ski instructors association"
      },
      "bss": {
        "name": "бсс",
        "full": "българска федерация по ски — инструктор сноуборд"
      },
      "basi": {
        "name": "basi",
        "full": "british association of snowsport instructors"
      },
      "firstAid": {
        "name": "първа помощ · cpr",
        "full": "сертифициран за първа помощ и cpr"
      }
    }
  },
  "cta": {
    "eyebrow": "да се видим на планината",
    "title": "готов/а, когато ти си готов/а.",
    "subtitle": "избери пакет, пиши ми, ще съгласуваме дата.",
    "lessons": "виж уроците",
    "book": "свържи се"
  }
}
```

**Бележка за сертификатите:** Q5 в STATUS.md е отворен въпрос — кои точно сертификати има Alex и на какво ниво. Използваш placeholder-ите с `pending confirmation` status — Alex ще ги потвърди отделно след launch.

## Дизайн правила

- Фон `bg-black`, карти `bg-neutral-900 rounded-3xl border border-white/5`
- Portrait placeholder е тъмно quadrat с aspect-[3/4], показва centered placeholder текст + диагонален accent
- Текст: `text-white`, `text-white/90`, `text-white/80`, `text-white/70`, `text-white/60`, `text-white/40`, `text-white/30`
- Всичко lowercase освен eyebrow-ите
- Шрифт: Onest (глобално зареден)
- Използвай `hero-title` utility класа за големите секционни заглавия (`.why` и `.certifications` и `.cta`)
- Portrait placeholder използва `diagonal-divider-right` utility (вече съществува в `globals.css` от T002)
- Tailwind v4 синтаксис
- TypeScript strict
- Всички вътрешни линкове през `@/i18n/routing`
- Без нови dependencies
- Всички компоненти са server components

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`, `components/LocaleSwitcher.tsx`
- ❌ Пипаш `app/[locale]/page.tsx` (home остава hero)
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Пипаш `app/[locale]/lessons/*` или `app/[locale]/pricing/*` — те са на други агенти
- ❌ Модифицираш съществуващите namespace-и в messages (`home`, `nav`, `stats`, `locale`, `footer`) — дори whitespace промяна ще причини merge конфликт
- ❌ Добавяш `lessons.*` или `pricing.*` в messages — само `about.*`
- ❌ Измисляш нови факти за Alex (години, брой ученици, страни) — използвай точно `8 години / 500+ / 12+` от business brief
- ❌ Вмъкваш реална снимка — използвай placeholder карта
- ❌ Добавяш нови dependencies
- ❌ Правиш компонентите client components
- ❌ Skip git hooks (`--no-verify`)

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 5-те нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: `pnpm dev`, curl `/en/about` и `/bg/about`
5. Commit: `feat(T008): about page with bio, why-me, certifications, cta`
6. `git pull --rebase origin main` отново — ако има конфликт в `messages/*.json` (вероятно с `lessons` или `pricing` блок от паралелен агент), запази **и двата** блока и продължи
7. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/about`, `/bg/about`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/about` и `/bg/about` рендерират PageHeader + BioBlock + WhyMe + Certifications + CTA
- [ ] BioBlock е split 5/7 на desktop (portrait ляво, текст дясно)
- [ ] Portrait placeholder има aspect-[3/4] и диагонален accent
- [ ] WhyMe показва 4 точки (pace / language / smallGroups / flexibility)
- [ ] Certifications показва 4 ред-а (ISIA / BSS / BASI / First aid) с pending/active статус
- [ ] Съществуващите messages keys (`home`, `nav`, `stats`, `locale`, `footer`) са байтово непипнати
- [ ] Committed + pushed

## Report формат (попълни и върни на оркестратора)

```markdown
## Report — T008

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X минути

### Какво направих
(1-3 параграфа, ≤ 200 думи)

### Acceptance criteria
- [x] pnpm build — evidence: `✓ Compiled in Xs, N routes`
- [x] pnpm tsc --noEmit — exit 0
- [x] pnpm lint — без warnings
- [x] `/en/about` и `/bg/about` рендерират — evidence: curl snippet
- [x] BioBlock split layout — evidence: portrait + 3 параграфа в DOM
- [x] WhyMe 4 точки — evidence: titles
- [x] Certifications 4 ред-а — evidence: names + статуси
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
- app/[locale]/about/page.tsx — създаден
- components/about/BioBlock.tsx — създаден
- components/about/WhyMe.tsx — създаден
- components/about/Certifications.tsx — създаден
- components/about/AboutCta.tsx — създаден
- messages/en.json — модифициран (добавен about namespace)
- messages/bg.json — модифициран (добавен about namespace)
```

---

## Reports

_(downstream агентът попълва след завършване)_
