# T011 · Supabase + Drizzle schema — RideWithAlex Wave 4 foundation

Ти работиш върху **RideWithAlex** — минималистичен сайт за Alex, сноуборд учител от Банско. 9-те статични страници са живи (18 routes). Сега стартираме **Wave 4** — booking/календар/email/admin. Тази задача е **foundation** за целия Wave 4: DB schema + connection clients + Row Level Security.

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` ПРЕДИ започване И отново ПРЕДИ push. Преди финалното `git push` направи `git diff --cached --stat` и провери че stage-нал си точно каквото спеца казва — нищо повече.

Прочети преди работа:
- `memory/project_wave4_stack.md` — stack decision (Supabase + Drizzle + supabase-js + RLS)
- `memory/project_booking_model.md` — business model (cash-only, 2h slots, name + phone)
- `package.json`, `tsconfig.json` — Next.js 15 + React 19 + TypeScript strict + `@/*` paths
- `.env.local` — Supabase creds (URL, anon, service_role, DATABASE_URL, DATABASE_POOL_URL)

## Your task

Изграждане на foundation layer за Wave 4:

1. Install packages: `drizzle-orm`, `postgres`, `@supabase/supabase-js`, `@supabase/ssr` + dev: `drizzle-kit`, `tsx`
2. Drizzle schema (`db/schema.ts`): `time_slots` + `bookings` tables с подходящи enums, FK relations, indexes
3. Drizzle DB client (`db/index.ts`): `postgres.js` connection, използва `DATABASE_POOL_URL` за runtime
4. Supabase JS clients (`lib/supabase/server.ts` + `lib/supabase/client.ts`): server (service_role) + browser (anon) wrappers
5. Drizzle config (`drizzle.config.ts`): points to `DATABASE_URL` (direct)
6. Migration: `drizzle-kit generate` → `db/migrations/0000_xxx.sql` → ръчно append RLS policies → `drizzle-kit migrate`
7. Verify: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint` pass; таблиците съществуват в Supabase

## Файлове за създаване (7)

### 1. `db/schema.ts`

```ts
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const slotStatusEnum = pgEnum("slot_status", [
  "available",
  "blocked",
  "booked",
]);

export const lessonTypeEnum = pgEnum("lesson_type", [
  "private",
  "group",
  "kids",
  "freestyle",
  "offpiste",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const timeSlots = pgTable(
  "time_slots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "date" }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "date" }).notNull(),
    status: slotStatusEnum("status").notNull().default("available"),
    googleEventId: text("google_event_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    startsAtIdx: index("time_slots_starts_at_idx").on(table.startsAt),
    statusIdx: index("time_slots_status_idx").on(table.status),
  })
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slotId: uuid("slot_id").references(() => timeSlots.id, {
      onDelete: "set null",
    }),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    lessonType: lessonTypeEnum("lesson_type").notNull(),
    headcount: integer("headcount").notNull().default(1),
    totalStotinki: integer("total_stotinki").notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    slotIdIdx: index("bookings_slot_id_idx").on(table.slotId),
    statusIdx: index("bookings_status_idx").on(table.status),
    createdAtIdx: index("bookings_created_at_idx").on(table.createdAt),
  })
);

export type TimeSlot = typeof timeSlots.$inferSelect;
export type NewTimeSlot = typeof timeSlots.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
```

**Бележка:** `totalStotinki` (integer) — съхраняваме цена в стотинки/cents, за да избегнем float precision. 120 лв = 12000. Conversion helper ще дойде в T010.

### 2. `db/index.ts`

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_POOL_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_POOL_URL or DATABASE_URL must be set in environment"
  );
}

const client = postgres(connectionString, {
  prepare: false,
  max: 1,
});

export const db = drizzle(client, { schema });

export * from "./schema";
```

**Бележка:** `prepare: false` е задължителен за Supabase Transaction pooler (Supavisor); `max: 1` защото serverless functions нямат persistent connections. Fallback към `DATABASE_URL` (direct) позволява локален dev без pooler URL.

### 3. `lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase URL/anon key missing from environment");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` may be called from a Server Component — cookies are
          // read-only there; middleware handles session refresh instead.
        }
      },
    },
  });
}

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase URL/service role key missing from environment");
  }

  // Dynamic import to keep admin client out of Edge runtime bundles
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

### 4. `lib/supabase/client.ts`

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase URL/anon key missing from environment");
  }

  return createBrowserClient(url, anonKey);
}
```

### 5. `drizzle.config.ts` (root)

```ts
import type { Config } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL must be set in .env.local");
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
} satisfies Config;
```

**Бележка:** drizzle-kit чете schema от TS директно (чрез tsx); `dotenv` зарежда `.env.local` защото drizzle-kit runs outside Next.js dev server.

### 6. `db/rls.sql` (ръчно написан; append-ва се към generated migration)

```sql
-- Row Level Security for time_slots + bookings
-- Strategy:
--   - time_slots: public read (booking UI lists available slots); only service_role writes
--   - bookings:   anon can INSERT (guest books); only service_role reads/updates/deletes
--   - service_role bypasses RLS by default; explicit policies are defensive

ALTER TABLE "time_slots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;

-- time_slots policies
CREATE POLICY "time_slots_public_select"
  ON "time_slots"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "time_slots_service_role_all"
  ON "time_slots"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- bookings policies
CREATE POLICY "bookings_public_insert"
  ON "bookings"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "bookings_service_role_all"
  ON "bookings"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 7. Add scripts to `package.json`

Добавяш **САМО** scripts + dependencies (не променяш други полета):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Git workflow

1. `git pull --rebase origin main` ПРЕДИ старта
2. `pnpm add drizzle-orm postgres @supabase/supabase-js @supabase/ssr`
3. `pnpm add -D drizzle-kit tsx dotenv`
4. Създаваш 6-те TS/SQL файла + drizzle config
5. Добавяш 4-те db:* scripts в package.json
6. `pnpm db:generate` — създава `db/migrations/0000_xxx.sql`; append-ваш съдържанието на `db/rls.sql` към края на този файл (или pиш-ваш RLS като отделен `0001_rls.sql`)
7. `pnpm db:migrate` — прилага към Supabase (проверка: `SELECT * FROM time_slots LIMIT 1` трябва да върне празно, без грешка)
8. `pnpm build` + `pnpm tsc --noEmit` + `pnpm lint` — всички pass
9. **`git add` САМО:** `db/`, `lib/supabase/`, `drizzle.config.ts`, `package.json`, `pnpm-lock.yaml`
10. `git diff --cached --stat` — очаквай само тези файлове
11. Commit: `feat(T011): supabase foundation with drizzle schema + rls`
12. `git pull --rebase origin main`
13. `git push origin main`

## Do NOT

- ❌ Не commit-ваш `.env.local` (проверява се че е в `.gitignore`)
- ❌ Не правиш промени в `app/`, `components/`, `messages/`, `i18n/`, `middleware.ts`, `next.config.ts`, `tsconfig.json`
- ❌ Не добавяш React hooks / UI компоненти — това е чист backend foundation
- ❌ Не install-ваш допълнителни library-и освен посочените (напр. не добавяй `zod` — това идва в T010)
- ❌ Не skip git hooks (`--no-verify`)
- ❌ Не забравяш `git diff --cached --stat` преди push
- ❌ Не commit-ваш `db/migrations/meta/` snapshots като binary/JSON — това е normal drizzle output, **включва се в commit**

## Acceptance criteria

- [ ] 4 нови dependencies + 3 dev dependencies в `package.json`; `pnpm-lock.yaml` updated
- [ ] `db/schema.ts` експортира `timeSlots`, `bookings`, 3 enums + TS types (`TimeSlot`, `NewTimeSlot`, `Booking`, `NewBooking`)
- [ ] `db/index.ts` експортира `db` (Drizzle instance)
- [ ] `lib/supabase/server.ts` експортира `createSupabaseServerClient` + `createSupabaseAdminClient`
- [ ] `lib/supabase/client.ts` експортира `createSupabaseBrowserClient`
- [ ] `drizzle.config.ts` е в root + използва `dotenv` за `.env.local`
- [ ] `db/migrations/0000_xxx.sql` generated + RLS policies applied (inline OR като `0001_rls.sql`)
- [ ] `pnpm db:migrate` успешен — таблиците `time_slots` + `bookings` съществуват в Supabase (verify чрез Supabase Table Editor или `pnpm db:studio`)
- [ ] RLS enabled на двете таблици — проверка в Supabase dashboard → Authentication → Policies
- [ ] `pnpm build` успешен — без нови routes (това е backend-only)
- [ ] `pnpm tsc --noEmit` exit 0
- [ ] `pnpm lint` без warnings
- [ ] `.env.local` **НЕ** е в commit-а (`git diff --cached` не го показва)
- [ ] Commit + push; `feat(T011): supabase foundation with drizzle schema + rls`

## Report формат

```markdown
## Report — T011

**Status:** completed | partial | blocked
**Commit:** [SHA — message]
**Time spent:** ~X минути

### Какво направих
(1-3 параграфа, ≤ 200 думи)

### Acceptance criteria
- [x] Packages installed — evidence: `pnpm-lock.yaml` diff
- [x] Drizzle schema + types — evidence: `db/schema.ts` exports
- [x] DB clients — evidence: file paths
- [x] Migration applied — evidence: `pnpm db:migrate` output + Supabase Table Editor screenshot OR query result
- [x] RLS enabled — evidence: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('time_slots', 'bookings')` → both true
- [x] Build/tsc/lint pass — evidence: `✓ Compiled`
- [x] Pushed — evidence: commit SHA on origin/main

### Отклонения от спеца
(ако има, обосновка; иначе "няма")

### Блокери / въпроси
(ако има)

### Променени файлове
- db/schema.ts — нов
- db/index.ts — нов
- db/migrations/0000_xxx.sql — нов (generated + RLS appended)
- lib/supabase/server.ts — нов
- lib/supabase/client.ts — нов
- drizzle.config.ts — нов
- package.json — модифициран (dependencies + scripts)
- pnpm-lock.yaml — модифициран
```

---

## Reports

_(попълва се след изпълнение)_
