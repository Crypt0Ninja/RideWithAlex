# T023 · `/privacy` страница — RideWithAlex

Ти работиш върху **RideWithAlex** — минималистичен, монохромен editorial сайт за Alex, сноуборд учител от Банско. Твоята задача е да построиш **страницата `/privacy` (политика за поверителност)** с **GDPR-съобразен boilerplate текст**. Alex по-късно може да го финализира с юрист. Shared layout (PageShell, PageHeader) е готов.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ и ПРЕДИ push. `git diff --cached` преди `git push`.

Прочети преди работа:
- `docs/03-design-direction.md` — визуални правила
- `docs/orchestrator/tasks/T022-terms-page.md` — **референтен визуален стил** (T023 има идентична структура, различно съдържание)
- `components/shared/PageShell.tsx`, `PageHeader.tsx` — задължителни primitives
- `i18n/routing.ts` — `Link` от `@/i18n/routing`
- `messages/en.json`, `messages/bg.json` — добавяш САМО `privacy.*` namespace

## Your task

Prose страница аналогична на T022 terms, но с GDPR секции:
1. PageHeader (eyebrow, title, subtitle с "last updated" дата)
2. PrivacyContent — 9 секции
3. Footer с email + линк към `/terms`

Секции (9):
1. Data controller (кой съм аз)
2. What data i collect
3. Why i collect it (legal basis)
4. How long i keep it (retention)
5. Who i share it with
6. Your rights (GDPR art 15-22)
7. Cookies and analytics
8. Security
9. Changes and contact

## Файлове за създаване (2)

### 1. `app/[locale]/privacy/page.tsx`

```tsx
import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <PrivacyContent />
    </PageShell>
  );
}
```

### 2. `components/privacy/PrivacyContent.tsx` (server component)

Визуално идентичен с `TermsContent` от T022 — номерирани секции, тесен max-w-3xl, server component.

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const sectionKeys = [
  "controller",
  "dataCollected",
  "purposes",
  "retention",
  "sharing",
  "rights",
  "cookies",
  "security",
  "changes",
] as const;

