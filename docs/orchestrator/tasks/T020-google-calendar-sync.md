# T020 · Google Calendar sync — RideWithAlex Wave 4

Ти работиш върху **RideWithAlex**. T011 (Supabase foundation) е готов. Тази задача добавя Google Calendar integration: OAuth flow за да авторизира Alex's Google акаунт, tokens persistence в Supabase DB, и wrapper функции за създаване/изтриване на Calendar събития (които T010 Booking UI ще consume-ва).

## Context

Repo: `github.com/Crypt0Ninja/RideWithAlex`. Working dir: `C:\Users\Alex\Desktop\1a`.

**ВАЖНО:** `git pull --rebase origin main` преди start + преди push; `git diff --cached --stat` преди всеки commit.

Прочети:
- `memory/project_wave4_stack.md` — Supabase + Drizzle + RLS
- `memory/project_booking_model.md` — cash-only, 2h slots
- `db/schema.ts` — съществуваща schema (`time_slots`, `bookings`)
- `.env.local` — `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALENDAR_ID=primary`

## Scope clarification

**Планът каза "2-way sync" — тук правим write-only за MVP.**

Write-only означава: booking → Google Calendar event (автоматично).

2-way (auto-pulling от Calendar за блокирани слотове) изисква Vercel Cron Jobs ИЛИ Google webhook push notifications → ще се добави по-късно при нужда. Alex може ръчно да блокира часове чрез T021 admin panel.

Exposeum-ваме manual "pull from calendar" function (в lib) която T021 може да извика. Но не го auto-schedule-ваме сега.

## Архитектурни решения

- **HTTP approach:** native `fetch` за Google APIs — без npm `googleapis` пакет (10MB+). Всички нужни endpoints са JSON.
- **Token storage:** Drizzle table `google_tokens` в Supabase. Един ред (upsert на `user_email`). Service role достъп; RLS забранява anon.
- **Token refresh:** `getValidAccessToken()` helper — проверява `expires_at`, refresh-ва ако < 60s остават, връща свеж access_token.
- **Security:** /admin routes засега са unprotected (T021 добавя Supabase Auth). OAuth state parameter валидира callback integrity (anti-CSRF). Продукцията изисква да скриваме /admin с noindex + обскюрен URL до T021.
- **Scope:** `https://www.googleapis.com/auth/calendar` — пълен Calendar access (за create + delete + list).
- **Access type:** `offline` + `prompt=consent` — гарантира refresh_token при първата оторизация.

## Файлове за създаване/промяна

### 1. `db/schema.ts` — добавяш `googleTokens` таблица

Добавяш след existing `bookings` export, **преди** type exports:

```ts
export const googleTokens = pgTable("google_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userEmail: text("user_email").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  scope: text("scope").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .default(sql`now()`),
});

export type GoogleToken = typeof googleTokens.$inferSelect;
export type NewGoogleToken = typeof googleTokens.$inferInsert;
```

### 2. `middleware.ts` — update matcher to exclude `/admin`

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|admin|.*\\..*).*)"],
};
```

Разликата: `admin` добавен в негативния lookahead → admin routes не се localize-ват.

### 3. `lib/google/oauth.ts`

```ts
import { db, googleTokens } from "@/db";
import { eq } from "drizzle-orm";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPE = "https://www.googleapis.com/auth/calendar openid email";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is required in environment`);
  return value;
}

export function getRedirectUri(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${base}/api/auth/google/callback`;
}

export function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
};

export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    code,
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
    redirect_uri: getRedirectUri(),
    grant_type: "authorization_code",
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  return (await res.json()) as TokenResponse;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${res.status} ${text}`);
  }

  return (await res.json()) as TokenResponse;
}

async function decodeEmailFromIdToken(idToken: string): Promise<string> {
  const payload = idToken.split(".")[1];
  if (!payload) throw new Error("Invalid id_token: no payload segment");
  const decoded = Buffer.from(payload, "base64url").toString("utf8");
  const json = JSON.parse(decoded) as { email?: string };
  if (!json.email) throw new Error("id_token missing email claim");
  return json.email;
}

export async function storeTokensFromCode(code: string): Promise<string> {
  const tokens = await exchangeCodeForTokens(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "No refresh_token returned. Revoke app access at myaccount.google.com/permissions then retry.",
    );
  }
  if (!tokens.id_token) {
    throw new Error("No id_token returned. Ensure scope includes 'openid email'.");
  }

  const email = await decodeEmailFromIdToken(tokens.id_token);
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await db
    .insert(googleTokens)
    .values({
      userEmail: email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      scope: tokens.scope,
    })
    .onConflictDoUpdate({
      target: googleTokens.userEmail,
      set: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        scope: tokens.scope,
        updatedAt: new Date(),
      },
    });

  return email;
}

export async function getValidAccessToken(): Promise<{ accessToken: string; email: string }> {
  const rows = await db.select().from(googleTokens).limit(1);
  const row = rows[0];
  if (!row) throw new Error("Google account not connected — visit /admin/google-setup");

  const now = Date.now();
  const expiresAt = row.expiresAt.getTime();
  const BUFFER_MS = 60_000;

  if (expiresAt - now > BUFFER_MS) {
    return { accessToken: row.accessToken, email: row.userEmail };
  }

  const refreshed = await refreshAccessToken(row.refreshToken);
  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000);

  await db
    .update(googleTokens)
    .set({
      accessToken: refreshed.access_token,
      expiresAt: newExpiresAt,
      updatedAt: new Date(),
    })
    .where(eq(googleTokens.userEmail, row.userEmail));

  return { accessToken: refreshed.access_token, email: row.userEmail };
}

export async function getConnectedEmail(): Promise<string | null> {
  const rows = await db.select({ email: googleTokens.userEmail }).from(googleTokens).limit(1);
  return rows[0]?.email ?? null;
}
```

