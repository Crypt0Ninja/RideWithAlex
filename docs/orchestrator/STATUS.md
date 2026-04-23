# STATUS · RideWithAlex

> Жив kanban на проекта. Обновява се при всяка сесия и при всеки завършен таск.

**Последна актуализация:** 2026-04-23 · Сесия s01

## Общ прогрес

| Фаза | Състояние | Коментар |
|---|---|---|
| Планиране (docs) | ✅ Завършено | 7 документа + brand assets |
| Orchestrator setup | 🟡 В ход | Този файл се създава сега |
| Dev scaffolding | ⚪ Чака | T001 готов за стартиране |
| Hero секция | ⚪ Чака | T004 |
| Страници (lessons, pricing, about) | ⚪ Чака | T006-T008 |
| Booking + Stripe | ⚪ Чака | T009-T011 |
| Launch | ⚪ Чака | T016-T017 |

## Активни задачи

| ID | Заглавие | Статус | Агент | Блокира |
|---|---|---|---|---|
| T001 | Next.js 15 scaffold | 🟢 Ready | — (чака downstream) | T002-T017 |

## Pipeline (в план)

| ID | Заглавие | Приоритет | Зависи от |
|---|---|---|---|
| T002 | Typography + base design tokens (Readex Pro, Tailwind config) | High | T001 |
| T003 | i18n setup (next-intl, BG/EN routing) | High | T001 |
| T004 | Hero секция (видео + staggered text + pill navbar + stat blocks) | **Critical** | T001, T002 |
| T005 | Vercel deploy + preview URL | High | T001 |
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

1. **2026-04-23 s01** — Планиране приключи: 7 документа, brand assets, orchestrator система, git repo свързан
2. _—_
3. _—_

## Легенда

- 🟢 Ready — готов за стартиране
- 🟡 In progress — в ход
- 🔵 In review — докладът е получен, проверяваме acceptance criteria
- 🔴 Blocked — чака external input
- ✅ Completed — всички criteria покрити
- ⚪ Pending — в pipeline, не е време още
