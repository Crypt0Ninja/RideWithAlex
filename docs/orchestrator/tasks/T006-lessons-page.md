# T006 · `/lessons` страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Hero-то и shared layout компонентите (SiteNav, SiteFooter, PageShell, PageHeader) са готови. Твоята задача е да построиш **само страницата `/lessons`**, използвайки shared primitives. Страниците `/pricing` и `/about` се правят **паралелно от други агенти** — пипаш само своите файлове и своя `lessons.*` namespace в messages.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ започване И отново ПРЕДИ push. Други агенти работят паралелно върху същия branch.

Прочети преди работа:
- `docs/03-design-direction.md` — визуални правила (монохром, lowercase, Onest, rounded-3xl карти)
- `docs/01-business-brief.md` — USP, тон, аудитории
- `docs/02-sitemap.md` §`🏂 Уроци` — какво съдържание влиза
- `components/shared/PageShell.tsx` — wrapper който **задължително** обгръща цялата страница
- `components/shared/PageHeader.tsx` — reusable header (eyebrow/title/subtitle)
- `components/shared/SiteNav.tsx`, `SiteFooter.tsx` — референция за стила
- `components/ui/Button.tsx`, `NavPill.tsx` — T002 primitives
- `i18n/routing.ts` — `Link` от `@/i18n/routing` (НЕ от `next/link`)
- `messages/en.json`, `messages/bg.json` — съществуващи ключове; добавяш САМО `lessons.*` namespace

## Your task

Създаваш страница на `/lessons` с 3 типа уроци (частен / деца / група), всеки с описание, какво включва, ниво, продължителност. Накрая — CTA блок към `/pricing` и `/contact`.

## Файлове за създаване (3)

### 1. `app/[locale]/lessons/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { LessonTypeCard } from "@/components/lessons/LessonTypeCard";
import { LessonsCta } from "@/components/lessons/LessonsCta";

export default function LessonsPage() {
  const t = useTranslations("lessons");

  const lessonTypes = [
    {
      key: "private" as const,
      duration: t("private.duration"),
      level: t("private.level"),
    },
    {
      key: "kids" as const,
      duration: t("kids.duration"),
      level: t("kids.level"),
    },
    {
      key: "group" as const,
      duration: t("group.duration"),
      level: t("group.level"),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="px-6 md:px-10 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        {lessonTypes.map(({ key, duration, level }) => (
          <LessonTypeCard
            key={key}
            title={t(`${key}.title`)}
            description={t(`${key}.description`)}
            includes={[
              t(`${key}.includes.0`),
              t(`${key}.includes.1`),
              t(`${key}.includes.2`),
            ]}
            duration={duration}
            level={level}
          />
        ))}
      </section>

      <LessonsCta />
    </PageShell>
  );
}
```

### 2. `components/lessons/LessonTypeCard.tsx`

```tsx
type LessonTypeCardProps = {
  title: string;
  description: string;
  includes: string[];
  duration: string;
  level: string;
};