### 4. `lib/google/calendar.ts`

```ts
import { getValidAccessToken } from "./oauth";

const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";

function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID ?? "primary";
}

type CalendarEvent = {
  id: string;
  status: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
};

export type BookingForCalendar = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  lessonType: string;
  headcount: number;
  notes: string | null;
  startsAt: Date;
  endsAt: Date;
};

function buildEventBody(booking: BookingForCalendar) {
  const summary = `lesson · ${booking.customerName} (${booking.lessonType}, ${booking.headcount}p)`;
  const description = [
    `phone: ${booking.customerPhone}`,
    `lesson type: ${booking.lessonType}`,
    `headcount: ${booking.headcount}`,
    booking.notes ? `notes: ${booking.notes}` : null,
    `booking id: ${booking.bookingId}`,
    "",
    "auto-created by ridewithalex.com",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    summary,
    description,
    start: { dateTime: booking.startsAt.toISOString(), timeZone: "Europe/Sofia" },
    end: { dateTime: booking.endsAt.toISOString(), timeZone: "Europe/Sofia" },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 120 },
        { method: "email", minutes: 1440 },
      ],
    },
  };
}

export async function createCalendarEvent(booking: BookingForCalendar): Promise<string> {
  const { accessToken } = await getValidAccessToken();
  const calendarId = encodeURIComponent(getCalendarId());
  const res = await fetch(`${CALENDAR_BASE}/calendars/${calendarId}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildEventBody(booking)),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar event create failed: ${res.status} ${text}`);
  }

  const event = (await res.json()) as { id: string };
  return event.id;
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const { accessToken } = await getValidAccessToken();
  const calendarId = encodeURIComponent(getCalendarId());
  const res = await fetch(
    `${CALENDAR_BASE}/calendars/${calendarId}/events/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (res.status !== 204 && res.status !== 404 && res.status !== 410) {
    const text = await res.text();
    throw new Error(`Calendar event delete failed: ${res.status} ${text}`);
  }
}

export async function listUpcomingEvents(daysAhead = 14): Promise<CalendarEvent[]> {
  const { accessToken } = await getValidAccessToken();
  const calendarId = encodeURIComponent(getCalendarId());
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });

  const res = await fetch(
    `${CALENDAR_BASE}/calendars/${calendarId}/events?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar list failed: ${res.status} ${text}`);
  }

  const body = (await res.json()) as { items: CalendarEvent[] };
  return body.items.filter((e) => e.status !== "cancelled");
}
```

### 5. `app/api/auth/google/init/route.ts`

```ts
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthUrl } from "@/lib/google/oauth";

export async function GET() {
  const state = randomBytes(16).toString("hex");
  const authUrl = buildAuthUrl(state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });
  return response;
}
```

### 6. `app/api/auth/google/callback/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { storeTokensFromCode } from "@/lib/google/oauth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const cookieState = request.cookies.get("google_oauth_state")?.value;

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/google-setup?error=${encodeURIComponent(error)}`, request.url),
    );
  }
  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/google-setup?error=missing_code", request.url),
    );
  }
  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(
      new URL("/admin/google-setup?error=state_mismatch", request.url),
    );
  }

  try {
    const email = await storeTokensFromCode(code);
    const response = NextResponse.redirect(
      new URL(`/admin/google-setup?connected=${encodeURIComponent(email)}`, request.url),
    );
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      new URL(`/admin/google-setup?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
```

### 7. `app/admin/layout.tsx`

```tsx
import { Onest } from "next/font/google";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-onest",
  display: "swap",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable}>
      <body className="min-h-screen bg-black text-white font-sans antialiased">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
          <nav className="mb-16 flex items-center justify-between">
            <a href="/admin" className="text-white/60 hover:text-white text-xs uppercase tracking-[0.3em] lowercase">
              admin
            </a>
            <a href="/" className="text-white/40 hover:text-white text-xs uppercase tracking-[0.3em]">
              ← back to site
            </a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
```

### 8. `app/admin/google-setup/page.tsx`

```tsx
import { getConnectedEmail } from "@/lib/google/oauth";

type Props = {
  searchParams: Promise<{ connected?: string; error?: string }>;
};

