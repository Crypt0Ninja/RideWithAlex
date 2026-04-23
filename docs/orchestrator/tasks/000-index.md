# Task index

Всички задачи, подредени по ID.

| ID | Заглавие | Статус | Зависи от | Файл |
|---|---|---|---|---|
| T001 | Next.js 15 scaffold | ✅ Completed | — | [T001-nextjs-scaffold.md](T001-nextjs-scaffold.md) |
| T002 | Typography + design tokens + UI primitives | ✅ Completed | T001 ✅ | [T002-design-tokens-ui-primitives.md](T002-design-tokens-ui-primitives.md) |
| T003 | i18n (next-intl, BG/EN) | ✅ Completed (с caveat) | T001 ✅ | [T003-i18n-next-intl.md](T003-i18n-next-intl.md) |
| T004 | Hero секция | ✅ Completed | T002 ✅, T003 ✅, T018 ✅ | [T004-hero-section.md](T004-hero-section.md) |
| T005 | Vercel deploy + preview URL | ✅ Completed | T001 ✅ | [T005-vercel-deploy.md](T005-vercel-deploy.md) |
| T006 | `/lessons` страница | ✅ Completed | T019 ✅ | [T006-lessons-page.md](T006-lessons-page.md) |
| T007 | `/pricing` страница | ✅ Completed (with deviations) | T019 ✅ | [T007-pricing-page.md](T007-pricing-page.md) |
| T008 | `/about` страница | ✅ Completed | T019 ✅ | [T008-about-page.md](T008-about-page.md) |
| T009 | ~~Stripe Checkout~~ | ❌ **Cancelled** (s13 — cash-only bizmодел) | — | — |
| T010 | Booking UI (календар + slot picker + phone форма) | 🟡 Backlog (Wave 4) | T011, T020 | _(спец след Wave 3 + creds от Alex)_ |
| T011 | Neon Postgres + Drizzle schema (time_slots + bookings) | 🟡 Backlog (Wave 4) | — | _(спец след DATABASE_URL от Alex)_ |
| T012 | Email (Resend): confirmation + notification | 🟡 Backlog (Wave 4) | T010 | _(спец след RESEND_API_KEY от Alex)_ |
| T013 | `/gallery` страница | ✅ Completed | T019 ✅ | [T013-gallery-page.md](T013-gallery-page.md) |
| T014 | `/reviews` страница | ✅ Completed | T019 ✅ | [T014-reviews-page.md](T014-reviews-page.md) |
| T015 | `/contact` + FAQ | ✅ Completed | T019 ✅ | [T015-contact-faq-page.md](T015-contact-faq-page.md) |
| T016 | SEO (sitemap, robots, OG images, metadata) | ⚪ Pending | all pages | _(не е дефиниран)_ |
| T017 | QA + launch | ⚪ Pending | all | _(не е дефиниран)_ |
| T018 | Font swap (Readex Pro → Onest за cyrillic) | ✅ Completed | T003 ✅ | [T018-font-swap-cyrillic.md](T018-font-swap-cyrillic.md) |
| T019 | Shared page shell (SiteNav/Footer/Shell/Header) | ✅ Completed | T002 ✅, T003 ✅, T004 ✅, T018 ✅ | [T019-shared-page-shell.md](T019-shared-page-shell.md) |
| T020 | Google Calendar sync (2-way) | 🟡 Backlog (Wave 4) | T011 | _(спец след OAuth creds от Alex)_ |
| T021 | Admin panel (view + block slots) | 🟡 Backlog (Wave 4) | T011, T020 | _(спец след Wave 4 foundation)_ |
| T022 | `/terms` страница | ✅ Completed | T019 ✅ | [T022-terms-page.md](T022-terms-page.md) |
| T023 | `/privacy` страница | ✅ Completed | T019 ✅ | [T023-privacy-page.md](T023-privacy-page.md) |
| T024 | Pricing content hotfix (махане на Stripe/капаро references) | ✅ Completed | Wave 3 ✅ | s14 · `8b1766f` (orchestrator) |
| T_DOMAIN | Custom домейн `ridewithalex.com` | 🔴 Blocked | Alex да купи домейна | — |

## Групи

**Wave 2** ✅ Complete — T006 / T007 / T008 (lessons, pricing, about)

**Wave 3** ✅ Complete — T015 / T013 / T014 / T022 / T023 (5 статични страници, всички живи)
- Sequential изпълнение работи — нула merge конфликти, нула deviation-и
- Orchestrator изпълни задачите лично (не downstream) — повишена скорост + контрол

**Wave 4** 🟡 Backlog — booking/календар/email/admin (T010/T011/T012/T020/T021)
- **Blocker:** нужни creds от Alex преди старт
  - Google Cloud OAuth (CLIENT_ID + SECRET)
  - Neon Postgres (DATABASE_URL)
  - Resend API key (RESEND_API_KEY)
- **След Wave 4:** T024 pricing hotfix (премахва "30% капаро онлайн" wording)

**Launch** ⚪ Pending — T016 SEO + T017 QA + T_DOMAIN

> Оркестраторът дефинира пълна спецификация на следваща задача само когато нейните зависимости са готови.
