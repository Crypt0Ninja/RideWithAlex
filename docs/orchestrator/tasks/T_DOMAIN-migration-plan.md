# T_DOMAIN · Migration plan — `ridewithalex.org` (Cloudflare DNS-only → Vercel)

> Пълен миграционен план за свързване на `ridewithalex.org` (купен от Cloudflare) към Vercel deployment-а. Конфигурация: **Cloudflare = DNS only** (grey cloud, без proxy). Vercel управлява SSL + edge оптимизация.

**Важно:** Домейнът е **`.org`** — проектът досега беше сграден с предположение `.com`. Това изисква code updates на **~20 места** преди launch (изцяло документирани в §5 по-долу).

---

## 0. Overview + цел

**Преди launch:**
- 18+ routes живи на `ridewithalex.vercel.app`
- Wave 4 (booking / Calendar / email / admin) функционален
- SEO layer, mobile menu, premium design всичко готово

**След launch (цел):**
- `https://ridewithalex.org` и `https://www.ridewithalex.org` обслужват сайта
- Auto SSL през Vercel (Let's Encrypt)
- Customer confirmation emails изпращат от `alex@ridewithalex.org` (вместо sandbox `onboarding@resend.dev`)
- Google OAuth redirect URIs обновени
- Всички code references `.com` → `.org`

---

## 1. Pre-flight checklist (преди DNS промени)

### Alex потвърждава:
- [ ] Cloudflare account с `ridewithalex.org` е активен (зона съществува, NS pointing to Cloudflare)
- [ ] Имаш access към Cloudflare dashboard
- [ ] Имаш access към Vercel dashboard
- [ ] Имаш access към Google Cloud Console (за OAuth update)
- [ ] Имаш access към Resend dashboard (за domain verification)

### Orchestrator проверява:
- [ ] Current Vercel deployment stable, всички страници HTTP 200
- [ ] Сайтът build-ва clean на главната (`pnpm build` pass)
- [ ] `.env.local` + Vercel env vars синхронизирани
- [ ] Всички `ridewithalex.com` references в кода катализирани (виж §5)

---

## 2. DNS records в Cloudflare (Phase 1)

Влизаш в Cloudflare dashboard → Domain `ridewithalex.org` → **DNS** tab.

### 2 records нужни за базовата setup

| Type | Name | Target | Proxy | TTL |
|---|---|---|---|---|
| **A** | `@` (root / apex) | `76.76.21.21` | 🔘 DNS only (grey cloud) | Auto |
| **CNAME** | `www` | `cname.vercel-dns.com` | 🔘 DNS only (grey cloud) | Auto |

- `A` record сочи apex (`ridewithalex.org`) към Vercel's static IP за apex domains
- `CNAME` за `www.` сочи към Vercel's dynamic CNAME target
- **Grey cloud** (DNS only) — задължително за Vercel Next.js; orange cloud causes double-CDN conflicts, edge function failures

### Премахни default Cloudflare records (ако има)

Cloudflare понякога добавя automatic A/AAAA records за parking page. Изтрий всички **преди** да добавиш горните 2.

### Propagation

DNS промени обикновено propagate-ват за **5-30 мин**, но може да отнеме до **48h globally**. Тестваш с:
```
nslookup ridewithalex.org 1.1.1.1
```

Очакван output: `Address: 76.76.21.21`

---

## 3. Vercel domain addition (Phase 2)

Vercel Dashboard → project **`ridewithalex`** → **Settings → Domains**.

### Стъпки:
1. **Add Domain** → въвеждаш `ridewithalex.org` → Add
2. Vercel пита: Primary / Redirect → избираш **Primary** (or whatever is default)
3. Vercel започва да **issue SSL cert** автоматично (Let's Encrypt, ~30 секунди до 5 мин)
4. Add още `www.ridewithalex.org` → Vercel предлага auto-redirect към apex (приемаш)

### Очакван statuses в UI:
- `ridewithalex.org` → ✅ Valid Configuration
- `www.ridewithalex.org` → ✅ Valid Configuration (redirects to apex)
- SSL: ✅ Active

Ако Valid Configuration не се появи — провери DNS records + wait до 30 мин.

### Verify:
```
curl -I https://ridewithalex.org
# Очаквам: HTTP/2 200, content-type: text/html
```

---

## 4. Google OAuth redirect URIs update (Phase 3)

Когато създавахме OAuth client (sesija s15), добавих **3 redirect URIs**:
- ✅ `http://localhost:3000/api/auth/google/callback`
- ✅ `https://ridewithalex.vercel.app/api/auth/google/callback`
- ⚠️ `https://ridewithalex.com/api/auth/google/callback` — **грешно TLD** (.com, а домейнът е .org)

### Нужно действие:
1. [Google Cloud Console](https://console.cloud.google.com) → OAuth consent screen project
2. **APIs & Services → Credentials** → клик на OAuth client `RideWithAlex Web`
3. **Authorized redirect URIs:**
   - **Delete** `.com` variant
   - **Add** `https://ridewithalex.org/api/auth/google/callback`
   - **Add** `https://www.ridewithalex.org/api/auth/google/callback` (safety, в случай user идва от www)
4. Save

След това → `/admin/google-setup` на новия домейн работи правилно.

---

## 5. Code updates — `.com` → `.org` (Phase 4)

**~20 occurrences в 9 файла** които трябва да се обновят преди launch. Ще ги направя автоматично с един commit:

### Файлове с .com references:

| Файл | Occurrences | Type |
|---|---|---|
| `messages/en.json` | 4 | Privacy policy email mentions + website name |
| `messages/bg.json` | 4 | Същите полета на BG |
| `components/contact/ContactInfo.tsx` | 2 | `alex@ridewithalex.com` email link (href + display) |
| `components/shared/SiteFooter.tsx` | 2 | Same email link in footer |
| `components/terms/TermsContent.tsx` | 2 | Legal contact email |
| `components/privacy/PrivacyContent.tsx` | 2 | GDPR contact email |
| `app/[locale]/opengraph-image.tsx` | 1 | Dynamic OG image footer text |
| `lib/google/calendar.ts` | 1 | Calendar event description "auto-created by ridewithalex.com" |
| `lib/email/client.ts` | 2 | Email template footer "ridewithalex.com · bansko" |

**Execution:** един `sed`-style replace на всички `.com` → `.org` в тези файлове + commit.

### Документация (non-critical, update after launch):

`docs/` и `memory/` съдържат исторически references към `.com`. Ще бъдат обновени в session note за launch, но не блокират deploy.

---

## 6. Env vars update (Phase 5)

### Vercel Dashboard → Project Settings → Environment Variables

**Обнови** (Production + Preview environments):

| Variable | Old value | New value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ridewithalex.vercel.app` | `https://ridewithalex.org` |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` | `booking@ridewithalex.org` (или `alex@ridewithalex.org`) |
| `GOOGLE_CLIENT_ID` | _(unchanged)_ | _(unchanged)_ |
| `GOOGLE_CLIENT_SECRET` | _(unchanged)_ | _(unchanged)_ |
| `GOOGLE_CALENDAR_ID=primary` | _(unchanged)_ | _(unchanged)_ |
| Supabase vars (× 5) | _(unchanged)_ | _(unchanged)_ |
| `TZ=Europe/Sofia` | _(unchanged)_ | _(unchanged)_ |

### Local `.env.local` — същата промяна
```
NEXT_PUBLIC_SITE_URL=https://ridewithalex.org
RESEND_FROM_EMAIL=booking@ridewithalex.org
```

**Важно:** тези env промени изискват redeploy на Vercel (не е automatic). След обновяване → Vercel Deployments → trigger new production deployment.

**Impact:**
- `sitemap.xml` сега ще показва `https://ridewithalex.org/...` URLs
- `robots.txt` → `Sitemap: https://ridewithalex.org/sitemap.xml`
- OpenGraph metadata `metadataBase: new URL(BASE_URL)` → absolute URLs работят правилно
- Google OAuth redirect URI ще матч-ва какво е в env

---

## 7. Resend domain verification (Phase 6 — unblocks T025)

### Стъпки в Resend Dashboard:

1. [resend.com/domains](https://resend.com/domains) → **+ Add Domain**
2. Domain: `ridewithalex.org` → Add
3. Resend показва **4 DNS records** които трябва да добавиш в Cloudflare:

#### DNS records за Resend verification

| Type | Name | Value | Notes |
|---|---|---|---|
| **TXT** | `send._domainkey.ridewithalex.org` | `p=MIGfMA0GCSq...` (дълъг string, Resend го дава) | DKIM signing key |
| **MX** | `send.ridewithalex.org` | `feedback-smtp.us-east-1.amazonses.com` (priority 10) | Bounce feedback |
| **TXT** | `send.ridewithalex.org` | `v=spf1 include:amazonses.com ~all` | SPF |
| **TXT** | `_dmarc.ridewithalex.org` | `v=DMARC1; p=none;` | DMARC policy |

Добавяш ги всичките в Cloudflare → DNS, Proxy: 🔘 **DNS only**, TTL: Auto.

### Verification в Resend
След добавяне на records → Resend → **Verify** → чакаш ~5-30 мин за propagation. Status става ✅ **Verified**.

### След verification
Можеш да send-ваш от всеки email `@ridewithalex.org`. Update `RESEND_FROM_EMAIL=booking@ridewithalex.org` (или `alex@...`).

---

## 8. Verification checklist (Phase 7)

След всички horn промени, test end-to-end:

### Basic connectivity
- [ ] `https://ridewithalex.org` → HTTP 200, shows home
- [ ] `https://www.ridewithalex.org` → redirects to apex
- [ ] `http://ridewithalex.org` → redirects to HTTPS
- [ ] SSL cert valid (not self-signed, не expired)
- [ ] `curl -I https://ridewithalex.org` → `server: Vercel` header

### All routes live
- [ ] `/en`, `/bg` (home)
- [ ] `/en/lessons`, `/en/about`, `/en/pricing`, `/en/gallery`, `/en/reviews`, `/en/contact`, `/en/book`, `/en/terms`, `/en/privacy`
- [ ] Same за `/bg/*`
- [ ] `/sitemap.xml` shows `ridewithalex.org` URLs
- [ ] `/robots.txt` shows `ridewithalex.org` sitemap link
- [ ] `/en/opengraph-image` returns 1200×630 PNG

### Booking flow
- [ ] `/book` loads, SlotPicker renders, video backdrop plays
- [ ] Make test booking → POST /api/bookings success
- [ ] `bookings` + `time_slots` rows created in Supabase
- [ ] Google Calendar event created в твоя calendar
- [ ] Customer confirmation email received (**от `booking@ridewithalex.org`**)
- [ ] Alex notification email received at `RESEND_TO_EMAIL`
- [ ] Confirmation page `/book/confirmed/[id]` shows details

### Admin panel
- [ ] `/admin/login` loads, can sign in
- [ ] `/admin/bookings` shows test booking
- [ ] `/admin/google-setup` shows Google account connected (от new domain redirect URI)

### SEO
- [ ] View page source → `<title>` показва per-page custom title
- [ ] `<meta property="og:image">` сочи към `https://ridewithalex.org/opengraph-image`
- [ ] `<meta property="og:url">` = `https://ridewithalex.org/...`
- [ ] Test Twitter/Facebook preview: https://metatags.io/?url=https://ridewithalex.org

---

## 9. Rollback plan (ако нещо се счупи)

**Основен принцип:** `ridewithalex.vercel.app` остава активен по всяко време. Ако `ridewithalex.org` fail-ва, users могат да ползват vercel URL-а.

### Quick rollback сценарии:

**A. SSL не се issue-ва от Vercel:**
- Провери DNS records (A → 76.76.21.21, CNAME → cname.vercel-dns.com)
- Cloudflare proxy MUST be grey cloud (DNS only)
- Чакай до 30 мин
- Ако persist — Vercel Support

**B. Google OAuth не работи от новия домейн:**
- Провери redirect URI включва `https://ridewithalex.org/...`
- Test incognito window (cache изчистен)

**C. Emails не идват след Resend domain verification:**
- Провери DNS records всички 4 са добавени
- Verify status в Resend dashboard
- Fallback: revert `RESEND_FROM_EMAIL=onboarding@resend.dev` temporarily

**D. Home page не зарежда:**
- Провери DNS resolve (nslookup)
- Vercel Deployments → последен deployment status
- Rollback to previous Vercel deployment via dashboard

**Ultimate rollback:** Cloudflare → Pause Cloudflare → всички traffic идват directly (без CDN) → проверяваш какво е счупено.

---

## 10. Timeline estimate

При всичко готово + creds:
- **Phase 1-3 (DNS + Vercel + OAuth update):** ~30 мин (повечето е wait за DNS propagation)
- **Phase 4 (code `.com` → `.org`):** ~10 мин orchestrator execute-self
- **Phase 5 (env vars + redeploy):** ~10 мин
- **Phase 6 (Resend domain):** ~30 мин (DNS propagation отново)
- **Phase 7 (verification):** ~20 мин end-to-end test

**Total: ~2 часа** за пълна migration с всички phases.

---

## 11. Execution order

Препоръчителна последователност:

1. **Най-напред:** Phase 4 — code updates `.com` → `.org` + commit + push (не изисква DNS, да е готов преди домейнът да е активен)
2. **После:** Phase 1 (Cloudflare DNS) + Phase 2 (Vercel domain) — паралелно
3. **Wait** за DNS propagation (~5-30 мин)
4. **Phase 5** (env vars + redeploy) — SITE_URL update-ва sitemap/OG
5. **Phase 3** (Google OAuth update) — може и преди redeploy
6. **Phase 6** (Resend verify) — паралелно с останалите
7. **Phase 7** (verification) — накрая

---

## 12. Post-launch (не-блокери)

След основната migration работи:

- [ ] Update `docs/*` references от `.com` → `.org` (historical context update)
- [ ] Update `memory/*` project memories
- [ ] Add `301 redirect` from `ridewithalex.vercel.app` → `ridewithalex.org` (optional — via Vercel Project Settings → Domains → mark vercel URL като "redirect")
- [ ] Submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit to [Bing Webmaster](https://www.bing.com/webmasters)
- [ ] Rotate Supabase creds (memory `project_resend_domain_pending.md` споменава това се налага)

---

## Dependencies

- T025 (Resend domain verification) → **unblocked** когато Phase 6 завърши
- T017 (final QA + launch) → зависи от Phase 7 verification checklist

---

## Reports

_(попълва се по време / след execute)_
