# SEO + Indexing Runbook — `ridewithalex.org`

> Стъпка-по-стъпка за финализация на indexing в Google, Bing, Yandex. След този runbook сайтът е подаден към search engines с правилна structured data + sitemap.

**Статус на техническата SEO layer (вече done):**
- ✅ `sitemap.xml` — 20 URLs (10 paths × 2 locales) с hreflang alternates
- ✅ `robots.txt` — disallow `/admin` + `/api`, sitemap link
- ✅ `opengraph-image` — dynamic 1200×630 PNG per locale
- ✅ `twitter-image` — re-export от OG
- ✅ Title template `%s — ridewithalex` per locale
- ✅ `metadataBase` — absolute URLs за OG/Twitter
- ✅ `canonical` + `alternates.languages` (hreflang) per page
- ✅ **JSON-LD structured data:**
  - LocalBusiness + WebSite на home (Google Map Pack eligibility)
  - Service (/lessons) с 3 price offers
  - FAQPage (/contact) — Google FAQ rich result
  - BreadcrumbList (на lessons, contact)
- ✅ `manifest.webmanifest` — PWA/mobile home screen
- ✅ `keywords`, `authors`, `applicationName` meta
- ✅ `formatDetection` — auto-link emails + phones

**Pending — изисква ръчна работа от Alex:**

---

## Phase 1 — Google Search Console (5 мин) 🧑 ТИ

Google Search Console = dashboard-ът който показва как Google индексира сайта, какви queries докарват трафик, и submit-ване на sitemap за по-бързо откриване.

### Стъпки

1. Отвори [search.google.com/search-console](https://search.google.com/search-console)
2. **Add property** → избери **Domain** (не URL prefix)
3. Въведи: `ridewithalex.org` → Continue
4. Google показва **DNS verification TXT record** във формат:
   ```
   google-site-verification=ABCDEFGH1234567890...
   ```
5. **Копирай tо в чата** в следния формат:
   ```
   GSC_VERIFICATION=google-site-verification=<целия низ>
   ```
6. Аз автоматично ще добавя TXT record през Cloudflare API
7. Върни се в Search Console → **Verify** → ✅ Verified

### След verification
8. Менюто → **Sitemaps** → **Enter sitemap URL:**
   ```
   sitemap.xml
   ```
9. **Submit** → Google започва crawl в ~24-72h

---

## Phase 2 — Bing Webmaster Tools (5 мин) 🧑 ТИ

Bing включва и Yahoo + DuckDuckGo (те използват Bing index-а), така че това е не по-малко важно от Google за reach.

### Стъпки

1. Отвори [bing.com/webmasters](https://www.bing.com/webmasters)
2. Sign in (Microsoft account или Google)
3. **+ Add site** → въведи `https://ridewithalex.org` → Add
4. Bing предлага 3 verification опции — избери **XML file** или **Meta tag** ИЛИ **CNAME**. Най-лесно: **Meta tag**.
   - Показва се ред като: `<meta name="msvalidate.01" content="ABCD1234..." />`
   - Копирай **само content стойността** (не целия meta tag)
5. **Paste в чата:**
   ```
   BING_VERIFICATION=<content стойността>
   ```
6. Аз ще го добавя в `app/[locale]/layout.tsx` metadata → redeploy
7. Върни се в Bing Webmaster → **Verify** → ✅

### След verification
8. Dashboard → **Sitemaps** → **Submit sitemap:**
   ```
   https://ridewithalex.org/sitemap.xml
   ```
9. Bing започва crawl в ~24-48h

**Бонус:** Bing Webmaster позволява import от Google Search Console директно — скъсява setup-а.

---

## Phase 3 — IndexNow (автоматично indexing trigger, 1 мин) 🤖 АЗ

IndexNow е протокол (спонсориран от Microsoft + Yandex) за instant notification когато публикуваш нов content. Подкрепен от Bing, Yandex, Seznam, Naver.

След като Bing verification е done, аз автоматично:
1. Generate random IndexNow key (32 hex chars)
2. Публикувам го като `/{key}.txt` в public folder
3. Добавям TXT DNS record референциращ го
4. Ping https://api.indexnow.org/indexnow с всички sitemap URLs

Резултат: Bing/Yandex започват crawl на новите страници в **минути**, не дни.

---

## Phase 4 — Rich Results testing 🧑 ТИ (optional, 2 мин)

След deploy-а, test дали Google правилно парсира structured data:

1. [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. Въведи: `https://ridewithalex.org/en`
3. **Test URL**
4. Проверка: трябва да видиш **"Valid items found"** с:
   - ✅ LocalBusiness
   - ✅ WebSite
5. Повтори за `/en/lessons` (Service) + `/en/contact` (FAQPage)

Ако нещо показва грешка — paste скрийншот и ще го оправя.

---

## Phase 5 — Social preview testing 🧑 ТИ (2 мин)

Тест дали OpenGraph изглежда добре when споделяш линка:

1. [metatags.io](https://metatags.io) → въведи `https://ridewithalex.org/en` → Check
2. [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) → test Twitter card
3. LinkedIn: [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/) → test
4. Facebook: [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) → test

Всички трябва да показват:
- Title: `ridewithalex — private snowboard lessons in bansko`
- Description: от tagline
- Image: 1200×630 black hero с "ride/with/alex" typography

---

## Phase 6 — Analytics (optional, 5 мин) 🧑 ТИ + 🤖 АЗ

Ако искаш да tracking-ваш visits (препоръка — минимум Vercel Analytics вградено, безплатно):

**Option A — Vercel Analytics (recommended):**
1. Vercel Dashboard → project → **Analytics** tab → **Enable**
2. Безплатен tier = 2.5K visitors/month, Real User Metrics + Speed Insights

**Option B — Plausible / Umami (privacy-first):**
Self-hosted или cloud. Изисква добавяне на <script> tag + env var.

**Option C — Google Analytics 4:**
Повечето features, но requires GDPR consent banner.

Кажи кое искаш и добавям integration-а.

---

## Checklist — какво ти трябва да направиш

- [ ] **Phase 1** — Google Search Console verify token → paste в чата
- [ ] **Phase 2** — Bing Webmaster verify token → paste в чата
- [ ] **Phase 4** — Rich results test (визуална проверка)
- [ ] **Phase 5** — Social preview test (визуална проверка)
- [ ] **Phase 6** — Изберете analytics option

## Какво аз правя когато имам tokens

```
Task 29 pending: add verification TXT/meta via Cloudflare API + Next.js metadata
Task 30 pending: submit sitemaps + trigger IndexNow + verify success
```

---

## Bonus — Core Web Vitals optimization

След launch, ще пусна Lighthouse audit на production. Ако има issues (CLS, LCP, TBT), ще ги fix-на:
- **LCP (largest contentful paint)** — оптимизация на hero video poster, frame preload
- **CLS (cumulative layout shift)** — reserve space за images, avoid FOIT
- **TBT (total blocking time)** — split bundle, defer non-critical JS

Target: **90+ Performance score** в Lighthouse (добрая за Google ranking boost).

---

## Timeline до първите search results

Реалистични очаквания:
- Google verification: **immediate** (след DNS propagation 5-30 мин)
- Google първо indexing: **3-7 дни**
- Google первые ranking positions: **2-4 седмици**
- Bing indexing: **1-3 дни** (по-бързо отколкото Google)
- Bing rankings: **2-3 седмици**

SEO е игра на търпение. Structured data + sitemap = печелим всички leverage-и които имаме.
