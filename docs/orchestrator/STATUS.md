# STATUS · RideWithAlex

> Жив kanban на проекта. Обновява се при всяка сесия и при всеки завършен таск.

**Последна актуализация:** 2026-04-24 · Сесия s15 (Wave 4 kickoff — Supabase pivot locked, T011 spec written, execute-self mode)

**Production URL:** [ridewithalex.vercel.app](https://ridewithalex.vercel.app) · auto-deploy on push to `main`

## Общ прогрес

| Фаза | Състояние | Коментар |
|---|---|---|
| Планиране (docs) | ✅ Завършено | 7 документа + brand assets |
| Dev scaffolding + design tokens + i18n + font swap | ✅ Завършено | T001 / T002 / T003 / T018 |
| Vercel deploy | ✅ Завършено | T005 — `ridewithalex.vercel.app` |
| Hero + shared page shell | ✅ Завършено | T004 (hero live) + T019 (SiteNav/Footer/PageShell/PageHeader) |
| **Wave 2** — lessons + pricing + about | ✅ Complete | T006 / T007 / T008 — 3 страници живи на двата locale-а |
| **Wave 3** — contact + gallery + reviews + terms + privacy | ✅ **Complete** | T015 / T013 / T014 / T022 / T023 — всички 5 страници живи, изпълнени от orchestrator (not downstream) |
| **Wave 4** — booking + календар + email + admin | 🟡 Backlog | T010 / T011 / T012 / T020 / T021 — чака creds от Alex |
| Content hotfix (remove Stripe refs from pricing) | ✅ Завършено | T024 (`8b1766f`) — pricing + lessons copy aligned with cash-only model |
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
| T015 | `/contact` + FAQ | [`418bf81`](https://github.com/Crypt0Ninja/RideWithAlex/commit/418bf81) | s14 | orchestrator (Alex request) |
| T013 | `/gallery` страница | [`11e897c`](https://github.com/Crypt0Ninja/RideWithAlex/commit/11e897c) | s14 | orchestrator |
| T014 | `/reviews` страница | [`2afece5`](https://github.com/Crypt0Ninja/RideWithAlex/commit/2afece5) | s14 | orchestrator |
| T022 | `/terms` страница | [`3b4f745`](https://github.com/Crypt0Ninja/RideWithAlex/commit/3b4f745) | s14 | orchestrator |
| T023 | `/privacy` страница | [`dfbad3f`](https://github.com/Crypt0Ninja/RideWithAlex/commit/dfbad3f) | s14 | orchestrator |

## Активни задачи

| ID | Заглавие | Статус | Агент | Блокира |
|---|---|---|---|---|
| QA-V2 | Визуална проверка (всички 9 страници × 2 locale-а) | 🟢 Ready | **Alex (ръчно)** | финално одобрение преди Wave 4 |

**9 страници живи:** `/`, `/lessons`, `/pricing`, `/about`, `/contact`, `/gallery`, `/reviews`, `/terms`, `/privacy` — всички × `en` + `bg` = **18 routes total**. Всички build clean, tsc + lint pass.

## Pipeline (Wave 4 — In Progress, Supabase foundation)

**DB pivot:** Използваме **Supabase** (не Neon) — повече ecosystem (Auth, Realtime, Storage, RLS) за нула допълнителна сложност. Решено s15.

Все още нужни creds от Alex:
- **Google Cloud OAuth** (CLIENT_ID + CLIENT_SECRET) — за Calendar API (T020)
- **Resend** (RESEND_API_KEY) — за email notifications (T012)

Supabase creds (получени s15):
- ✅ `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (sb_publishable_), `SUPABASE_SERVICE_ROLE_KEY` (sb_secret_), `DATABASE_URL` (direct, port 5432)
- ⚠️ `DATABASE_POOL_URL` (Transaction pooler, port 6543) — временно = direct; замяна преди T010 Vercel deploy

| ID | Заглавие | Приоритет | Зависи от |
|---|---|---|---|
| ~~T009~~ | ~~Stripe Checkout~~ | ❌ **Cancelled s13** (cash-only model) | — |
| T011 | **Supabase + Drizzle schema** (time_slots + bookings + RLS) | 🟡 High (foundation, in progress s15) | ✅ Supabase creds |
| T020 | Google Calendar sync (2-way OAuth) | High | T011 + Google OAuth creds |
| T010 | Booking UI (календар + slot picker + phone форма) | High | T011 + T020 |
| T012 | Email (Resend): confirmation към клиент + notify към Alex | Medium | T010 + RESEND_API_KEY |
| T021 | Admin panel (Supabase Auth + view + block slots) | Medium | T011 + T020 |
| ~~T024~~ | ~~Pricing content hotfix~~ | ✅ **Done s14** (`8b1766f`) | — |
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
| Q10 | Google Calendar OAuth creds — кога ще са готови? | Alex | High (T020 blocker) |
| ~~Q11~~ | ~~Neon DB + Resend API keys~~ | ✅ | **Resolved s15** — Supabase вместо Neon (creds получени); Resend остава pending |
| Q12 | Resend API key + verified domain — кога ще са готови? | Alex | Medium (T012 blocker) |
| Q13 | Pooler DATABASE_URL (Transaction mode, port 6543) от Supabase dashboard | Alex | Medium (преди T010 Vercel deploy) |

## Последни 3 промени

1. **2026-04-24 s15** — **Wave 4 kickoff · Supabase pivot.** QA-V2 signed off. Alex избра Supabase вместо Neon. Creds получени в `.env.local`: URL + publishable + secret + DATABASE_URL (direct). Pooler URL pending. Hybrid architecture locked (Drizzle schema + Supabase JS runtime + Supabase Auth). Orchestrator в execute-self mode за Wave 4. `project_wave4_stack.md` memory записан. T011 spec в работа.
2. **2026-04-24 s14** — **Wave 3 Complete + T024 pricing hotfix.** Orchestrator изпълни лично всичките 5 страници: T015 `418bf81` → T013 `11e897c` → T014 `2afece5` → T022 `3b4f745` → T023 `dfbad3f`. Плюс T024 `8b1766f` — премахнати Stripe/caparo references. **18 routes live.**
3. **2026-04-24 s13** — **Wave 3 pivot**: Stripe премахнат (cash-only); Wave 3 пренасочен към 5 static страници.

## За следваща сесия — reminder

**Wave 4 pipeline (Supabase foundation):**
- T011 **Supabase + Drizzle schema** (time_slots + bookings + RLS) — ✅ creds received, in progress s15
- T020 Google Calendar sync (2-way, OAuth) — чака Google creds
- T010 Booking UI (2ч slots, 9:00–17:00, име + телефон)
- T012 Email (Resend — confirmation + notify) — чака Resend creds
- T021 Admin panel (Supabase Auth + list + block часове)

**Остатъчни Wave 4 pre-reqs от Alex:**
- Google Cloud OAuth: CLIENT_ID + CLIENT_SECRET (redirect URI `/api/auth/google/callback`)
- Resend: API key + (eventually) verified domain
- Supabase pooler URL (Transaction mode, port 6543) — преди T010 Vercel deploy

**Business правила за booking (записани в `memory/project_booking_model.md` + `project_wave4_stack.md`):**
- Фиксирани 2ч slot-ове, клиентът може да избира последователни (2ч / 4ч / цял ден / седмица)
- Работни часове 9:00–17:00 всеки ден
- Плащане: кеш на място (БЕЗ онлайн payment)
- Клиентът оставя име + телефон
- Alex получава email notification при нов booking
- Stack: Supabase (DB + Auth + RLS) + Drizzle (schema/migrations) + supabase-js (runtime)

## Легенда

- 🟢 Ready — готов за стартиране
- 🟡 Backlog — в план, но има blocker (creds, QA)
- 🔵 In review — докладът е получен, проверяваме acceptance criteria
- 🔴 Blocked — чака external input
- ✅ Completed — всички criteria покрити
- ❌ Cancelled — отменен от plan
- ⚪ Pending — в pipeline, не е време още
