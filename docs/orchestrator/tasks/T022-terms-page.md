# T022 · `/terms` страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Твоята задача е да построиш **страницата `/terms` (условия за ползване)** с **boilerplate legal текст за услугата** (snowboard instruction). Alex по-късно може да го финализира с юрист. Shared layout (PageShell, PageHeader) е готов.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ и ПРЕДИ push. `git diff --cached` преди `git push`.

Прочети преди работа:
- `docs/03-design-direction.md` — визуални правила
- `components/shared/PageShell.tsx`, `PageHeader.tsx` — задължителни primitives
- `i18n/routing.ts` — `Link` от `@/i18n/routing`
- `messages/en.json`, `messages/bg.json` — добавяш САМО `terms.*` namespace

## Your task

Prose страница с:
1. PageHeader (eyebrow, title, subtitle с "last updated" дата)
2. TermsContent — 10 секции (prose layout, typography-focused)
3. Footer note с контакт за въпроси + линк към `/privacy`

Секции (10):
1. Service description
2. Booking & reservations
3. Payment (cash on site)
4. Cancellation & rescheduling
5. Weather & conditions
6. Equipment & gear
7. Liability & risk
8. Minors (под 18)
9. Intellectual property (photos/videos)
10. Changes & governing law

## Файлове за създаване (2)

### 1. `app/[locale]/terms/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { TermsContent } from "@/components/terms/TermsContent";

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <TermsContent />
    </PageShell>
  );
}
```

### 2. `components/terms/TermsContent.tsx` (server component)

Prose layout с 10 секции.

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const sectionKeys = [
  "service",
  "booking",
  "payment",
  "cancellation",
  "weather",
  "equipment",
  "liability",
  "minors",
  "intellectualProperty",
  "changes",
] as const;

export function TermsContent() {
  const t = useTranslations("terms");

  return (
    <section className="px-6 md:px-10 pb-24 md:pb-32 max-w-3xl">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-10">
        {t("lastUpdatedLabel")}: {t("lastUpdated")}
      </p>

      <article className="flex flex-col gap-12">
        {sectionKeys.map((key, index) => (
          <section key={key} className="flex flex-col gap-4 border-t border-white/10 pt-10 first:border-t-0 first:pt-0">
            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-medium lowercase tracking-tight">
              {t(`sections.${key}.title`)}
            </h2>
            <div className="flex flex-col gap-4 text-white/80 text-base leading-relaxed lowercase">
              <p>{t(`sections.${key}.p1`)}</p>
              <p>{t(`sections.${key}.p2`)}</p>
            </div>
          </section>
        ))}
      </article>

      <footer className="mt-16 border-t border-white/10 pt-10 flex flex-col gap-4 text-sm text-white/60 lowercase">
        <p>{t("footer.questions")}</p>
        <p>
          <a
            href="mailto:alex@ridewithalex.com"
            className="text-white/80 hover:text-white transition-colors"
          >
            alex@ridewithalex.com
          </a>
        </p>
        <p>
          <Link href="/privacy" className="text-white/60 hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
            {t("footer.privacyLink")}
          </Link>
        </p>
      </footer>
    </section>
  );
}
```

## Файлове за модифициране (2)

### `messages/en.json` — ДОБАВЯШ САМО `terms` namespace

