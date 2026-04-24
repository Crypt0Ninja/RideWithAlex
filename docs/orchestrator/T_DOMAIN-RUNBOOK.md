# T_DOMAIN · Runbook — `ridewithalex.org` migration

> **Единственият документ който следваш стъпка-по-стъпка.** Разделение: стъпки с 🧑 **ТИ ПРАВИШ** (ръчно) vs 🤖 **АЗ ПРАВЯ** (автоматизирам през API).

**Цел:** `https://ridewithalex.org` живее, всичко работи end-to-end, под 1 час active work.

**Стратегия:** Ти ми даваш 2 API tokens (Cloudflare + Resend Full Access). Аз автоматизирам всичко свързано с DNS + Vercel + Resend. Ти ръчно правиш само Google OAuth update (няма практичен API за това).

---

## Prerequisites — какво имам VS какво трябва

| Cred | Имам ли? | Scope достатъчен? |
|---|---|---|
| `VERCEL_TOKEN` | ✅ | ✅ (full account scope) |
| `GITHUB_TOKEN` | ✅ | ✅ |
| `RESEND_API_KEY` | ✅ | ❌ **Sending-only** — няма domain mgmt permission |
| `CLOUDFLARE_API_TOKEN` | ❌ | Нужен е |
| `GOOGLE OAuth mgmt` | n/a | Няма практичен API — **ръчно** |

**Така че:** трябват ти **2 нови неща** + **1 ръчна задача в Google Cloud Console**.

---

## Phase 0 — Token setup 🧑 ТИ ПРАВИШ (~5 мин)

### Стъпка 0A — Cloudflare API Token

