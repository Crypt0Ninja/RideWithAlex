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

function decodeEmailFromIdToken(idToken: string): string {
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

  const email = decodeEmailFromIdToken(tokens.id_token);
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