```json
"terms": {
  "eyebrow": "legal",
  "title": "terms of service",
  "subtitle": "the rules for booking and taking a snowboard lesson with ridewithalex. plain-language summary — no fine print traps.",
  "lastUpdatedLabel": "last updated",
  "lastUpdated": "april 24, 2026",
  "sections": {
    "service": {
      "title": "what i offer",
      "p1": "ridewithalex is a snowboard instruction service operated by alex (the instructor) in bansko, bulgaria. lessons are offered one-on-one, for small groups (max four riders), and for children from age six.",
      "p2": "by booking a lesson you confirm that you've read and agreed to these terms. if something here isn't clear, ask before booking — easier than sorting it out after."
    },
    "booking": {
      "title": "booking and reservations",
      "p1": "bookings are made through the contact channels listed on the site (phone, whatsapp, email, instagram). a booking is confirmed once alex replies with a confirmed date and meeting time.",
      "p2": "please provide a valid phone number at booking. we may need to reach you the day before or the morning of the lesson about weather or conditions."
    },
    "payment": {
      "title": "payment",
      "p1": "payment is made in cash on the day of the first lesson, in euros or bulgarian leva at the current daily exchange rate. no online payment or deposit is required.",
      "p2": "receipts are available on request. for multi-day packages (full day, week), the total is paid at the start of the first day unless another arrangement is agreed in advance."
    },
    "cancellation": {
      "title": "cancellation and rescheduling",
      "p1": "you can cancel a booking free of charge up to 48 hours before the scheduled start. cancellations made within 48 hours may be subject to a 30% fee to cover the reserved time.",
      "p2": "rescheduling to another available date is always free, regardless of how close to the original date you contact us. just message early if you can."
    },
    "weather": {
      "title": "weather and conditions",
      "p1": "snowboard lessons depend on mountain conditions. if weather or avalanche risk makes a lesson unsafe, alex will contact you to reschedule at no cost.",
      "p2": "you can also cancel free of charge if you decide the conditions don't suit you, even inside the 48-hour window — just tell us before we start the lift ride up."
    },
    "equipment": {
      "title": "equipment and gear",
      "p1": "you are responsible for your own snowboard, boots, helmet, goggles, and weather-appropriate clothing. alex can recommend a rental shop in bansko if needed.",
      "p2": "a helmet is strongly recommended and required for riders under 18. lift passes are not included in the lesson price and must be purchased separately at the gondola."
    },
    "liability": {
      "title": "liability and assumption of risk",
      "p1": "snowboarding involves inherent risks, including falls, collisions, and injuries. by participating in a lesson you acknowledge these risks and agree that alex is not liable for injuries or losses resulting from the activity itself.",
      "p2": "alex maintains appropriate instructor certification and follows established safety practices. you are encouraged to carry personal travel or sports insurance covering winter sports."
    },
    "minors": {
      "title": "minors (under 18)",
      "p1": "riders under 18 must be booked by a parent or legal guardian. the guardian is responsible for providing accurate medical information, allergies, and any special needs at the time of booking.",
      "p2": "for children under 12, the guardian must be present at the meeting point at the start and end of each lesson. alex does not assume responsibility for children outside lesson hours."
    },
    "intellectualProperty": {
      "title": "photos, videos, and intellectual property",
      "p1": "alex may take photos or short videos during lessons for coaching feedback and, occasionally, for use on the ridewithalex website and instagram account.",
      "p2": "if you do not want your image used publicly, please say so at booking or any time before the lesson. we will honor the request without explanation."
    },
    "changes": {
      "title": "changes and governing law",
      "p1": "these terms may be updated occasionally. the date at the top of this page shows when they were last revised. continued use of the service after an update means you accept the new terms.",
      "p2": "these terms are governed by the laws of the republic of bulgaria. any disputes will be resolved, where possible, through direct conversation. formal disputes fall under the jurisdiction of the courts of blagoevgrad district."
    }
  },
  "footer": {
    "questions": "questions about these terms? drop alex a line:",
    "privacyLink": "read the privacy policy"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `terms` namespace

```json
"terms": {
  "eyebrow": "правни",
  "title": "общи условия",
  "subtitle": "правилата за резервация и вземане на сноуборд урок с ridewithalex. на разбираем език — без капани в дребния шрифт.",
  "lastUpdatedLabel": "последна промяна",
  "lastUpdated": "24 април 2026",
  "sections": {
    "service": {
      "title": "какво предлагам",
      "p1": "ridewithalex е услуга за обучение по сноуборд, управлявана от alex (инструкторът) в банско, българия. уроците се предлагат индивидуално, за малки групи (максимум 4 райдъра) и за деца от 6 години.",
      "p2": "при резервация на урок потвърждаваш, че си прочел/а и приемаш тези условия. ако нещо не е ясно — питай преди резервация, по-лесно е от изясняване после."
    },
    "booking": {
      "title": "резервации",
      "p1": "резервациите се правят чрез контактните канали в сайта (телефон, whatsapp, имейл, instagram). резервацията се потвърждава след като alex отговори с потвърдена дата и час за среща.",
      "p2": "моля, дай валиден телефонен номер при резервация. може да ни е нужно да се свържем с теб ден преди или сутринта на урока относно време или условия."
    },
    "payment": {
      "title": "плащане",
      "p1": "плащането се извършва в брой в деня на първия урок, в евро или български лева по текущия дневен курс. не се изисква онлайн плащане или капаро.",
      "p2": "квитанции се предоставят при поискване. за многодневни пакети (цял ден, седмица) цялата сума се плаща в началото на първия ден, освен ако друго не е уговорено предварително."
    },
    "cancellation": {
      "title": "отмяна и пренасрочване",
      "p1": "можеш да отмениш резервация безплатно до 48 часа преди началото. отмяна в рамките на 48 часа може да бъде обект на такса 30% за покриване на запазеното време.",
      "p2": "пренасрочване за друга свободна дата винаги е безплатно, независимо колко близо до оригиналната дата ни пишеш. просто пиши възможно най-рано."
    },
    "weather": {
      "title": "време и условия",
      "p1": "сноуборд уроците зависят от планинските условия. ако времето или риск от лавина правят урока небезопасен, alex ще се свърже с теб за пренасрочване без такса.",
      "p2": "можеш също да отмениш безплатно, ако прецениш, че условията не ти допадат, дори в 48-часовия прозорец — само ни кажи преди да започнем да се качваме с лифта."
    },
    "equipment": {
      "title": "екипировка",
      "p1": "ти си отговорен/на за собствения си сноуборд, обувки, каска, очила и подходящо за времето облекло. alex може да препоръча магазин под наем в банско, ако е нужно.",
      "p2": "силно се препоръчва каска, задължителна е за райдъри под 18. ски пасове не са включени в цената на урока и се купуват отделно на гондолата."
    },
    "liability": {
      "title": "отговорност и риск",
      "p1": "сноубордът включва присъщи рискове, включително падания, сблъсъци и травми. с участие в урок потвърждаваш тези рискове и приемаш, че alex не носи отговорност за травми или загуби, произтичащи от самата дейност.",
      "p2": "alex поддържа подходяща инструкторска сертификация и следва установени практики за безопасност. препоръчваме лична туристическа или спортна застраховка, покриваща зимни спортове."
    },
    "minors": {
      "title": "непълнолетни (под 18)",
      "p1": "райдъри под 18 трябва да бъдат резервирани от родител или законен настойник. настойникът е отговорен за предоставяне на точна медицинска информация, алергии и специални нужди при резервация.",
      "p2": "за деца под 12, настойник трябва да присъства на мястото на среща в началото и края на всеки урок. alex не поема отговорност за деца извън часовете на урока."
    },
    "intellectualProperty": {
      "title": "снимки, видеа и интелектуална собственост",
      "p1": "alex може да прави снимки или кратки видеа по време на уроци за обратна връзка върху техниката и понякога за използване в сайта ridewithalex или instagram акаунта.",
      "p2": "ако не желаеш твое изображение да се използва публично, моля кажи при резервация или по всяко време преди урока. ще уважим желанието без обяснения."
    },
    "changes": {
      "title": "промени и приложимо право",
      "p1": "тези условия може да бъдат актуализирани от време на време. датата в горната част на страницата показва кога са последно ревизирани. продължаващото използване на услугата след актуализация означава приемане на новите условия.",
      "p2": "тези условия се уреждат от законите на република българия. всякакви спорове ще се решават, по възможност, чрез директен разговор. официални спорове попадат под юрисдикцията на съдилищата на благоевградски съдебен район."
    }
  },
  "footer": {
    "questions": "въпроси относно тези условия? пиши на alex:",
    "privacyLink": "прочети политиката за поверителност"
  }
}
```

## Дизайн правила

- Фон `bg-black`, prose над `max-w-3xl` (по-тесен от другите страници — legal text е по-четим в тесен колонен)
- Текст: `text-white`, `text-white/80` (body), `text-white/60` (footer), `text-white/40` (section numbers + eyebrow)
- Секции имат `border-t border-white/10 pt-10` divider (първата без)
- Section number (01-10) е `uppercase tracking-[0.3em]` отгоре на всяка
- Всичко lowercase
- **Server components** — никаква интерактивност
- Tailwind v4, TypeScript strict
- Линкове през `@/i18n/routing`; `mailto:` — plain `<a>`

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`
- ❌ Пипаш други pages
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Копираш legal текст от други сайтове (плагиатство) — този текст е написан точно за RideWithAlex
- ❌ Добавяш nov message namespace освен `terms`
- ❌ Модифицираш съществуващите namespace-и
- ❌ Install нови dependencies
- ❌ Правиш компонентите client components
- ❌ Skip git hooks
- ❌ Забравиш `git diff --cached` преди `git push`

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 2-та нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: curl `/en/terms` и `/bg/terms`
5. **`git add` точно 4-те файла; `git diff --cached`**
6. Commit: `feat(T022): terms of service page with 10 sections, en + bg`
7. `git pull --rebase origin main`
8. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/terms`, `/bg/terms`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/terms` + `/bg/terms` рендерират PageHeader + 10 секции (01-10 номерирани) + footer с email + privacy link
- [ ] Всички 10 секции имат title + p1 + p2 на двата езика
- [ ] `lastUpdated` дата е видима (april 24, 2026 / 24 април 2026)
- [ ] Footer линк към `/privacy` работи (използва `<Link>` от `@/i18n/routing`)
- [ ] Съществуващите messages keys са байтово непипнати
- [ ] Committed + pushed с точно 4 файла

## Report формат

```markdown
## Report — T022

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
- [x] 10 секции на двата езика — evidence
- [x] Existing keys unchanged — evidence: git diff --cached (4 файла)
- [x] Pushed — evidence: commit SHA

### Отклонения от спеца
(ако има)

### Променени файлове
- app/[locale]/terms/page.tsx — създаден
- components/terms/TermsContent.tsx — създаден
- messages/en.json — модифициран (добавен terms namespace)
- messages/bg.json — модифициран (добавен terms namespace)
```

---

## Reports

_(downstream агентът попълва след завършване)_
