# T015 · `/contact` + FAQ страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Hero + lessons + pricing + about страниците са готови и живи. Shared layout (PageShell, PageHeader, SiteNav, SiteFooter) е готов. Твоята задача е да построиш **страницата `/contact` + FAQ**, използвайки shared primitives. Другите статични страници (`/gallery`, `/reviews`, `/terms`, `/privacy`) ще се правят **след теб** — няма паралелна работа.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ започване И отново ПРЕДИ push. Преди финалното `git push` направи `git diff --cached` и провери че stage-нал си точно каквото спеца казва — нищо повече.

Прочети преди работа:
- `docs/03-design-direction.md` — визуални правила
- `docs/01-business-brief.md` §`Контакти (финализирани)` — contact info (източник на истината)
- `docs/06-content-checklist.md` §`Примерен FAQ` — draft FAQ въпроси за reference
- `components/shared/PageShell.tsx`, `PageHeader.tsx` — задължителни primitives
- `components/ui/Button.tsx` — T002 primitive
- `i18n/routing.ts` — `Link` от `@/i18n/routing`
- `messages/en.json`, `messages/bg.json` — добавяш САМО `contact.*` namespace

## Your task

Създаваш страница на `/contact` с:
1. PageHeader (eyebrow, title, subtitle)
2. ContactInfo секция — 3-колонен grid: телефон, имейл, Instagram (cards с icon + стойност + линк)
3. MeetingPoint секция — текст + Google Maps iframe embed
4. FaqAccordion секция — 10 FAQ въпроса, client component с expand/collapse логика (без JS libraries — pure React state)
5. CTA към `/lessons` и `/pricing`

## Файлове за създаване (5)

### 1. `app/[locale]/contact/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { MeetingPoint } from "@/components/contact/MeetingPoint";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { ContactCta } from "@/components/contact/ContactCta";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ContactInfo />
      <MeetingPoint />
      <FaqAccordion />
      <ContactCta />
    </PageShell>
  );
}
```

### 2. `components/contact/ContactInfo.tsx` (server component)

```tsx
import { useTranslations } from "next-intl";

type Channel = {
  key: "phone" | "email" | "instagram";
  href: string;
  value: string;
  external: boolean;
};

const channels: Channel[] = [
  { key: "phone", href: "tel:+359885137471", value: "+359 88 513 7471", external: false },
  { key: "email", href: "mailto:alex@ridewithalex.com", value: "alex@ridewithalex.com", external: false },
  { key: "instagram", href: "https://instagram.com/ridewithalex", value: "@ridewithalex", external: true },
];

export function ContactInfo() {
  const t = useTranslations("contact.info");

  return (
    <section className="px-6 md:px-10 pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      {channels.map(({ key, href, value, external }) => (
        <a
          key={key}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="group bg-neutral-900 rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-colors flex flex-col gap-4"
        >
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
            {t(`${key}.label`)}
          </p>
          <p className="text-white text-2xl md:text-3xl font-medium lowercase tracking-tight">
            {value}
          </p>
          <p className="text-white/60 text-sm leading-relaxed lowercase mt-auto">
            {t(`${key}.hint`)}
          </p>
          <span className="text-white/40 group-hover:text-white/80 transition-colors text-xs uppercase tracking-[0.3em] mt-2">
            {external ? t("open") : t("tap")}
          </span>
        </a>
      ))}
    </section>
  );
}
```

### 3. `components/contact/MeetingPoint.tsx` (server component)

Embed-ва Google Maps iframe на **Банско, ул. Пирин 1 (гондолата)**.

```tsx
import { useTranslations } from "next-intl";

export function MeetingPoint() {
  const t = useTranslations("contact.meeting");

  return (
    <section className="px-6 md:px-10 py-16 md:py-24 border-t border-white/10 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-5 flex flex-col gap-4">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
            {t("eyebrow")}
          </p>
          <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)]">
            {t("title")}
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed lowercase">
            {t("address")}
          </p>
          <p className="text-white/60 text-sm leading-relaxed lowercase">
            {t("directions")}
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
            <iframe
              src="https://www.google.com/maps?q=Bansko+Gondola+Pirin+Street+1&output=embed"
              title={t("mapTitle")}
              className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-90"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Бележка:** `grayscale contrast-125 opacity-90` са CSS filters които правят Google Maps iframe да се вписва в монохромния design. Това е най-доброто което можем без paid Google Maps styling API.

### 4. `components/contact/FaqAccordion.tsx` (CLIENT component)

