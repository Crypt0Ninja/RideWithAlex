# STATUS · RideWithAlex

> Жив kanban на проекта. Обновява се при всяка сесия и при всеки завършен таск.

**Последна актуализация:** 2026-04-24 · Сесия s13 (Wave 3 pivot — 5 static pages; Stripe cancelled; Wave 4 backlog)

**Production URL:** [ridewithalex.vercel.app](https://ridewithalex.vercel.app) · auto-deploy on push to `main`

## Общ прогрес

| Фаза | Състояние | Коментар |
|---|---|---|
| Планиране (docs) | ✅ Завършено | 7 документа + brand assets |
| Dev scaffolding + design tokens + i18n + font swap | ✅ Завършено | T001 / T002 / T003 / T018 |
| Vercel deploy | ✅ Завършено | T005 — `ridewithalex.vercel.app` |
| Hero + shared page shell | ✅ Завършено | T004 (hero live) + T019 (SiteNav/Footer/PageShell/PageHeader) |
| **Wave 2** — lessons + pricing + about | ✅ Complete | T006 / T007 / T008 — 3 страници живи на двата locale-а |
| **Wave 3** — contact + gallery + reviews + terms + privacy | 🟢 **Ready** | T015 / T013 / T014 / T022 / T023 — 5 статични страници, sequential |
| **Wave 4** — booking + календар + email + admin | 🟡 Backlog | T010 / T011 / T012 / T020 / T021 — чака creds от Alex |
| Content hotfix (remove Stripe refs from pricing) | 🟡 Backlog (5 мин) | T024 — след Wave 3 |
| SEO + launch | ⚪ Pending | T016 + T017 + T_DOMAIN |

## Завършени задачи

| ID | Заглавие | Commit | Сесия | Агент |
|---|---|---|---|---|
| T001 | Next.js 15 scaffold | [`8d7133e`](https://github.com/Crypt0Ninja/RideWithAlex/commit/8d7133e) | s02 | agent 1 |
| T002 | Design tokens + UI primitives | [`f105ef8`](https://github.com/Crypt0Ninja/RideWithAlex/commit/f105ef8) | s03 | agent 2 |
| T003 | i18n (next-intl BG/EN) | [`fd93272`](https://github.com/Crypt0Ninja/RideWithAlex/commit/fd93272) | s04 | agent 3 |
| T018 | Font swap Readex Pro → Onest | [`b9faac6`](https://github.com/Crypt0Ninja/RideWithAlex/commit/b9faac6) | s05 | agent 4 |
| T005 | Vercel deploy + preview URL | n/a (infra) | s06 | orchestrator via API |
| T004 | Hero секция | [`fe3d1c0`](https://github.com/Crypt0Ninja/RideWithAlex/commit/fe3d1c0) | s07 | agent 5 · zero deviations |
| T019 | Shared page shell | [`1763786`](https://github.com/Crypt0Ninja/RideWithAlex/commit/1763786) | s10 | agent 6 · zero deviations |
| T006 | `/lessons` страница | [`5938ec7`](https://github.com/Crypt0Ninja/RideWithAlex/commit/5938ec7) | s11 | agent 7 |
| T008 | `/about` страница | [`8ea90ed`](https://github.com/Crypt0Ninja/RideWithAlex/commit/8ea90ed) | s11 | agent 9 |
| T007 | `/pricing` страница | [`a3eb13a`](https://github.com/Crypt0Ninja/RideWithAlex/commit/a3eb13a) | s12 | agent 8 · 2 deviations |

## Активни задачи (Wave 3 — 5 статични страници, sequential)

| ID | Заглавие | Статус | Агент | Препоръчан ред |
|---|---|---|---|---|
| **T015** | **`/contact` + FAQ** | 🟢 **Ready** | downstream (pending) | **1-ви** (най-полезен, бизнес value) |
| **T013** | **`/gallery` страница** | 🟢 **Ready** | downstream (pending) | 2-ри (placeholder съдържание) |
| **T014** | **`/reviews` страница** | 🟢 **Ready** | downstream (pending) | 3-ти (placeholder отзиви) |
| **T022** | **`/terms` страница** | 🟢 **Ready** | downstream (pending) | 4-ти (legal boilerplate) |
| **T023** | **`/privacy` страница** | 🟢 **Ready** | downstream (pending) | 5-ти (GDPR boilerplate) |
| QA-V1 | Визуална проверка (hero + Wave 2 страници) | 🟢 Ready | **Alex (ръчно)** | паралелно, non-blocking |

> **Важно:** Sequential след Wave 2 race lessons — пусни 1 агент, прие доклад, обнови docs, пусни следващ.

## Pipeline (Wave 4 — Backlog, нужни creds от Alex)

Преди да стартира Wave 4, Alex трябва да предостави:
- **Google Cloud OAuth** (CLIENT_ID + CLIENT_SECRET) — за Calendar API
- **Neon Postgres** (DATABASE_URL) — за persistence
- **Resend** (RESEND_API_KEY) — за email notifications

| ID | Заглавие | Приоритет | Зависи от |
|---|---|---|---|
| ~~T009~~ | ~~Stripe Checkout~~ | ❌ **Cancelled s13** (cash-only model) | — |
| T011 | Neon Postgres + Drizzle schema (time_slots + bookings) | High (foundation) | DATABASE_URL от Alex |
| T020 | Google Calendar sync (2-way) | High | T011 + OAuth creds |
| T010 | Booking UI (календар + slot picker + phone форма) | High | T011 + T020 |
| T012 | Email (Resend): confirmation към клиент + notify към Alex | Medium | T010 + RESEND_API_KEY |
| T021 | Admin panel (view + block slots) | Medium | T011 + T020 |
| T024 | Pricing content hotfix (махане на Stripe/капаро references) | Low (5 мин) | Wave 3 accept |
| T016 | SEO (sitemap, robots, OG images, metadata) | Medium | All pages |
| T017 | QA + launch prep | Critical | All previous |
| T_DOMAIN | Custom домейн `ridewithalex.com` | Blocker за launch | Alex да купи |

## Блокери / Отворени въпроси

| # | Въпрос | Чака от | Приоритет |
|---|---|---|---|
| Q1 | Кой логото да е активно — **Peak** или **Carve**? (default Peak) | Alex | Low |
| Q2 | Детските пакети — същите ли са цени или различни? | Alex | Medium |
| Q3 | Групови уроци — цена на човек при група? | Alex | Medium |
| Q4 | Facebook / TikTok / YouTube — има ли? | Alex | Low (за T015 footer links) |
| Q5 | Сертификати — кой точно? (ISIA/BASI/БСС + нива) | Alex | Medium |
| ~~Q6~~ | ~~Stripe — има ли ЕТ/ЕООД?~~ | ✅ | **Resolved s13** — Stripe премахнат, cash-only |
| Q7 | Домейн `ridewithalex.com` — купен ли е? | Alex | Medium |
| ~~Q8~~ | ~~Шрифт Onest OK ли е?~~ | ✅ | **Resolved s05** |
| Q9 | Terms & Privacy — има ли правен съветник или използваме boilerplate? | Alex | Medium (за T022/T023 launch) |
| Q10 | Google Calendar OAuth creds — кога ще са готови? | Alex | High (Wave 4 blocker) |
| Q11 | Neon DB + Resend API keys — кога ще са готови? | Alex | High (Wave 4 blocker) |

## Последни 3 промени

1. **2026-04-24 s13** — **Wave 3 pivot**: Alex премахна Stripe от плана (cash-only бизнес модел); Wave 3 пренасочен към 5 статични страници (T015/T013/T014/T022/T023); Wave 4 backlog-ът (T010/T011/T012/T020/T021) чака creds за Google Cloud / Neon / Resend. 5 спецификации написани.
2. **2026-04-23 s12** — **T007 приет** (`a3eb13a`), 2 documented deviations; Wave 2 Complete.
3. **2026-04-23 s11** — **T006 + T008 приемане**; race condition на messages/*.json → feedback memory записано.

## За следваща сесия — reminder

**Booking/календар pipeline (Wave 4):**
- T011 Neon Postgres + Drizzle schema (foundation)
- T020 Google Calendar sync (2-way, OAuth)
- T010 Booking UI (2ч slots, 9:00–17:00, име + телефон)
- T012 Email (Resend — confirmation + notify)
- T021 Admin panel (list + block часове)

**Пре-Wave 4 pre-reqs от Alex:**
- Google Cloud OAuth: CLIENT_ID + CLIENT_SECRET (redirect URI `/api/auth/google/callback`)
- Neon: DATABASE_URL
- Resend: API key

**Business правила за booking (записани в `memory/project_booking_model.md`):**
- Фиксирани 2ч slot-ове, клиентът може да избира последователни (2ч / 4ч / цял ден / седмица)
- Работни часове 9:00–17:00 всеки ден
- Плащане: кеш на място (БЕЗ онлайн payment)
- Клиентът оставя име + телефон
- Alex получава email notification при нов booking

**Content hotfix напомняне:** `messages/{en,bg}.json` имат Stripe references в pricing блока (`pricing.note.deposit`, `pricing.subtitle`, `pricing.cta.subtitle`) + `lessons.cta.subtitle`. Да се обновят в T024 след Wave 3 (или като част от T010).

## Легенда

- 🟢 Ready — готов за стартиране
- 🟡 Backlog — в план, но има blocker (creds, QA)
- 🔵 In review — докладът е получен, проверяваме acceptance criteria
- 🔴 Blocked — чака external input
- ✅ Completed — всички criteria покрити
- ❌ Cancelled — отменен от plan
- ⚪ Pending — в pipeline, не е време още
