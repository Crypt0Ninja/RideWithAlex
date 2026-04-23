# STATUS · RideWithAlex

> Жив kanban на проекта. Обновява се при всяка сесия и при всеки завършен таск.

**Последна актуализация:** 2026-04-23 · Сесия s11 (T008 accepted; T007 merged чака report)

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
| Hero секция | ✅ Завършено | T004 — video, staggered text, navbar, stats; live на Vercel |
| Vercel deploy | ✅ Завършено | T005 — `ridewithalex.vercel.app`, 47s build, auto-deploy on push |
| Shared page shell | ✅ Завършено | T019 — SiteNav/Footer/PageShell/PageHeader + footer messages |
| `/lessons` страница | ✅ Завършено | T006 — 3 lesson type карти + CTA; live на /en/lessons + /bg/lessons |
| `/about` страница | ✅ Завършено | T008 — bio, why-me, certifications, cta; live на /en/about + /bg/about |
| `/pricing` страница | 🔵 Merged — чака report | T007 — `a3eb13a` в main, downstream report не е получен |
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
| T004 | Hero секция | [`fe3d1c0`](https://github.com/Crypt0Ninja/RideWithAlex/commit/fe3d1c0) | s07 | agent 5 · zero deviations, ~15min |
| T019 | Shared page shell | [`1763786`](https://github.com/Crypt0Ninja/RideWithAlex/commit/1763786) | s10 | agent 6 · zero deviations, ~15min |
| T006 | `/lessons` страница | [`5938ec7`](https://github.com/Crypt0Ninja/RideWithAlex/commit/5938ec7) | s11 | agent 7 · ~10min + spec-typo hotfix |
| T008 | `/about` страница | [`8ea90ed`](https://github.com/Crypt0Ninja/RideWithAlex/commit/8ea90ed) | s11 | agent 9 · ~40min, messages/*.json в T007 commit (race condition) |

## Активни задачи

| ID | Заглавие | Статус | Агент | Блокира |
|---|---|---|---|---|
| QA-V1 | Визуална проверка на hero-то в Chrome/Safari | 🟢 Ready | **Alex (ръчно)** | финално одобрение (non-blocking за pipeline) |
| **T007** | **`/pricing` страница** | 🔵 **Merged — чака report** | downstream (code в `a3eb13a`) | — |

## Pipeline (в план)

| ID | Заглавие | Приоритет | Зависи от |
|---|---|---|---|
| ~~T002~~ | ~~Typography + design tokens + UI primitives~~ | ~~High~~ | ✅ **Done** (`f105ef8`) |
| ~~T003~~ | ~~i18n setup (next-intl)~~ | ~~High~~ | ✅ **Done** (`fd93272`) с caveat → T018 |
| ~~T004~~ | ~~Hero секция~~ | ~~Critical~~ | ✅ **Done** (`fe3d1c0`) |
| ~~T005~~ | ~~Vercel deploy + preview URL~~ | ~~High~~ | ✅ **Done** s06 — `ridewithalex.vercel.app` |
| ~~T006~~ | ~~`/lessons` страница~~ | ~~Medium — Wave 2 parallel~~ | ✅ **Done** (`5938ec7`) |
| ~~T007~~ | ~~`/pricing` страница~~ | ~~Medium — Wave 2 parallel~~ | 🔵 merged в `a3eb13a`, чака report |
| ~~T008~~ | ~~`/about` страница~~ | ~~Medium — Wave 2 parallel~~ | ✅ **Done** (`8ea90ed`) |
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

1. **2026-04-23 s11** — **T008 приет (`8ea90ed`)** ~40 мин; `/about` е жив за двата locale-а (bio / why-me / certifications / cta). T007 също е merged (`a3eb13a`) но downstream report не е получен. **Caveat:** race condition между T007/T008 върху `messages/*.json` — about namespace-а попадна в T007 commit, not in T008's. Функционално OK; workflow policy за shared files да се преразгледа преди Wave 3.
2. **2026-04-23 s11** — **T006 приет (`5938ec7`)** ~10 мин; `/lessons` е жив за двата locale-а. Spec-typo в BG-то (`chaeркинг` → `карвинг`) — hotfix в working tree, влезна с T007 commit.
3. **2026-04-23 s10** — **T019 приет (`1763786`)** + Wave 2 задачите готови. Shared primitives shipped zero deviations за ~15 мин.

## Легенда

- 🟢 Ready — готов за стартиране
- 🟡 In progress — в ход
- 🔵 In review — докладът е получен, проверяваме acceptance criteria
- 🔴 Blocked — чака external input
- ✅ Completed — всички criteria покрити
- ⚪ Pending — в pipeline, не е време още
