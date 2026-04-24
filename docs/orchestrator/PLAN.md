# PLAN · RideWithAlex · целият път до launch

> Кратък overview на текущо състояние + какво остава до production launch на [ridewithalex.com](https://ridewithalex.com).
> За детайли → виж `STATUS.md` (жив kanban) или конкретна таска в `tasks/`.

**Последна актуализация:** 2026-04-24 · s15

---

## Къде сме сега

🟢 **9 страници × 2 locale-а = 18 routes живи** на [ridewithalex.vercel.app](https://ridewithalex.vercel.app) · auto-deploy на push
🟢 **Supabase DB foundation live** (2 таблици + RLS + 3 enums) · T011 completed s15
🟡 **Wave 4 (booking pipeline)** — foundation готова, чака external creds за да продължи

---

## ✅ Завършено (14 задачи)

| Фаза | Задачи |
|---|---|
| Foundation | T001 scaffold · T002 tokens · T003 i18n · T018 Onest font · T005 Vercel deploy |
| Hero + shell | T004 hero · T019 SiteNav/Footer/PageShell |
| Wave 2 (3 страници) | T006 lessons · T007 pricing · T008 about |
| Wave 3 (5 страници) | T015 contact · T013 gallery · T014 reviews · T022 terms · T023 privacy |
| Hotfix | T024 pricing cash-only copy |
| **Wave 4 foundation** | **T011 Supabase + Drizzle schema + RLS** |

---

## 🟡 Wave 4 — остава (5 задачи)

**Business модел:** клиент резервира 2ч slot в календар + оставя име/телефон → Alex получава email → плащане в брой на място. **Няма онлайн плащане.**

| # | Задача | Action нужен от теб | Orchestrator action | Estimate |
|---|---|---|---|---|
| **T020** | Google Calendar 2-way sync | Google OAuth creds (виж `Creds` секцията) | OAuth flow + webhook + DB sync | ~1-2 часа |
| **T010** | Booking UI (календар + slot picker + phone форма) | — | Frontend + Supabase integration | ~2-3 часа |
| **T012** | Email (Resend): confirmation + notify | Resend API key + от кой email да изпращаме | 2 HTML шаблона + API routes | ~1 час |
| **T021** | Admin panel (Supabase Auth + block slots) | Admin Gmail (за Supabase Auth user) | Login page + dashboard + block UI | ~2 часа |
| **T024+** | Content hotfix ако нужно | Потенциални copy ревизии | Minor | ~30 мин |

**Sequential dependency:** T020 → T010 → T021; T012 може да стартира след T010.

---

## ⏳ Creds / actions от теб (в приоритет)

| # | Какво | За какво | Статус | Инструкция |
|---|---|---|---|---|
| 1 | Google OAuth (CLIENT_ID + SECRET) | T020 Calendar | ⏳ В процес | [CREDS-SETUP.md § 1](CREDS-SETUP.md#1-google-cloud-oauth--calendar-api) |
| 2 | Resend API key | T012 email | ⏳ Pending | [CREDS-SETUP.md § 2](CREDS-SETUP.md#2-resend--email-notifications) |
| 3 | Vercel env vars (всички Supabase keys) | T010+ deploy | ⏳ Pending | Копирай от `.env.local` в Vercel Project Settings |
| 4 | Admin Gmail (за Supabase Auth) | T021 login | ⏳ Pending | Един email — този с който ще се логваш в admin panel |
| 5 | Rotation на Supabase creds | Security | ⏳ Pending launch | Преди launch: Reset DB password + rotate `sb_secret_` |
| 6 | Домейн `ridewithalex.com` | Launch | ⏳ Pending | Да купиш (не зависи от нас) |
| 7 | Resend domain verification | Email от `alex@ridewithalex.com` | Зависи от #6 | DNS записи след като домейнът е купен |

---

## ⚪ Launch (след Wave 4)

| ID | Задача | Блокер |
|---|---|---|
| ~~T016~~ | ~~SEO (sitemap.xml, robots.txt, OG images, metadata)~~ | ✅ **Done s15** (`26c3e33`) |
| T_DOMAIN | Свързване на `ridewithalex.com` с Vercel | Домейн да е купен (#6) |
| **T025** | **Resend domain verification** (fix за customer confirmation emails) | **T_DOMAIN — blocked** |
| T017 | Final QA + launch checklist | Всички предходни |

**⚠️ Customer emails** — в момента customer confirmation email-ите fail-ват с Resend sandbox 403 (only to account owner). Alex notification работи. Ще се fix-не с T025 след покупка на домейна. Детайли: `docs/orchestrator/tasks/T025-resend-domain-verify.md`.

---

## ❓ Отворени бизнес въпроси (в `STATUS.md`)

Low priority — не блокират Wave 4 изпълнение, но трябва отговор преди launch:

| # | Въпрос |
|---|---|
| Q1 | Кое лого да е активно — **Peak** или **Carve**? (default Peak) |
| Q2 | Детските цени — същите или различни от adult pricing? |
| Q3 | Групови уроци — цена на човек при група? |
| Q4 | Facebook / TikTok / YouTube — има ли активни profile-и? |
| Q5 | Сертификати за `/about` — точни имена + нива (ISIA/BASI/БСС)? |
| Q9 | Terms/Privacy — правен съветник или оставяме boilerplate? |

---

## Rough timeline към launch

При темпо ~1 задача на ден (предвид изпълнение от orchestrator):

1. **Когато Google creds дойдат:** T020 (1 ден) → T010 (1 ден) → готов booking flow
2. **Когато Resend key дойде:** T012 (0.5 ден) → email-и активни
3. **Paralelно:** T021 admin panel (1 ден)
4. **Когато домейнът е купен:** T016 SEO (0.5 ден) + T_DOMAIN DNS (15 мин) + T017 QA (0.5 ден)

**Total остатъчна работа:** ~4-5 дни active execution, разпределени около arrival на твоите creds.

---

## Комуникационен проток

- Ти даваш creds → аз ги валидирам + продължавам
- Ти задаваш въпрос → 1-2 изречения отговор
- Ти казваш "изпълни" → orchestrator execute-self mode (като Wave 3 + T011)
- Ти казваш "пауза" → спирам + всичко е committed за да продължим в нова сесия

---

**Един файл = един план. За jivo състояние винаги провери `STATUS.md`.**