1. [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → scroll до **"Edit zone DNS"** template → **Use template**
3. Config:
   - **Token name:** `RideWithAlex DNS` (или каквото искаш)
   - **Permissions:** вече е Zone → DNS → Edit (от template)
   - **Zone Resources:** Include → **Specific zone** → `ridewithalex.org`
4. **Continue to summary** → **Create Token**
5. **Копирай token-а** (показва се еднократно, започва с примерно `kXJ...` или long alnum string)
6. Кажи ми в чата: `CLOUDFLARE_API_TOKEN=<token>`
   - Ще го добавя в `.env.local` (gitignored) + използвам за API calls

### Стъпка 0B — Resend Full Access Key

(Съществуващия ключ е sending-only, не може да управлява domains.)

1. [resend.com/api-keys](https://resend.com/api-keys) → **+ Create API Key**
2. Config:
   - **Name:** `RideWithAlex Management`
   - **Permission:** **Full access** (не Sending)
   - **Domain:** All domains
3. **Create** → копирай ключа (започва с `re_`)
4. Кажи ми в чата: `RESEND_MGMT_API_KEY=<key>`
   - След миграцията → ще го изтрием, запазваме само sending-only key за runtime

### Стъпка 0C — Supabase Zone ID (optional, я го взимам сам от Cloudflare API)
Skip — аз го fetch-вам когато имам CLOUDFLARE_API_TOKEN.

---

## Phase 1 — Code updates `.com` → `.org` 🤖 АЗ ПРАВЯ (~10 мин)

Не зависи от domain setup. Започвам веднага щом кажеш "старт".

**Файлове които update-вам (20 occurrences в 9 файла):**
- `messages/en.json` + `messages/bg.json` (privacy policy текст, website mentions)
- `components/contact/ContactInfo.tsx` (email link)
- `components/shared/SiteFooter.tsx` (footer email)
- `components/terms/TermsContent.tsx` (legal email)
- `components/privacy/PrivacyContent.tsx` (GDPR email)
- `app/[locale]/opengraph-image.tsx` (dynamic OG footer text)
- `lib/google/calendar.ts` (Calendar event description)
- `lib/email/client.ts` (email template footer)

**Commit:** `chore(domain): replace ridewithalex.com → ridewithalex.org sitewide`

---

## Phase 2 — Cloudflare DNS records 🤖 АЗ ПРАВЯ (~2 мин + propagation 5-30 мин)

След като имам `CLOUDFLARE_API_TOKEN`, изпълнявам следните API calls:

### 2A — Get zone ID
```
GET https://api.cloudflare.com/client/v4/zones?name=ridewithalex.org
```
→ Извличам zone_id.

### 2B — Create A record (apex)
```
POST https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records
Body: {
  "type": "A",
  "name": "@",
  "content": "76.76.21.21",
  "ttl": 1,
  "proxied": false
}
```

### 2C — Create CNAME (www)
```
POST https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records
Body: {
  "type": "CNAME",
  "name": "www",
  "content": "cname.vercel-dns.com",
  "ttl": 1,
  "proxied": false
}
```

**Verification:** `nslookup ridewithalex.org 1.1.1.1` → очаквам `76.76.21.21`.

---

## Phase 3 — Vercel domain add 🤖 АЗ ПРАВЯ (~3 мин + SSL issue auto)

### 3A — Add primary domain
```
POST https://api.vercel.com/v10/projects/{project_id}/domains
Authorization: Bearer $VERCEL_TOKEN
Body: { "name": "ridewithalex.org" }
```

### 3B — Add www (redirect to apex)
```
POST https://api.vercel.com/v10/projects/{project_id}/domains
Body: { "name": "www.ridewithalex.org", "redirect": "ridewithalex.org" }
```

### 3C — Verify SSL cert
Periodic check `GET /v9/projects/{id}/domains/{domain}` до `verified: true` + `verification.sslCertificate.issued: true`. Обикновено < 5 мин.

---

## Phase 4 — Google OAuth redirect URI update 🧑 ТИ ПРАВИШ (~3 мин)

**Ръчно — няма API за OAuth credential редакция.**

1. [console.cloud.google.com](https://console.cloud.google.com) → project **RideWithAlex**
2. **APIs & Services → Credentials**
3. Клик на OAuth client: **`RideWithAlex Web`**
4. В **Authorized redirect URIs**:
   - **Премахни:** `https://ridewithalex.com/api/auth/google/callback`
   - **Добави:** `https://ridewithalex.org/api/auth/google/callback`
   - **Добави:** `https://www.ridewithalex.org/api/auth/google/callback`
   - Запази `http://localhost:3000/...` и `https://ridewithalex.vercel.app/...` (за dev + fallback)
5. **Save**

Кажи ми "Google done" когато си готов.

---

## Phase 5 — Resend domain setup 🤖 АЗ ПРАВЯ (~5 мин)

След като имам `RESEND_MGMT_API_KEY`:

### 5A — Add domain in Resend
```
POST https://api.resend.com/domains
Authorization: Bearer $RESEND_MGMT_API_KEY
Body: { "name": "ridewithalex.org", "region": "eu-west-1" }
```
→ Resend връща `domain_id` + **4 DNS records** (TXT DKIM, MX bounce, TXT SPF, TXT DMARC).

### 5B — Add 4 DNS records in Cloudflare (автоматично)
За всеки от 4-те records → `POST /dns_records` в Cloudflare zone-а.

### 5C — Trigger verification
```
POST https://api.resend.com/domains/{domain_id}/verify
```
Polling `GET /domains/{domain_id}` до `status: "verified"`. Обикновено 5-15 мин за DNS propagation.

---

## Phase 6 — Vercel env vars update 🤖 АЗ ПРАВЯ (~3 мин)

### 6A — Update `NEXT_PUBLIC_SITE_URL`
```
PATCH https://api.vercel.com/v10/projects/{project_id}/env/{env_id}
Body: { "value": "https://ridewithalex.org", "target": ["production", "preview"] }
```

### 6B — Update `RESEND_FROM_EMAIL`
```
PATCH ... → value: "booking@ridewithalex.org"
```

### 6C — Trigger redeploy
```
POST https://api.vercel.com/v13/deployments
Body: { "project": "ridewithalex", "target": "production", "gitSource": {...latest commit} }
```
Polling `GET /v13/deployments/{id}` до `readyState: "READY"`.

---

## Phase 7 — End-to-end verification 🧑 + 🤖 ДВАМАТА (~20 мин)

### 7A — Automated checks 🤖 (аз curl-вам)
- [ ] `curl -I https://ridewithalex.org` → HTTP 200 + Vercel headers
- [ ] `curl https://ridewithalex.org/sitemap.xml` → XML с `ridewithalex.org` URLs
- [ ] `curl https://ridewithalex.org/robots.txt` → sitemap link correct
- [ ] `curl https://ridewithalex.org/en/book` → HTTP 200
- [ ] `curl https://ridewithalex.org/api/bookings` (GET) → HTTP 405 (expected, only POST)

### 7B — Manual checks 🧑 (ти тестваш в браузър)
- [ ] Отвори `https://ridewithalex.org` → sайтът зарежда, home hero работи
- [ ] Navigate през menu → всичките 6 inner pages OK
- [ ] Мобилно: hamburger menu отваря fullscreen
- [ ] `/admin/google-setup` → reconnect Google Calendar от новия домейн (старият token може да съдържа стария redirect URI)
- [ ] Test booking flow — submit → Calendar event + 2 emails
  - **Важно:** customer confirmation email трябва да идва от `booking@ridewithalex.org` (не sandbox). Ако Resend verification не е done → fallback to `RESEND_FROM_EMAIL=onboarding@resend.dev` temporarily.
- [ ] Test за spam folder (новият domain няма sender reputation — може да падне в spam за първите 1-2 емейла)

### 7C — SEO submission 🧑
- [ ] [Google Search Console](https://search.google.com/search-console) → Add property `ridewithalex.org` → Verify (DNS TXT record — мога да го добавя през CF API) → Submit `https://ridewithalex.org/sitemap.xml`
- [ ] [Bing Webmaster](https://www.bing.com/webmasters) → същото

---

## Phase 8 — Cleanup 🤖 АЗ ПРАВЯ

- Update docs (`STATUS.md`, `PLAN.md`, `STARTUP_PROMPT.md`, `CREDS-SETUP.md`)
- Close T_DOMAIN + T025 в task index
- Session note s17 (или next)

---

## Execution checklist — една страница

```
╔═══════════════════════════════════════════════════════════════╗
║ PHASE 0 — PREPARE                                             ║
║ 🧑 Create Cloudflare API token + paste in chat                ║
║ 🧑 Create Resend Full Access key + paste in chat              ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 1 — CODE                                                ║
║ 🤖 Replace .com → .org + commit + push                        ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 2 — CLOUDFLARE DNS                                      ║
║ 🤖 Add A + CNAME records via API                              ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 3 — VERCEL DOMAIN                                       ║
║ 🤖 Add ridewithalex.org + www via Vercel API                  ║
║ 🤖 Wait for SSL cert                                          ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 4 — GOOGLE OAUTH                                        ║
║ 🧑 Update redirect URIs in Cloud Console (ручно)              ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 5 — RESEND DOMAIN                                       ║
║ 🤖 Create domain via API                                      ║
║ 🤖 Add 4 DNS records via Cloudflare API                       ║
║ 🤖 Trigger + poll verification                                ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 6 — VERCEL ENV + REDEPLOY                               ║
║ 🤖 Update NEXT_PUBLIC_SITE_URL + RESEND_FROM_EMAIL            ║
║ 🤖 Trigger production redeploy                                ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 7 — VERIFY                                              ║
║ 🤖 Automated HTTP checks                                      ║
║ 🧑 Manual browser + booking flow test                         ║
╠═══════════════════════════════════════════════════════════════╣
║ PHASE 8 — CLEANUP                                             ║
║ 🤖 Docs update + session note + task index close              ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Какво ти трябва да направиш СЕГА

### 1️⃣ Създай 2 API tokens (Phase 0A + 0B):
- Cloudflare: **Edit zone DNS** template → specific zone `ridewithalex.org`
- Resend: **Full access** API key

### 2️⃣ Paste ги в чата в тоя формат:
```
CLOUDFLARE_API_TOKEN=<token>
RESEND_MGMT_API_KEY=<key>
```

### 3️⃣ Чакай ме да направя Phase 1-3 + 5 + 6.

### 4️⃣ Когато кажа "Google OAuth pending" — правиш Phase 4 (ръчно) и ми казваш "Google done".

### 5️⃣ Накрая правим Phase 7 verification заедно.

---

## Rollback (ако нещо се счупи)

`ridewithalex.vercel.app` **остава активен** през цялата миграция. Ако `ridewithalex.org` fail-ва:
- Revert env var `NEXT_PUBLIC_SITE_URL` към vercel.app
- Remove domain от Vercel project (API call)
- Изчакай DNS propagation обратно
- Сайтът продължава да работи на vercel.app без downtime

---

## Security note

След migration success:
1. **Rotate** `CLOUDFLARE_API_TOKEN` в Cloudflare dashboard (create new, изтрий старият — защото е paste-нат в чат история)
2. **Delete** `RESEND_MGMT_API_KEY` — запазваме само sending-only key за runtime
3. **Rotate** Supabase creds (вече отбелязано като blocker в `memory/project_resend_domain_pending.md`)

---

## Reports

_(попълва се phase-by-phase когато изпълняваме)_
