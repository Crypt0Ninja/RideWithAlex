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

### 6. T011 execution — ✅ completed

Commit `d1f3ac6` — `feat(T011): supabase foundation with drizzle schema + rls`.

**Packages installed:** 4 runtime (`drizzle-orm`, `postgres`, `@supabase/supabase-js`, `@supabase/ssr`) + 3 dev (`drizzle-kit`, `tsx`, `dotenv`).

**Файлове създадени:**
- `db/schema.ts` (79 lines) — 2 tables, 3 enums, 5 indexes, 4 TS types
- `db/index.ts` (20 lines) — Drizzle + postgres.js client with `prepare: false`
- `db/migrations/0000_tired_swordsman.sql` (39 lines) — DDL + RLS appended
- `db/migrations/meta/*` — drizzle journal + snapshot
- `db/rls.sql` (34 lines) — RLS policies reference copy
- `drizzle.config.ts` — root config with dotenv
- `lib/supabase/server.ts` (45 lines) — `createSupabaseServerClient` + `createSupabaseAdminClient`
- `lib/supabase/client.ts` (12 lines) — `createSupabaseBrowserClient`

**Applied to Supabase:** `pnpm db:migrate` приложи миграцията. Verification query потвърди:
- 2 таблици (`time_slots`, `bookings`) с `rowsecurity = true`
- 4 RLS policies (public select + service_role all за `time_slots`; public insert + service_role all за `bookings`)
- 3 enums (`slot_status`, `lesson_type`, `booking_status`)
- 17 columns, correct types

**Build:** ✅ Compiled, no new routes (backend-only). **TSC:** ✅ exit 0. **Lint:** ✅ no warnings.

### 7. Connection string troubleshoot (unplanned)

Alex-овият direct URL (`db.jfccgssbodkqzivhxpzk.supabase.co:5432`) не работеше. DNS chek разкри че hostname-ът е **IPv6-only** (Supabase free tier политика). Windows dev machine няма IPv6 routing.

Тествах множество Supavisor pooler регионално комбинации:
- `aws-0-eu-central-1` — Tenant or user not found
- `aws-0-us-*` / `aws-0-ap-*` — Tenant or user not found  
- `aws-1-eu-central-2` → **✅ match!** Postgres 17.6 on aarch64

Открих че Supabase има multiple pooler shards (`aws-0-*` older, `aws-1-*` newer) + региона **eu-central-2** (Zurich) който е relatively new. Проектът е на newer infrastructure.

**Final pooler URLs** (в `.env.local`):
- Session mode (5432): `postgresql://postgres.jfccgssbodkqzivhxpzk:PASSWORD@aws-1-eu-central-2.pooler.supabase.com:5432/postgres`
- Transaction mode (6543): `postgresql://postgres.jfccgssbodkqzivhxpzk:PASSWORD@aws-1-eu-central-2.pooler.supabase.com:6543/postgres`

Q13 (pooler URL) resolved чрез probing — Alex няма нужда повече да го търси в dashboard.

Temporary probe scripts в `scripts/` (6 файла, съдържаха raw password) изтрити преди commit. Нищо чувствително в repo.

## Особености / notes

**Password URL-encoding:** Supabase auto-generated password съдържа `$`, `,`, `#`, `%` — всички special в URL context. `#` е най-критичният (fragment indicator). URL-encoded: `u8n%24D%2C45%2CrHs%25%23D`. Ако `postgres.js` автоматично URL-декодира на connection time, може да има conflict — ако T011 migrate failva, първата проверка ще е да върнем raw парола + test.

**Key format избор:** Supabase наскоро въведе `sb_publishable_` + `sb_secret_` format за API keys (PR 2025). Работи с `@supabase/supabase-js` v2.39+. Legacy `eyJhbGc...` JWT format също се поддържа. Използваме новия format — по-чист + forward-compatible.

**RLS approach:** Drizzle не генерира RLS policies, защото те са Supabase-specific. Choice: append RLS SQL към generated migration file ИЛИ отделен `0001_rls.sql`. Избирам append към `0000_xxx.sql` — една атомична migration вместо две.

**Open question Q13:** Alex не намери лесно Transaction pooler URL в Supabase dashboard. Direct URL (port 5432) работи за migrations + local dev. Pooler (port 6543) ще е необходим преди T010 deploys to Vercel. Не блокира T011.

## Commits в тази сесия

1. `edc1cd1` — `docs(s15): wave 4 kickoff · supabase pivot · T011 spec` (docs-first)
2. `d1f3ac6` — `feat(T011): supabase foundation with drizzle schema + rls` (execution)
3. (pending) `docs(s15): T011 complete · connection pooler discovery` — final doc update

## Следваща стъпка

- ⏳ Alex да предостави Google OAuth creds → T020 unblocks
- ⏳ Alex да предостави Resend API key → T012 unblocks
- ⏳ Alex да добави Supabase env vars в Vercel dashboard (Production + Preview environments) — преди T010 deploy към Vercel
- 🟢 T010 Booking UI spec може да се напише паралелно със събиране на creds (frontend-heavy, не зависи от external APIs директно; използва готовия supabase-js client за data access)

## Напомняне за rotation преди launch

Supabase creds paste-нати в чат история (s15). Преди production launch:
1. Supabase dashboard → Settings → Database → Reset database password
2. Supabase dashboard → Settings → API Keys → Rotate `sb_secret_...` key
3. Обнови `.env.local` + Vercel env vars
4. Force re-deploy
