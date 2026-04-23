# STATUS · RideWithAlex

> Жив kanban на проекта. Обновява се при всяка сесия и при всеки завършен таск.

**Последна актуализация:** 2026-04-23 · Сесия s06

**Production URL:** [ridewithalex.vercel.app](https://ridewithalex.vercel.app) · auto-deploy on push to `main`

## Общ прогрес

| Фаза | Състояние | Коментар |
|---|---|---|
| Планиране (docs) | ✅ Завършено | 7 документа + brand assets |
| Orchestrator setup | ✅ Завършено | Система активна, s01 документирана |
| Dev scaffolding | ✅ Завършено | T001 — Next.js 15 + Tailwind v4 + Readex Pro |
| Typography + design tokens | ✅ Завършено | T002 — cn, Button, NavPill, StatBlock, hero-title utility |
| i18n (BG/EN) | ✅ Завършено | T003 — next-intl, `[locale]`, middleware, LocaleSwitcher |
| Font swap (cyrillic fix) | ✅ Завършено | T018 — Onest заменя Readex Pro; cyrillic поддържан |
| Hero секция | ⚪ Чака | T004 — следващата задача (готов спец) |
| Vercel deploy | ✅ Завършено | T005 — `ridewithalex.vercel.app`, 47s build, auto-deploy on push |
| Страници (lessons, pricing, about) | ⚪ Чака | T006-T008 |
| Booking + Stripe | ⚪ Чака | T009-T011 |
| Launch | ⚪ Чака | T016-T017 |

## Завършени задачи

| ID | Заглавие | Commit | Сесия | Агент |
|---|---|---|---|---|
| T001 | Next.js 15 scaffold | [`8d7133e`](https://github.com/Crypt0Ninja/RideWithAlex/commit/8d7133e) | s02 | agent 1 |
| T002 | Design tokens + UI primitives | [`f105ef8`](https://github.com/Crypt0Ninja/RideWithAlex/commit/f105ef8) | s03 | agent 2 |
| T003 | i18n (next-intl BG/EN) | [`fd93272`](https://github.com/Crypt0Ninja/RideWithAlex/commit/fd93272) | s04 | agent 3 · с caveat → T018 |
| T018 | Font swap Readex Pro → Onest | [`b9faac6`](https://github.com/Crypt0Ninja/RideWithAlex/commit/b9faac6) | s05 | agent 4 · wider sweep, all valid |
| T005 | Vercel deploy + preview URL | n/a (infra) | s06 | orchestrator via API · `ridewithalex.vercel.app` |

## Активни задачи

| ID | Заглавие | Статус | Агент | Блокира |
|---|---|---|---|---|
| T004 | Hero секция | 🟢 Ready | downstream | launch |

## Pipeline (в план)

| ID | Заглавие | Приоритет | Зависи от |
|---|---|---|---|
| ~~T002~~ | ~~Typography + design tokens + UI primitives~~ | ~~High~~ | ✅ **Done** (`f105ef8`) |
| ~~T003~~ | ~~i18n setup (next-intl)~~ | ~~High~~ | ✅ **Done** (`fd93272`) с caveat → T018 |
| ~~T004~~ | ~~Hero секция~~ | **Critical** | ✅ Unblocked — готов за изпълнение |
| ~~T005~~ | ~~Vercel deploy + preview URL~~ | ~~High~~ | ✅ **Done** s06 — `ridewithalex.vercel.app` |
| T006 | `/lessons` страница | Medium | T002 |
| T007 | `/pricing` страница (4-те пакета) | Medium | T002 |
| T008 | `/about` страница (био + сертификати) | Medium | T002 |
| T009 | Stripe Checkout интеграция (test mode) | High | T001 |
| T010 | Booking форма + календар | High | T009 |
| T011 | Neon Postgres + Drizzle schema | High | T010 |
| T012 | Email темплейти (Resend + React Email) | Medium | T010 |
| T013 | `/gallery` страница | Low | T002 |
| T014 | `/reviews` страница | Low | T002 |
| T015 | `/contact` + FAQ | Medium | T002 |
| T016 | SEO (sitemap, robots, OG images, metadata) | Medium | All pages |
| T017 | QA + launch prep | Critical | All previous |

## Блокери / Отворени въпроси

| # | Въпрос | Чака от | Приоритет |
|---|---|---|---|
| Q1 | Кой логото да е активно — **Peak** или **Carve**? (по подразбиране Peak) | Alex | Low (може да се смени по всяко време) |
| Q2 | Детските пакети — същите ли са цени или различни? | Alex | Medium (трябва за T007) |
| Q3 | Групови уроци — цена на човек при група? | Alex | Medium (за T007) |
| Q4 | Facebook / TikTok / YouTube — има ли? | Alex | Low |
| Q5 | Сертификати — кой точно? (ISIA/BASI/БСС + нива) | Alex | Medium (за T008) |
| Q6 | Stripe — има ли ЕТ/ЕООД или самоосигуряване? | Alex | High (blocker за live launch, не за dev) |
| Q7 | Домейн `ridewithalex.com` — купен ли е? | Alex | Medium (blocker за launch, не за dev) |
| ~~Q8~~ | ~~Шрифт Onest OK ли е?~~ | ✅ | **Resolved s05** — Onest shipped в T018, визуално потвърдено |

## Последни 3 промени

1. **2026-04-23 s06** — T005 завършен изцяло чрез Vercel API от оркестратора (не ръчно) — проект `ridewithalex` създаден, git linked към `Crypt0Ninja/RideWithAlex`, първи production deploy за 47s, SSO Protection изключена → публично достъпно на [ridewithalex.vercel.app](https://ridewithalex.vercel.app). Auto-deploy на push към `main` активен.
2. **2026-04-23 s05** — T018 завършен (commit `b9faac6`) — Onest замени Readex Pro навсякъде, кирилица работи.
3. **2026-04-23 s02–s04** — T001/T002/T003 серия (scaffold → design tokens → i18n).

## Легенда

- 🟢 Ready — готов за стартиране
- 🟡 In progress — в ход
- 🔵 In review — докладът е получен, проверяваме acceptance criteria
- 🔴 Blocked — чака external input
- ✅ Completed — всички criteria покрити
- ⚪ Pending — в pipeline, не е време още