Client component — локален state за expand/collapse, без JS library. Използва native `<details>` + `<summary>` за accessibility и без-JS fallback.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";

const faqKeys = [
  "equipment",
  "clothing",
  "groupSize",
  "minAge",
  "language",
  "weather",
  "cancellation",
  "location",
  "liftPass",
  "payment",
] as const;

type FaqKey = (typeof faqKeys)[number];

export function FaqAccordion() {
  const t = useTranslations("contact.faq");
  const [openKey, setOpenKey] = useState<FaqKey | null>(null);

  return (
    <section className="px-6 md:px-10 py-16 md:py-24 border-t border-white/10 max-w-4xl">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)] mb-12">
        {t("title")}
      </h2>

      <ul className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
        {faqKeys.map((key) => {
          const isOpen = openKey === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : key)}
                aria-expanded={isOpen}
                aria-controls={`faq-${key}`}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="text-white text-lg md:text-xl font-medium lowercase tracking-tight group-hover:text-white/80 transition-colors">
                  {t(`items.${key}.q`)}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "text-white/40 text-2xl leading-none transition-transform shrink-0",
                    isOpen ? "rotate-45" : "rotate-0"
                  )}
                >
                  +
                </span>
              </button>
              <div
                id={`faq-${key}`}
                hidden={!isOpen}
                className="pb-6 pr-10 text-white/70 text-sm md:text-base leading-relaxed lowercase"
              >
                {t(`items.${key}.a`)}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

