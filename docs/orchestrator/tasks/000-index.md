# Task index

Всички задачи, подредени по ID.

| ID | Заглавие | Статус | Зависи от | Файл |
|---|---|---|---|---|
| T001 | Next.js 15 scaffold | ✅ Completed | — | [T001-nextjs-scaffold.md](T001-nextjs-scaffold.md) |
| T002 | Typography + design tokens + UI primitives | ✅ Completed | T001 ✅ | [T002-design-tokens-ui-primitives.md](T002-design-tokens-ui-primitives.md) |
| T003 | i18n (next-intl, BG/EN) | ✅ Completed (с caveat) | T001 ✅ | [T003-i18n-next-intl.md](T003-i18n-next-intl.md) |
| T004 | Hero секция | ✅ Completed | T002 ✅, T003 ✅, T018 ✅ | [T004-hero-section.md](T004-hero-section.md) |
| T005 | Vercel deploy + preview URL | 🟢 Ready (manual, Alex) | T001 ✅ | [T005-vercel-deploy.md](T005-vercel-deploy.md) |
| T006 | `/lessons` страница | ✅ Completed | T019 ✅ | [T006-lessons-page.md](T006-lessons-page.md) |
| T007 | `/pricing` страница | ✅ Completed (with deviations) | T019 ✅ | [T007-pricing-page.md](T007-pricing-page.md) |
| T008 | `/about` страница | 🟢 Ready | T019 ✅ | [T008-about-page.md](T008-about-page.md) |
| T009 | Stripe Checkout (test mode) | ⚪ Pending | T001 | _(не е дефиниран)_ |
| T010 | Booking форма + календар | ⚪ Pending | T009 | _(не е дефиниран)_ |
| T011 | Neon Postgres + Drizzle | ⚪ Pending | T010 | _(не е дефиниран)_ |
| T012 | Email (Resend + React Email) | ⚪ Pending | T010 | _(не е дефиниран)_ |
| T013 | `/gallery` | ⚪ Pending | T002 | _(не е дефиниран)_ |
| T014 | `/reviews` | ⚪ Pending | T002 | _(не е дефиниран)_ |
| T015 | `/contact` + FAQ | ⚪ Pending | T002 | _(не е дефиниран)_ |
| T016 | SEO (sitemap, OG, metadata) | ⚪ Pending | all pages | _(не е дефиниран)_ |
| T017 | QA + launch | ⚪ Pending | all | _(не е дефиниран)_ |
| T018 | Font swap (Readex Pro → Onest за cyrillic) | ✅ Completed | T003 ✅ | [T018-font-swap-cyrillic.md](T018-font-swap-cyrillic.md) |
| T019 | Shared page shell (SiteNav/Footer/Shell/Header) | ✅ Completed | T002 ✅, T003 ✅, T004 ✅, T018 ✅ | [T019-shared-page-shell.md](T019-shared-page-shell.md) |

> Оркестраторът дефинира пълна спецификация на следваща задача само когато нейните зависимости са готови (или паралелно, ако няма зависимости).