export function PrivacyContent() {
  const t = useTranslations("privacy");

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
          <Link href="/terms" className="text-white/60 hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
            {t("footer.termsLink")}
          </Link>
        </p>
      </footer>
    </section>
  );
}
```

## Файлове за модифициране (2)

### `messages/en.json` — ДОБАВЯШ САМО `privacy` namespace

```json
"privacy": {
  "eyebrow": "legal",
  "title": "privacy policy",
  "subtitle": "what data i collect, why i collect it, how long i keep it, and what rights you have over it. plain english, gdpr-compliant.",
  "lastUpdatedLabel": "last updated",
  "lastUpdated": "april 24, 2026",
  "sections": {
    "controller": {
      "title": "who's responsible for your data",
      "p1": "the data controller for this site is alex, operating as a sole snowboard instructor in bansko, bulgaria, under the brand ridewithalex. you can reach me at alex@ridewithalex.com or +359 88 513 7471.",
      "p2": "this policy covers the ridewithalex.com website and any communication you have with alex by email, phone, whatsapp, or instagram in the context of booking or taking a snowboard lesson."
    },
    "dataCollected": {
      "title": "what data i collect",
      "p1": "for bookings i collect your name, phone number, and email address. optionally: the size and skill level of your group, any medical notes you volunteer, and your preferred meeting time.",
      "p2": "the website itself runs on vercel and uses standard server logs (ip address, user agent, timestamps) for security and uptime. i do not use behavioral tracking, ad cookies, or third-party analytics."
    },
    "purposes": {
      "title": "why i collect it",
      "p1": "your contact details are used only to coordinate your lesson: confirmations, reschedules, meeting-point updates, and follow-up questions. the legal basis is the performance of the service you booked (gdpr art. 6(1)(b)).",
      "p2": "server logs are retained for security and legal compliance under gdpr art. 6(1)(f) — legitimate interest in keeping the service running and protecting it from abuse."
    },
    "retention": {
      "title": "how long i keep it",
      "p1": "booking records (name, phone, email, date of lesson) are kept for 3 years after your last lesson, mainly for bookkeeping and in case you return for another session. after that they are deleted.",
      "p2": "server logs are kept for up to 90 days and then rotated out. photos or videos from lessons, if used on the website or instagram, are kept until you request removal."
    },
    "sharing": {
      "title": "who i share it with",
      "p1": "your personal data is not sold, rented, or shared with advertisers. it stays with alex. the only third parties that technically process data on my behalf are: vercel (site hosting, eu region) and google workspace (email). both are gdpr-compliant processors.",
      "p2": "in rare cases i may share minimal information with a medical professional or emergency services if an incident occurs during a lesson. this is only when necessary to protect vital interests (gdpr art. 6(1)(d))."
    },
    "rights": {
      "title": "your rights",
      "p1": "under gdpr you have the right to: access a copy of your data, correct inaccuracies, request deletion, restrict processing, port your data to another service, and object to processing. to exercise any of these, email alex@ridewithalex.com — i reply within 30 days.",
      "p2": "if you believe your rights have been violated, you can lodge a complaint with the bulgarian commission for personal data protection (kzld) at cpdp.bg. i would appreciate a heads-up first so i can try to resolve it directly."
    },
    "cookies": {
      "title": "cookies and analytics",
      "p1": "the site uses only essential cookies — specifically, a language preference cookie so the site remembers if you chose english or bulgarian. no tracking, no advertising, no third-party scripts.",
      "p2": "if analytics are ever added (to see which pages people actually read), it will be a privacy-first, cookieless option like plausible or vercel analytics — and this page will be updated before that happens."
    },
    "security": {
      "title": "how i keep it safe",
      "p1": "booking data is kept in access-controlled systems (google workspace and, in the future, a managed database). passwords use industry-standard hashing. the site is served over https only.",
      "p2": "no system is perfectly secure. in the unlikely event of a breach affecting your personal data, i will notify you within 72 hours and report to kzld as required by gdpr art. 33."
    },
    "changes": {
      "title": "changes and contact",
      "p1": "this policy may be updated to reflect changes in how the service operates. the date at the top shows the latest revision. material changes will be announced via email to active clients.",
      "p2": "for any privacy-related question, concern, or request, email alex@ridewithalex.com. i treat these seriously and reply personally."
    }
  },
  "footer": {
    "questions": "privacy questions? drop alex a line:",
    "termsLink": "read the terms of service"
  }
}
```

### `messages/bg.json` — ДОБАВЯШ САМО `privacy` namespace

```json
"privacy": {
  "eyebrow": "правни",
  "title": "политика за поверителност",
  "subtitle": "какви данни събирам, защо ги събирам, колко дълго ги пазя и какви права имаш върху тях. на разбираем език, съобразен с gdpr.",
  "lastUpdatedLabel": "последна промяна",
  "lastUpdated": "24 април 2026",
  "sections": {
    "controller": {
      "title": "кой отговаря за твоите данни",
      "p1": "администраторът на данни за този сайт е alex, опериращ като самостоятелен сноуборд инструктор в банско, българия, под марката ridewithalex. можеш да се свържеш с мен на alex@ridewithalex.com или +359 88 513 7471.",
      "p2": "тази политика покрива сайта ridewithalex.com и всякаква комуникация с alex по имейл, телефон, whatsapp или instagram в контекста на резервиране или вземане на сноуборд урок."
    },
    "dataCollected": {
      "title": "какви данни събирам",
      "p1": "за резервации събирам име, телефонен номер и имейл. опционално: размер и ниво на групата, медицински бележки които ти споделяш, предпочитан час за среща.",
      "p2": "сайтът работи на vercel и използва стандартни сървърни логове (ip адрес, user agent, времеви отметки) за сигурност и uptime. не използвам поведенчески tracking, рекламни бисквитки или трети страни analytics."
    },
    "purposes": {
      "title": "защо ги събирам",
      "p1": "твоите контакти се използват само за координация на урока: потвърждения, пренасрочвания, обновявания за място на среща и последващи въпроси. правното основание е изпълнение на услугата която си резервирал/а (gdpr чл. 6(1)(б)).",
      "p2": "сървърните логове се пазят за сигурност и правно съответствие съгласно gdpr чл. 6(1)(е) — легитимен интерес да поддържам услугата работеща и защитена от злоупотреба."
    },
    "retention": {
      "title": "колко дълго ги пазя",
      "p1": "записи от резервации (име, телефон, имейл, дата на урок) се пазят 3 години след последния ти урок — главно за счетоводство и в случай на връщане за нова сесия. след това се изтриват.",
      "p2": "сървърни логове се пазят до 90 дни и се ротират. снимки или видеа от уроци, ако се използват в сайта или instagram, се пазят до поискана от теб премахване."
    },
    "sharing": {
      "title": "с кого ги споделям",
      "p1": "твоите лични данни не се продават, отдават под наем или споделят с рекламодатели. остават при alex. единствените трети страни които технически обработват данни от мое име са: vercel (хостинг на сайта, eu регион) и google workspace (имейл). и двете са gdpr-съобразни обработващи.",
      "p2": "в редки случаи мога да споделя минимална информация с медицински специалист или спешни служби, ако възникне инцидент по време на урок. това е само когато е необходимо за защита на жизнени интереси (gdpr чл. 6(1)(г))."
    },
    "rights": {
      "title": "твоите права",
      "p1": "по gdpr имаш право да: достъпваш копие на данните си, коригираш неточности, искаш изтриване, ограничаваш обработката, прехвърляш данните си към друга услуга, и възразиш срещу обработката. за упражняване — пиши на alex@ridewithalex.com — отговарям в рамките на 30 дни.",
      "p2": "ако смяташ, че правата ти са нарушени, можеш да подадеш жалба до комисията за защита на личните данни (кзлд) на cpdp.bg. бих оценил предварителна информация, за да се опитам да го решa директно."
    },
    "cookies": {
      "title": "бисквитки и analytics",
      "p1": "сайтът използва само съществени бисквитки — конкретно, бисквитка за езикови предпочитания, така че сайтът да помни дали си избрал/а английски или български. няма tracking, реклама или скриптове на трети страни.",
      "p2": "ако някога се добави analytics (за да виждам кои страници хората реално четат), ще бъде privacy-first, безбисквиточна опция като plausible или vercel analytics — и тази страница ще бъде обновена преди това."
    },
    "security": {
      "title": "как ги пазя в безопасност",
      "p1": "данните от резервации се пазят в контролирани системи (google workspace и, в бъдеще, управлявана база данни). паролите използват индустриален standard hashing. сайтът се сервира само по https.",
      "p2": "никоя система не е перфектно сигурна. при малка вероятност от пробив, засягащ твоите лични данни, ще те уведомя в рамките на 72 часа и ще докладвам на кзлд според gdpr чл. 33."
    },
    "changes": {
      "title": "промени и контакт",
      "p1": "тази политика може да бъде обновена, за да отрази промени в начина на работа на услугата. датата в горната част показва последната ревизия. съществени промени ще бъдат обявявани по имейл на активни клиенти.",
      "p2": "за всякакъв въпрос, притеснение или заявка относно поверителност — пиши на alex@ridewithalex.com. приемам ги сериозно и отговарям лично."
    }
  },
  "footer": {
    "questions": "въпроси относно поверителност? пиши на alex:",
    "termsLink": "прочети общите условия"
  }
}
```

## Дизайн правила

- **Идентичен** визуален стил с T022 terms (номерирани секции, max-w-3xl, border-t dividers, lowercase, Onest)
- Фон `bg-black`
- Текст: `text-white`, `text-white/80` (body), `text-white/60` (footer), `text-white/40` (section numbers + eyebrow)
- Section numbers 01–09 (само 9 секции, не 10 като terms)
- Всичко lowercase
- **Server components** — никаква интерактивност
- Tailwind v4, TypeScript strict
- Линкове през `@/i18n/routing`; `mailto:` — plain `<a>`

## Do NOT

- ❌ Пипаш `components/hero/*`, `components/shared/*`, `components/ui/*`, `components/brand/*`, `components/terms/*`
- ❌ Пипаш други pages
- ❌ Пипаш `app/[locale]/layout.tsx`, `app/globals.css`, `i18n/*`, `middleware.ts`
- ❌ Копираш privacy текст от други сайтове — текстът по-горе е написан точно за RideWithAlex
- ❌ Променяш факти които не знаеш дали са верни (напр. ако google workspace не е действителният email provider — остави както е, Alex ще finalize-не)
- ❌ Добавяш nov message namespace освен `privacy`
- ❌ Модифицираш съществуващите namespace-и
- ❌ Install нови dependencies
- ❌ Правиш компонентите client components
- ❌ Skip git hooks
- ❌ Забравиш `git diff --cached` преди `git push`

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. Имплементираш 2-та нови файла + 2-те message файла
3. Проверки: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
4. Smoke test: curl `/en/privacy` и `/bg/privacy`
5. **`git add` точно 4-те файла; `git diff --cached`**
6. Commit: `feat(T023): privacy policy page with 9 gdpr sections, en + bg`
7. `git pull --rebase origin main`
8. `git push origin main`

## Acceptance criteria

- [ ] `pnpm build` успешен, 2 нови routes (`/en/privacy`, `/bg/privacy`)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `/en/privacy` + `/bg/privacy` рендерират PageHeader + 9 секции (01-09) + footer с email + terms link
- [ ] Всички 9 секции имат title + p1 + p2 на двата езика
- [ ] `lastUpdated` дата е видима
- [ ] Footer линк към `/terms` работи (използва `<Link>` от `@/i18n/routing`)
- [ ] Съществуващите messages keys са байтово непипнати
- [ ] Committed + pushed с точно 4 файла

## Report формат

```markdown
## Report — T023

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
- [x] 9 секции на двата езика — evidence
- [x] Existing keys unchanged — evidence: git diff --cached (4 файла)
- [x] Pushed — evidence: commit SHA

### Отклонения от спеца
(ако има)

### Променени файлове
- app/[locale]/privacy/page.tsx — създаден
- components/privacy/PrivacyContent.tsx — създаден
- messages/en.json — модифициран (добавен privacy namespace)
- messages/bg.json — модифициран (добавен privacy namespace)
```

---

## Reports

_(downstream агентът попълва след завършване)_