export function LessonTypeCard({
  title,
  description,
  includes,
  duration,
  level,
}: LessonTypeCardProps) {
  return (
    <article className="bg-neutral-900 rounded-3xl p-8 flex flex-col gap-6 border border-white/5">
      <header>
        <h2 className="text-white text-3xl md:text-4xl font-medium lowercase tracking-tight">
          {title}
        </h2>
        <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase mt-3">
          {description}
        </p>
      </header>

      <ul className="flex flex-col gap-2 text-sm text-white/90 lowercase border-t border-white/10 pt-6">
        {includes.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span aria-hidden className="mt-2 block h-px w-3 bg-white/40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <footer className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs text-white/50 lowercase">
        <div>
          <p className="text-white/30 uppercase tracking-widest text-[10px] mb-1">
            duration
          </p>
          <p className="text-white/80">{duration}</p>
        </div>
        <div>
          <p className="text-white/30 uppercase tracking-widest text-[10px] mb-1">
            level
          </p>
          <p className="text-white/80">{level}</p>
        </div>
      </footer>
    </article>
  );
}
```

### 3. `components/lessons/LessonsCta.tsx`

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function LessonsCta() {
  const t = useTranslations("lessons.cta");

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
          <Link href="/pricing">
            <Button variant="secondary">{t("pricing")}</Button>
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

### `messages/en.json` — ДОБАВЯШ САМО `lessons` namespace

Пипаш `messages/en.json`, добавяш нов top-level ключ `lessons` след съществуващия `footer`. **Не променяш нищо друго** — нито whitespace, нито стойности, нито подредба на съществуващите ключове (`home`, `nav`, `stats`, `locale`, `footer`).

Точно съдържание за добавяне:

```json
"lessons": {
  "eyebrow": "services",
  "title": "lessons",
  "subtitle": "three ways to ride with alex. each lesson is shaped around your pace, your line, and the conditions of the day — never a conveyor belt.",
  "private": {
    "title": "private",
    "description": "one-on-one coaching for adults at any level. from first-timers strapping in for the first run to advanced riders refining carves.",
    "includes": [
      "personalized session plan before we meet",
      "lift-line coaching and video review on request",
      "flexible start time and meeting point"
    ],
    "duration": "2h · 4h · full day · week",
    "level": "beginner → advanced"
  },
  "kids": {
    "title": "kids",
    "description": "patient, safety-first lessons for children from age 6. focus on balance, confidence, and fun before we chase speed.",
    "includes": [
      "age-appropriate drills and gear check",
      "parents welcome to observe",
      "shorter sessions available on request"
    ],
    "duration": "2h · 4h · custom",
    "level": "age 6+"
  },
  "group": {
    "title": "group",
    "description": "small groups of friends or family riding at a similar level. lower cost per person without sacrificing attention.",
    "includes": [
      "max 4 riders per group",
      "pre-lesson level check over whatsapp",
      "custom routes for mixed abilities"
    ],
    "duration": "2h · 4h · full day",
    "level": "beginner → intermediate"
  },
  "cta": {
    "eyebrow": "ready to ride?",
    "title": "pick a package, book a date.",
    "subtitle": "transparent prices. 30% deposit online, the rest in cash on the day.",
    "pricing": "see pricing",
    "book": "book a lesson"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `lessons` namespace

Аналогично — добавяш `lessons` след `footer`, нищо друго не пипаш:

```json
"lessons": {
  "eyebrow": "услуги",
  "title": "уроци",
  "subtitle": "три начина да караш с alex. всеки урок се съобразява с твоето темпо, твоята линия и условията на деня — никога конвейер.",
  "private": {
    "title": "частен",
    "description": "индивидуални уроци за възрастни на всяко ниво. от първи стъпки до напреднала техника и chaeркинг.",
    "includes": [
      "персонален план на сесията преди срещата",
      "коучинг на лифта и видео ревю при поискване",
      "гъвкав час на започване и място за среща"
    ],
    "duration": "2ч · 4ч · цял ден · седмица",
    "level": "начинаещ → напреднал"
  },
  "kids": {
    "title": "деца",
    "description": "търпеливи уроци с фокус върху безопасността за деца от 6 години. баланс, увереност и забавление преди скорост.",
    "includes": [
      "упражнения според възрастта и проверка на екипировка",
      "родителите са добре дошли да наблюдават",
      "по-кратки сесии при поискване"
    ],
    "duration": "2ч · 4ч · по договаряне",
    "level": "от 6 години"
  },
  "group": {
    "title": "група",
    "description": "малки групи от приятели или семейство на сходно ниво. по-ниска цена на човек без компромис с вниманието.",
    "includes": [
      "максимум 4 ученика в група",
      "преглед на нивото през whatsapp преди урока",
      "персонализирани маршрути за смесени нива"
    ],
    "duration": "2ч · 4ч · цял ден",
    "level": "начинаещ → средно"
  },
  "cta": {
    "eyebrow": "готов/а си да караш?",
    "title": "избери пакет, резервирай дата.",
    "subtitle": "прозрачни цени. 30% капаро онлайн, остатъкът в брой на място.",
    "pricing": "виж цените",
    "book": "резервирай урок"
  }
}
```

**Бележка:** Забелязваш ли в `includes` масивите има по 3 елемента? В page.tsx ги достъпваме чрез `t("private.includes.0")`, `t("private.includes.1")`, `t("private.includes.2")` — next-intl поддържа array indexing с dot notation.

## Дизайн правила

- Фон `bg-black`, карти `bg-neutral-900 rounded-3xl border border-white/5`
- Текст: `text-white`, `text-white/90`, `text-white/70`, `text-white/40`, `text-white/30`
- Всичко lowercase освен eyebrow-ите (малки tracked uppercase labels)
- Шрифт: Onest (глобално зареден, не импортвай)
- Без цветни акценти
- `rounded-full` за бутони, `rounded-3xl` за карти
- Tailwind v4 синтаксис (без `tailwind.config.js`)
- TypeScript strict
- Всички вътрешни линкове през `@/i18n/routing` (не `next/link`)
- Без нови dependencies
- Page-ът е server component (няма нужда от `"use client"`)

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`, `components/LocaleSwitcher.tsx`
- ❌ Пипаш `app/[locale]/page.tsx` (home остава hero)
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Пипаш `app/[locale]/pricing/*` или `app/[locale]/about/*` — те са на други агенти
- ❌ Модифицираш съществуващите namespace-и в messages (`home`, `nav`, `stats`, `locale`, `footer`) — дори whitespace промяна ще причини merge конфликт
- ❌ Добавяш `pricing.*` или `about.*` в messages — само `lessons.*`
- ❌ Добавяш нови dependencies
- ❌ Правиш компонентите client components — server components са достатъчни
- ❌ Skip git hooks (`--no-verify`)

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 3-те нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint` — всички трябва да минат
4. Smoke test: `pnpm dev`, curl `/en/lessons` и `/bg/lessons` — страниците рендерират
5. Commit: `feat(T006): lessons page with three lesson type cards and cta`
6. `git pull --rebase origin main` отново — ако има конфликт в `messages/*.json` (вероятно между твоя `lessons` блок и чужд `pricing`/`about` блок), запази **и двата** (твоя + техния) и продължи с push
7. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/lessons`, `/bg/lessons`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/lessons` рендерира PageHeader + 3 lesson карти + CTA
- [ ] `/bg/lessons` със BG преводи — eyebrow/title/subtitle/карти/CTA
- [ ] PageShell обгръща страницата (SiteNav отгоре, SiteFooter долу)
- [ ] 3-те lesson карти имат различно съдържание (private/kids/group)
- [ ] CTA блокът има 2 бутона — "see pricing" (secondary → `/pricing`) и "book a lesson" (primary → `/contact`)
- [ ] Съществуващите messages keys (`home`, `nav`, `stats`, `locale`, `footer`) са байтово непипнати
- [ ] Committed + pushed

## Report формат (попълни и върни на оркестратора)

```markdown
## Report — T006

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X минути

### Какво направих
(1-3 параграфа, ≤ 200 думи)

### Acceptance criteria
- [x] pnpm build — evidence: `✓ Compiled in Xs, N routes`
- [x] pnpm tsc --noEmit — exit 0
- [x] pnpm lint — без warnings
- [x] `/en/lessons` и `/bg/lessons` рендерират — evidence: curl snippet
- [x] PageShell обвива страницата — evidence: DOM съдържа SiteNav + SiteFooter markers
- [x] 3 карти различно съдържание — evidence: заглавия в DOM
- [x] CTA с правилни линкове — evidence: href стойности
- [x] Existing keys unchanged — evidence: git diff summary
- [x] Pushed — evidence: commit SHA на origin/main

### Отклонения от спеца
(ако има — защо и какво е различно)

### Блокери / въпроси
(ако има)

### Merge конфликти
(ако `git pull --rebase` е извадил конфликт в `messages/*.json` — опиши как е решен)

### Променени файлове
- app/[locale]/lessons/page.tsx — създаден
- components/lessons/LessonTypeCard.tsx — създаден
- components/lessons/LessonsCta.tsx — създаден
- messages/en.json — модифициран (добавен lessons namespace)
- messages/bg.json — модифициран (добавен lessons namespace)
```

---

## Reports

_(downstream агентът попълва след завършване)_
