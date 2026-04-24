# Session s16 · 2026-04-24 · T_DOMAIN migration — ridewithalex.org live

## Context

След s15 (Wave 4 complete) сайтът живееше на `ridewithalex.vercel.app`. Alex купи `ridewithalex.org` от Cloudflare (избра .org, не .com) и поиска full API-driven migration.

Настройка: Cloudflare = DNS only (grey cloud, без proxy), Vercel управлява SSL + edge.

## Decision flow

1. Alex даде Cloudflare API token (Edit zone DNS scope за `ridewithalex.org`) + Resend Full Access key
2. Orchestrator автоматизира DNS + Vercel + Resend през API
3. Alex ръчно направи Google OAuth redirect URIs update (няма практичен Google API за това)

## Execution

### Phase 1 — Code `.com` → `.org` (commit `b7476f2`)
9 файла, 19 occurrences обновени:
- `messages/{en,bg}.json` (privacy policy copy + website mentions)
- `components/contact/ContactInfo.tsx` (email link)
- `components/shared/SiteFooter.tsx` (footer email)
- `components/terms/TermsContent.tsx` + `components/privacy/PrivacyContent.tsx` (legal contact emails)
- `app/[locale]/opengraph-image.tsx` (OG image footer text)
- `lib/google/calendar.ts` (event description string)
- `lib/email/client.ts` (email template footer)

### Phase 2 — Cloudflare DNS (via Cloudflare API)
Zone ID: `d9952b5b02d35ac62934db6fb80c6f5a`
- A record: `@` → `76.76.21.21` (Vercel apex)
- CNAME: `www` → `cname.vercel-dns.com`
- Proxy: `false` (DNS only/grey cloud — задължително за Vercel)

### Phase 3 — Vercel domain add (via Vercel API)
Project ID: `prj_FQHT8P5es39czydcV84kBCyRpAsj`
- `ridewithalex.org` → primary (`verified: true` immediately)
- `www.ridewithalex.org` → 308 redirect to apex
- SSL cert auto-issued от Vercel/Let's Encrypt (~instant)

### Phase 4 — Google OAuth (Alex ръчно, 3 мин)
Cloud Console → OAuth client → redirect URIs:
- ❌ Removed: `https://ridewithalex.com/api/auth/google/callback`
- ➕ Added: `https://ridewithalex.org/api/auth/google/callback`
- ➕ Added: `https://www.ridewithalex.org/api/auth/google/callback`

### Phase 5 — Resend domain verify (via Resend + Cloudflare APIs)
Resend domain ID: `f24aff57-4ba8-4d5c-8ec3-bda7aaad3479` (region: eu-west-1)
DNS records автоматично добавени в Cloudflare zone:
- DKIM TXT: `resend._domainkey.ridewithalex.org`
- MX: `send.ridewithalex.org` → `feedback-smtp.eu-west-1.amazonses.com` priority 10
- SPF TXT: `send.ridewithalex.org` → `v=spf1 include:amazonses.com ~all`
- DMARC TXT: `_dmarc.ridewithalex.org` → `v=DMARC1; p=none;`

Status прехвърли от `pending` → `verified` за ~30 секунди (DNS propagation от 1.1.1.1 беше моментално).

### Phase 6 — Vercel env vars + redeploy
- Added: `NEXT_PUBLIC_SITE_URL=https://ridewithalex.org` (production + preview)
- Updated: `RESEND_FROM_EMAIL` = `booking@ridewithalex.org` (от sandbox `onboarding@resend.dev`)
- Attempted: `TZ=Europe/Sofia` → **blocked** (Vercel reserved env var). Known pre-existing issue, not migration-introduced. Fix като follow-up task.
- Trigger: empty commit `f0f3d9d` → auto-deploy READY

### Phase 7 — Verification

**Automated checks (curl):**
- [x] 7/7 routes → HTTP 200 (`/en`, `/bg`, `/en/lessons`, `/en/book`, `/en/about`, `/sitemap.xml`, `/robots.txt`)
- [x] `sitemap.xml` показва `https://ridewithalex.org/...` URLs
- [x] `robots.txt` → `Host: https://ridewithalex.org` + Sitemap link
- [x] `www.ridewithalex.org` → 308 Permanent Redirect към apex
- [x] `og:url` meta tag = `https://ridewithalex.org/en`
- [x] Resend test email sent: ID `db99bde1-f0f4-4b24-84c2-a2a198cac3fa` from `booking@ridewithalex.org` → verified delivery

## Commits

1. `1bd246a` — `docs(T_DOMAIN): full migration plan for ridewithalex.org (cloudflare DNS-only)` (pre-execution plan)
2. `c29529e` — `docs(T_DOMAIN): step-by-step runbook with YOU/ME split (api-driven migration)` (execution doc with phases)
3. `b7476f2` — `chore(domain): replace ridewithalex.com -> ridewithalex.org sitewide` (Phase 1)
4. `f0f3d9d` — `chore(deploy): trigger rebuild with new NEXT_PUBLIC_SITE_URL + RESEND_FROM_EMAIL` (env var redeploy)
5. (pending) — `docs(s16): T_DOMAIN + T025 complete` (final cleanup)

## Deviations from original plan

- **Resend records от API returned 3 not 4** (DKIM + SPF TXT + MX, без DMARC). DMARC е optional — добавих го manually в Cloudflare за coverage.
- **TZ=Europe/Sofia blocked** от Vercel (reserved env var) — timezone handling на slot generation остава pre-existing bug (Vercel runtime UTC → slot hours offset). Ще се fix-не с `Intl.DateTimeFormat` или `date-fns-tz` в code. Non-blocker за launch.

## Remaining follow-ups

- [ ] Fix slot timezone handling (Intl.DateTimeFormat вместо setHours) — small code change, ~10 reda
- [ ] Rotate Cloudflare token (paste-нат в чат история)
- [ ] Rotate Supabase creds (долгосрочен backlog, отбелязан в `memory/project_resend_domain_pending.md`)
- [ ] Update historical docs referencing `.com` (low priority)
- [ ] Submit sitemap to Google Search Console + Bing Webmaster
- [ ] `vercel.app` → `.org` 301 redirect (optional — може да остане двете active)

## Active time

- Alex: ~10 мин (2 tokens + Google OAuth update)
- Orchestrator: ~30 мин (API calls + verification)
- DNS/SSL propagation: ~минимално, всичко propagate-на почти моментално (зоната е фрашка + 1.1.1.1 DNS cache minimal)
- **Total:** ~45 мин от start до verified live

## Next — launch prep

Основната функционалност + domain миграция завършени. Остава:

- **T017 (launch prep)** — финален QA checklist, SEO submission, social preview testing, spam folder checks за customer emails
- **T016 (SEO)** — вече done s15; само verify че sitemap/OG URLs работят на новия домейн (потвърдено в Phase 7)
- **Fix slot timezone handling** — non-blocker но полезно преди първия реален booking

Wave 4 + T_DOMAIN + T025 complete. Сайтът е production-ready на `ridewithalex.org`.
