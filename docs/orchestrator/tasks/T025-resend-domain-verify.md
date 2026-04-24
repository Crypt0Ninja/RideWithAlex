# T025 · Resend domain verification — Wave 4 follow-up

**Блокер:** Customer confirmation emails не се изпращат (HTTP 403 `validation_error`) докато `ridewithalex.com` не бъде купен + verified в Resend. Alex-notification работи нормално.

**Защо:** Resend sandbox (без verified domain) разрешава изпращане **само** към account owner email (`crypt0ninja2@protonmail.com`). Всеки customer email различен от този → 403.

**Scope когато `ridewithalex.com` е купен:**

1. Resend dashboard → **Domains** → **+ Add Domain** → `ridewithalex.com`
2. Resend показва 3-4 DNS записа:
   - 1× TXT record за domain verification
   - 1× TXT record (SPF)
   - 2× CNAME records (DKIM)
   - Optional 1× TXT (DMARC policy)
3. Alex добавя в DNS панела на домейн регистратора (Cloudflare / Namecheap / друг)
4. Resend → Verify → auto-check DNS; прави ~5-30 мин за propagation
5. В Resend → Domains → `ridewithalex.com` трябва да показва **"Verified"**
6. Env var обновяване:
   - `.env.local`: `RESEND_FROM_EMAIL=booking@ridewithalex.com` (или `alex@ridewithalex.com`)
   - Vercel Project Settings → същата промяна
7. Redeploy (push empty commit или trigger от Vercel UI)
8. **Smoke test:** direct Resend API call от browser devtools / curl:
   ```
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"from":"booking@ridewithalex.com","to":"test@external-email.com","subject":"test","html":"<p>ok</p>"}'
   ```
   Трябва да върне `200` с `id` (не 403).
9. **End-to-end test:** създай booking с различен email → провери inbox-а + spam folder.

**Dependencies:** T_DOMAIN (купуване на `ridewithalex.com`)

**Acceptance:**
- [ ] DNS records в Resend dashboard показват ✅ verified
- [ ] `RESEND_FROM_EMAIL` сменен в `.env.local` + Vercel production
- [ ] Test email изпратен към non-owner адрес успешно (`200 OK`)
- [ ] End-to-end booking flow → customer получава confirmation email (не само Alex)

## Alternative: SendGrid single-sender (ако T_DOMAIN се забави)

Ако Alex реши да не купува домейн скоро → switch към SendGrid (free 100 email/day + single-sender verification без DNS). Pre-req: верифициран личен email. Ще изисква пренаписване на `lib/email/client.ts` на SendGrid SDK (~15 мин). Виж `memory/project_resend_domain_pending.md` за обсъждане.

---

## Reports

_(попълва се след изпълнение)_
