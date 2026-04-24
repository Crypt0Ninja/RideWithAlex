# Session s15 · 2026-04-24 · Wave 4 kickoff — Supabase pivot + T011 foundation

## Context в началото

s14 затвори с 18 routes live (9 страници × 2 locale-а) + T024 pricing hotfix. Единствената отворена задача беше **QA-V2** — визуална проверка от Alex.

## Ключови събития

### 1. QA-V2 signed off

Alex: *"Всичко е прегледано нека продължим с плана"* — QA-V2 минава без open issues. Wave 4 unblocked.

### 2. Supabase pivot

Alex: *"...имам едно важно условие няма да използвам Neon Postgres а Supabase"*

Решение: Wave 4 използва **Supabase** вместо Neon.

**Архитектурен разговор:**

Предложих hybrid pattern:
- **Drizzle ORM** за schema + migrations (type-safe, versioned в git)
- **`@supabase/supabase-js`** за runtime data access (RLS + realtime + session context "безплатно")
- **Supabase Auth** за admin login (един user = Alex) вместо custom auth
- **RLS policies:** public SELECT на `time_slots`, anon INSERT на `bookings`, service_role full access

Alex: *"v1 както би било най добре!"* — hybrid locked.

### 3. Creds collection

Alex предостави Supabase creds **директно в чата** (security flag записан — trebva да се rotate преди production launch):

- `NEXT_PUBLIC_SUPABASE_URL` — derived от project ref `jfccgssbodkqzivhxpzk`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `sb_publishable_...` (new format)
- `SUPABASE_SERVICE_ROLE_KEY` — `sb_secret_...` (new format)
- `DATABASE_URL` — direct connection (port 5432)
- Двойни quadrati brackets около password (`[u8n$D,45,rHs%#D]`) — определях че са placeholder артефакти; взех паролата без скобите + URL-encoded-нах special символите (`$`, `,`, `#`, `%`)
- `DATABASE_POOL_URL` — ⚠️ Alex paste-на пак direct (port 5432), не Transaction pooler (port 6543). Запазен temporarily = direct; замяна преди T010 Vercel deploy (трекнат като Q13 в STATUS.md)

`.env.local` създаден (вече съществуваше с `GITHUB_TOKEN` + `VERCEL_TOKEN`) — Supabase секцията append-ната. Git проверка потвърди `.gitignore:16` покрива — нула leak risk.

### 4. Execute-self mode activated

Alex: *"Постъпи както би било най добре!"* — явна делегация на execution.

Per `feedback_orchestrator_can_code.md`, приех execute-self mode за Wave 4, същата логика като s14 Wave 3.

### 5. Docs-first execution

Последователност:
1. `memory/project_wave4_stack.md` — нов project memory за Supabase + hybrid decision
2. `memory/MEMORY.md` — pointer добавен
3. `memory/project_booking_model.md` — обновен: "Neon + Drizzle" → "Supabase + Drizzle"
4. `docs/orchestrator/STATUS.md` — Wave 4 section rewrite (pipeline, Q10/Q11/Q12/Q13, pre-reqs, reminders)
5. `docs/orchestrator/tasks/000-index.md` — T011 description + Wave 4 group обновени
6. `docs/orchestrator/STARTUP_PROMPT.md` — Wave 4 section + open questions обновени
7. `docs/orchestrator/tasks/T011-supabase-drizzle-schema.md` — self-contained spec написан (in T015-style format)

### 6. T011 execution — pending

Следващ стъпка в тази сесия: commit docs, после execute T011:
- Install: `drizzle-orm`, `postgres`, `@supabase/supabase-js`, `@supabase/ssr`, `drizzle-kit`, `tsx`, `dotenv`
- Schema: `db/schema.ts` (time_slots + bookings + 3 enums)
- DB client: `db/index.ts` (postgres.js с `prepare: false`, `max: 1`)
- Supabase clients: `lib/supabase/server.ts` + `lib/supabase/client.ts`
- Drizzle config: `drizzle.config.ts` с dotenv
- Migration: `drizzle-kit generate` → append RLS → `drizzle-kit migrate`
- Verify: build/tsc/lint + Supabase Table Editor check

## Особености / notes

**Password URL-encoding:** Supabase auto-generated password съдържа `$`, `,`, `#`, `%` — всички special в URL context. `#` е най-критичният (fragment indicator). URL-encoded: `u8n%24D%2C45%2CrHs%25%23D`. Ако `postgres.js` автоматично URL-декодира на connection time, може да има conflict — ако T011 migrate failva, първата проверка ще е да върнем raw парола + test.

**Key format избор:** Supabase наскоро въведе `sb_publishable_` + `sb_secret_` format за API keys (PR 2025). Работи с `@supabase/supabase-js` v2.39+. Legacy `eyJhbGc...` JWT format също се поддържа. Използваме новия format — по-чист + forward-compatible.

**RLS approach:** Drizzle не генерира RLS policies, защото те са Supabase-specific. Choice: append RLS SQL към generated migration file ИЛИ отделен `0001_rls.sql`. Избирам append към `0000_xxx.sql` — една атомична migration вместо две.

**Open question Q13:** Alex не намери лесно Transaction pooler URL в Supabase dashboard. Direct URL (port 5432) работи за migrations + local dev. Pooler (port 6543) ще е необходим преди T010 deploys to Vercel. Не блокира T011.

## Commits в тази сесия (pending)

1. `docs(s15): wave 4 kickoff · supabase pivot · T011 spec` — всички doc updates
2. `feat(T011): supabase foundation with drizzle schema + rls` — execution

## Следваща стъпка

След T011 commit:
- ⏳ Alex да предостави Google OAuth creds → T020 unblocks
- ⏳ Alex да предостави Resend API key → T012 unblocks
- ⏳ Alex да намери Transaction pooler URL → готов за T010 Vercel deploy
- 🟢 T010 Booking UI spec може да се напише паралелно със събиране на creds (frontend-heavy, не зависи от external APIs директно)
