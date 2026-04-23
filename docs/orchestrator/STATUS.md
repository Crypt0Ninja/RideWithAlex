# STATUS · RideWithAlex

> Жив kanban на проекта. Обновява се при всяка сесия и при всеки завършен таск.

**Последна актуализация:** 2026-04-23 · Сесия s03

## Общ прогрес

| Фаза | Състояние | Коментар |
|---|---|---|
| Планиране (docs) | ✅ Завършено | 7 документа + brand assets |
| Orchestrator setup | ✅ Завършено | Система активна, s01 документирана |
| Dev scaffolding | ✅ Завършено | T001 — Next.js 15 + Tailwind v4 + Readex Pro |
| Typography + design tokens | ✅ Завършено | T002 — cn, Button, NavPill, StatBlock, hero-title utility |
| i18n (BG/EN) | 🟡 В ход | T003 пуснат паралелно, чака доклад |
| Hero секция | ⚪ Чака | T004 |
| Vercel deploy | ⚪ Чака | T005 (паралелно с T002/T003) |
| Страници (lessons, pricing, about) | ⚪ Чака | T006-T008 |
| Booking + Stripe | ⚪ Чака | T009-T011 |
| Launch | ⚪ Чака | T016-T017 |

## Завършени задачи

| ID | Заглавие | Commit | Сесия | Агент |
|---|---|---|---|---|
| T001 | Next.js 15 scaffold | [`8d7133e`](https://github.com/Crypt0Ninja/RideWithAlex/commit/8d7133e) | s02 | agent 1 |
| T002 | Design tokens + UI primitives | [`f105ef8`](https://github.com/Crypt0Ninja/RideWithAlex/commit/f105ef8) | s03 | agent 2 |

## Активни задачи

| ID | Заглавие | Статус | Агент | Блокира |
|---|---|---|---|---|
| T003 | i18n (next-intl BG/EN) | 🟡 In progress | downstream (паралелно с T002) | T004, всички страници |
| T005 | Vercel deploy + preview URL | 🟢 Ready | **Alex (ръчно)** | launch flow |

## Pipeline (в план)

| ID | Заглавие | Приоритет | Зависи от |
|---|---|---|---|
| ~~T002~~ | ~~Typography + design tokens + UI primitives~~ | ~~High~~ | ✅ **Done** (`f105ef8`) |
| T003 | i18n setup (next-intl, BG/EN routing, [locale] segment) | High | 🟡 **In progress** |
| T004 | Hero секция (видео + staggered text + pill navbar + stat blocks) | **Critical** | T002 ✅, T003 🟡 — **½ unblocked** |
| T005 | Vercel deploy + preview URL | High | T001 ✅ — **unblocked** |
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

## Последни 3 промени

1. **2026-04-23 s02** — T001 завършен (commit `8d7133e`) — Next.js 15, TS strict, Tailwind v4, Readex Pro 300-700, favicon, `/` рендерира `ridewithalex`. 5 приети отклонения (next/font self-host, gitignore extras, metadata.icons). Unlock-ва T002, T003, T005.
2. **2026-04-23 s01** — Планиране приключи: 7 документа, brand assets, orchestrator система, git repo свързан (commits `abf74e3`, `a6bc1cd`)
3. _—_

## Легенда

- 🟢 Ready — готов за стартиране
- 🟡 In progress — в ход
- 🔵 In review — докладът е получен, проверяваме acceptance criteria
- 🔴 Blocked — чака external input
- ✅ Completed — всички criteria покрити
- ⚪ Pending — в pipeline, не е време още