### 5. `components/contact/ContactCta.tsx` (server component)

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function ContactCta() {
  const t = useTranslations("contact.cta");

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
          <Link href="/pricing">
            <Button variant="primary">{t("pricing")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

## Файлове за модифициране (2)

### `messages/en.json` — ДОБАВЯШ САМО `contact` namespace

Добавяш `contact` top-level key след `about` (или където е най-подходящо); **не променяш нищо друго**. Преди commit, направи `git diff --cached messages/en.json` — очаквай единствен hunk който само добавя `contact` блока.

```json
"contact": {
  "eyebrow": "get in touch",
  "title": "contact",
  "subtitle": "phone, whatsapp, email, instagram. pick whatever's quickest — i read everything and reply within the day.",
  "open": "open →",
  "tap": "tap to call →",
  "info": {
    "phone": {
      "label": "phone · whatsapp",
      "hint": "fastest for same-day questions and last-minute bookings."
    },
    "email": {
      "label": "email",
      "hint": "best for detailed questions, group requests, and travel planning."
    },
    "instagram": {
      "label": "instagram",
      "hint": "see recent sessions and message me there — dms are open."
    }
  },
  "meeting": {
    "eyebrow": "meeting point",
    "title": "where we meet.",
    "address": "пред гондолата, ул. пирин 1, банско 2770",
    "directions": "exact spot: the benches by the gondola entrance. i'll be wearing a black jacket with a green carbon snowboard. we sort out lift pass and gear before riding up.",
    "mapTitle": "bansko gondola station map"
  },
  "faq": {
    "eyebrow": "faq",
    "title": "frequently asked.",
    "items": {
      "equipment": {
        "q": "do i need my own snowboard and boots?",
        "a": "no. rentals are easy in bansko — plenty of shops near the gondola. tell me your level and i'll recommend a shop and the right board size."
      },
      "clothing": {
        "q": "what should i wear for the first lesson?",
        "a": "waterproof jacket and pants, thermal base layer, warm socks (just one pair, not two), gloves, helmet, and goggles. no cotton. rent or bring — both work."
      },
      "groupSize": {
        "q": "how many people in a group lesson?",
        "a": "max four riders, always at a similar level. i check the level over whatsapp before we meet so the pacing works for everyone."
      },
      "minAge": {
        "q": "what's the youngest age for kids lessons?",
        "a": "six years old. younger kids usually don't have the attention span for a full session. exceptions are possible — message me."
      },
      "language": {
        "q": "what language is the lesson in?",
        "a": "english or bulgarian, whichever you prefer. i switch mid-sentence if that helps — fluent in both."
      },
      "weather": {
        "q": "what if there's no snow or bad weather?",
        "a": "bansko has great snowmaking so conditions are usually rideable from december through april. severe storms: we reschedule at no cost."
      },
      "cancellation": {
        "q": "can i cancel or reschedule?",
        "a": "free cancellation up to 48 hours before the lesson. inside 48 hours, a 30% fee applies. rescheduling to another date is always free."
      },
      "location": {
        "q": "where does the lesson start?",
        "a": "at the gondola base in bansko town (not on the mountain). we ride the gondola up together and pick the slope that matches your level."
      },
      "liftPass": {
        "q": "is the lift pass included?",
        "a": "no. lift passes are bought at the cashier by the gondola — around €45 per day. i can help you pick the right duration."
      },
      "payment": {
        "q": "how do i pay?",
        "a": "cash in euros or bulgarian leva on the day of the first lesson. no online payment required."
      }
    }
  },
  "cta": {
    "eyebrow": "ready to ride?",
    "title": "let's get you on a board.",
    "subtitle": "pick a lesson type, check the prices, drop me a message — we'll sort out a date that works.",
    "lessons": "see lessons",
    "pricing": "see pricing"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `contact` namespace

```json
"contact": {
  "eyebrow": "свържи се с мен",
  "title": "контакти",
  "subtitle": "телефон, whatsapp, имейл, instagram. избери каквото ти е най-бързо — чета всичко и отговарям в рамките на деня.",
  "open": "отвори →",
  "tap": "натисни да се обадиш →",
  "info": {
    "phone": {
      "label": "телефон · whatsapp",
      "hint": "най-бързо за въпроси в същия ден и last-minute резервации."
    },
    "email": {
      "label": "имейл",
      "hint": "най-добро за подробни въпроси, групови заявки и планиране на пътуване."
    },
    "instagram": {
      "label": "instagram",
      "hint": "виж последни сесии и ми пиши там — dm-ите са отворени."
    }
  },
  "meeting": {
    "eyebrow": "място за среща",
    "title": "къде се срещаме.",
    "address": "пред гондолата, ул. пирин 1, банско 2770",
    "directions": "точно място: пейките до входа на гондолата. ще бъда с черно яке и зелен карбонов сноуборд. оправяме ски пас и екипировка преди да се качим.",
    "mapTitle": "карта на гондолата в банско"
  },
  "faq": {
    "eyebrow": "чести въпроси",
    "title": "често задавани.",
    "items": {
      "equipment": {
        "q": "трябва ли да имам собствен борд и обувки?",
        "a": "не. в банско има много магазини близо до гондолата. кажи ми нивото си и ще ти препоръчам магазин и правилен размер борд."
      },
      "clothing": {
        "q": "какво да облека за първия урок?",
        "a": "водонепромокаемо яке и панталон, термо бельо, един чифт топли чорапи (не два), ръкавици, каска и очила. без памук. под наем или свое — и двете работят."
      },
      "groupSize": {
        "q": "колко човека в групов урок?",
        "a": "максимум 4 райдъра, винаги на сходно ниво. проверявам нивото през whatsapp преди да се видим, за да работи темпото за всички."
      },
      "minAge": {
        "q": "от коя възраст са детски уроци?",
        "a": "от 6 години. по-малките деца обикновено нямат внимание за цяла сесия. изключения са възможни — пиши ми."
      },
      "language": {
        "q": "на какъв език е урокът?",
        "a": "английски или български, каквото предпочиташ. превключвам насред изречение, ако така се разбираме по-ясно — свободен и на двата."
      },
      "weather": {
        "q": "какво става ако няма сняг или времето е лошо?",
        "a": "банско има отлично изкуствено заснежаване — условията обикновено са добри от декември до април. при силна буря: пренасрочваме без такса."
      },
      "cancellation": {
        "q": "мога ли да отменя или пренасроча?",
        "a": "безплатна отмяна до 48 часа преди урока. в рамките на 48 часа има 30% такса. пренасрочване за друга дата винаги е безплатно."
      },
      "location": {
        "q": "откъде започва урокът?",
        "a": "от долната станция на гондолата в град банско (не от планината). качваме се заедно с гондолата и избираме писта според нивото ти."
      },
      "liftPass": {
        "q": "включен ли е ски пасът?",
        "a": "не. ски пасовете се купуват на касата до гондолата — около €45 на ден. мога да помогна с избора на продължителност."
      },
      "payment": {
        "q": "как се плаща?",
        "a": "в брой (евро или лева) в деня на първия урок. няма онлайн плащане."
      }
    }
  },
  "cta": {
    "eyebrow": "готов/а си да караш?",
    "title": "да те качим на борд.",
    "subtitle": "избери тип урок, виж цените, пиши ми — ще съгласуваме дата.",
    "lessons": "виж уроците",
    "pricing": "виж цените"
  }
}
```

## Дизайн правила

- Фон `bg-black`, карти `bg-neutral-900 rounded-3xl border border-white/5`
- Текст: `text-white`, `text-white/90`, `text-white/70`, `text-white/60`, `text-white/40`, `text-white/30`
- Всичко lowercase освен eyebrow-ите (малки uppercase tracked labels)
- Шрифт: Onest (глобално зареден)
- Google Maps iframe с `grayscale contrast-125 opacity-90` CSS filters за монохром consistency
- FAQ accordion е **client component** — останалото server
- Tailwind v4, TypeScript strict
- Всички вътрешни линкове през `@/i18n/routing`
- External links (`instagram.com`) — plain `<a>` с `target="_blank" rel="noopener noreferrer"`
- `mailto:` и `tel:` — plain `<a>`, no target/rel

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`
- ❌ Пипаш други pages (`app/[locale]/page.tsx`, `lessons/*`, `pricing/*`, `about/*`)
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Добавяш booking/форма в тази задача — това е Wave 4
- ❌ Добавяш nov message namespace освен `contact` (не `gallery`, `reviews`, `terms`, `privacy`)
- ❌ Модифицираш съществуващите namespace-и (`home`/`nav`/`stats`/`locale`/`footer`/`lessons`/`pricing`/`about`)
- ❌ Install нови dependencies (няма calendar library, няма form library)
- ❌ Skip git hooks (`--no-verify`)
- ❌ Забравиш `git diff --cached` преди `git push` (Wave 2 lesson — задължителен pre-commit check)

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 5-те нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: `pnpm dev`, curl `/en/contact` и `/bg/contact`
5. **`git add` само точно тези файлове; после `git diff --cached`** — потвърди че виждаш:
   - 5 нови компонента под `app/[locale]/contact/` + `components/contact/`
   - 2 модифицирани messages файла, всяка с един-единствен додатък (`contact` namespace)
   - Нищо друго
6. Commit: `feat(T015): contact page with info cards, map, faq accordion, cta`
7. `git pull --rebase origin main`
8. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/contact`, `/bg/contact`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/contact` и `/bg/contact` рендерират PageHeader + ContactInfo (3 карти) + MeetingPoint (текст + map) + FaqAccordion (10 въпроса) + CTA
- [ ] FAQ accordion expand-ва/collapse-ва при клик (native React state, `"use client"` директива присъства)
- [ ] Phone карта отваря `tel:+359885137471`, email — `mailto:alex@ridewithalex.com`, Instagram — `https://instagram.com/ridewithalex` в нов tab с `rel="noopener noreferrer"`
- [ ] Google Maps iframe рендерира с `grayscale contrast-125 opacity-90` класове
- [ ] Съществуващите messages keys (`home`/`nav`/`stats`/`locale`/`footer`/`lessons`/`pricing`/`about`) са байтово непипнати (verify: `git diff --cached messages/en.json` + `git diff --cached messages/bg.json` — очаквай само додатъчен `contact` блок)
- [ ] Committed + pushed
- [ ] Нищо друго не е stage-нато освен тези 7 файла (verify: `git diff --cached --stat`)

## Report формат (попълни и върни на оркестратора)

```markdown
## Report — T015

**Status:** completed | partial | blocked
**Commits:** [SHA — message]
**Time spent:** ~X минути

### Какво направих
(1-3 параграфа, ≤ 200 думи)

### Acceptance criteria
- [x] pnpm build — evidence: `✓ Compiled in Xs, N routes`
- [x] pnpm tsc --noEmit — exit 0
- [x] pnpm lint — без warnings
- [x] `/en/contact` + `/bg/contact` рендерират — evidence: curl snippet
- [x] FAQ accordion интерактивен — evidence: `"use client"` + useState в FaqAccordion.tsx
- [x] Contact links правилни — evidence: tel:/mailto:/instagram href стойности
- [x] Google Maps с monochrome filters — evidence: grayscale contrast-125 opacity-90 в DOM
- [x] Existing keys unchanged — evidence: git diff --cached summary (7 файла точно, нито повече)
- [x] Pushed — evidence: commit SHA на origin/main

### Отклонения от спеца
(ако има — ако "няма", провери чрез `git diff HEAD~1 HEAD --stat` че commit-ът съдържа само 7-те файла)

### Блокери / въпроси
(ако има)

### Променени файлове
- app/[locale]/contact/page.tsx — създаден
- components/contact/ContactInfo.tsx — създаден
- components/contact/MeetingPoint.tsx — създаден
- components/contact/FaqAccordion.tsx — създаден (client component)
- components/contact/ContactCta.tsx — създаден
- messages/en.json — модифициран (добавен contact namespace)
- messages/bg.json — модифициран (добавен contact namespace)
```

---

## Reports

_(downstream агентът попълва след завършване)_