export default async function GoogleSetupPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = await getConnectedEmail();

  return (
    <main className="flex flex-col gap-10 max-w-2xl">
      <header className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">google calendar</p>
        <h1 className="text-4xl md:text-5xl font-medium lowercase tracking-tight">
          connect google calendar
        </h1>
        <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase">
          authorize ridewithalex to create calendar events when bookings come in.
          uses your google calendar (primary). one-time setup — tokens refresh automatically.
        </p>
      </header>

      {params.error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-red-300 text-sm lowercase">
          error: {params.error.replace(/_/g, " ")}
        </div>
      )}

      {params.connected && !email && (
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 text-white/80 text-sm lowercase">
          connected as <span className="font-medium">{params.connected}</span>
        </div>
      )}

      {email ? (
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8 flex flex-col gap-3">
            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">status</p>
            <p className="text-white text-xl font-medium lowercase">connected</p>
            <p className="text-white/60 text-sm lowercase">account: {email}</p>
          </div>
          <form action="/api/auth/google/init" method="get">
            <button
              type="submit"
              className="text-white/60 hover:text-white text-xs uppercase tracking-[0.3em] lowercase"
            >
              reconnect (switch account) →
            </button>
          </form>
        </div>
      ) : (
        <form action="/api/auth/google/init" method="get">
          <button
            type="submit"
            className="rounded-full bg-white text-black px-8 py-4 text-sm font-medium lowercase hover:bg-white/90 transition-colors"
          >
            connect google calendar →
          </button>
        </form>
      )}
    </main>
  );
}
```

### 9. Optional: `app/admin/page.tsx` (simple index за navigation)

```tsx
export default function AdminIndex() {
  return (
    <main className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">admin</p>
        <h1 className="text-4xl md:text-5xl font-medium lowercase tracking-tight">
          ridewithalex admin
        </h1>
      </header>
      <ul className="flex flex-col gap-3">
        <li>
          <a href="/admin/google-setup" className="text-white hover:text-white/80 underline-offset-4 hover:underline lowercase">
            google calendar setup →
          </a>
        </li>
      </ul>
    </main>
  );
}
```

## Git workflow

1. `git pull --rebase origin main`
2. Update `db/schema.ts`, `middleware.ts`
3. Create `lib/google/*`, `app/api/auth/google/*`, `app/admin/*` (7 файла)
4. `pnpm db:generate` — нов migration `0001_xxx.sql`
5. `pnpm db:migrate` — apply към Supabase
6. Verify: `pnpm build`, `pnpm tsc --noEmit`, `pnpm lint`
7. `git add` specific files, `git diff --cached --stat`
8. Commit: `feat(T020): google calendar oauth flow + event write-only sync`
9. `git pull --rebase origin main`
10. `git push origin main`

## Do NOT

- ❌ Install `googleapis` npm package — native fetch е достатъчен
- ❌ Touch existing pages (`app/[locale]/*`), messages, i18n, hero, existing components
- ❌ Add auth check на /admin/* в този task (T021 го прави)
- ❌ Implement Calendar → DB pulling (out of scope, write-only)
- ❌ Commit `.env.local`
- ❌ Skip `git diff --cached --stat`

## Acceptance criteria

- [ ] `google_tokens` table в Supabase с unique(user_email) + `rowsecurity = true`
- [ ] `middleware.ts` matcher excludes `/admin`
- [ ] `lib/google/oauth.ts`: exports `buildAuthUrl`, `exchangeCodeForTokens`, `refreshAccessToken`, `storeTokensFromCode`, `getValidAccessToken`, `getConnectedEmail`
- [ ] `lib/google/calendar.ts`: exports `createCalendarEvent`, `deleteCalendarEvent`, `listUpcomingEvents`, type `BookingForCalendar`
- [ ] `/api/auth/google/init` redirect-ва към Google consent screen
- [ ] `/api/auth/google/callback` обработва `?code=` + state validation + stores tokens + redirects към `/admin/google-setup?connected=...`
- [ ] `/admin/google-setup` показва "connected as {email}" когато токен съществува; бутон "connect" иначе
- [ ] Build/tsc/lint pass; нови routes: `/admin`, `/admin/google-setup`, `/api/auth/google/init`, `/api/auth/google/callback`
- [ ] Commit pushed
- [ ] Manual smoke test (Alex): open `http://localhost:3000/admin/google-setup` → connect → authorize → expect redirect to `?connected=...`

## Report format

```markdown
## Report — T020

**Status:** completed | partial | blocked
**Commit:** [SHA]
**Time spent:** ~X min

### Какво направих
(summary)

### Acceptance criteria
- [x] ... evidence

### Отклонения
(scope clarifications, if any)

### Блокери / въпроси
(if any)

### Manual test pending
Alex да extends:
1. `pnpm dev`
2. Open `http://localhost:3000/admin/google-setup`
3. Click "connect google calendar"
4. Authorize with Gmail → expect redirect to success page with email shown
5. Screenshot success state

### Променени файлове
(list)
```

---

## Reports

_(попълва се след изпълнение)_
