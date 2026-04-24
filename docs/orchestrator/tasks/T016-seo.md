# T016 · SEO (sitemap + robots + metadata + OG images)

Финален SEO layer преди launch. Добавя sitemap.xml, robots.txt, per-page OpenGraph + Twitter metadata, и dynamic OG image.

## Файлове (5 нови + 3 обновени)

**Нови:**
- `app/sitemap.ts` — auto-generated sitemap.xml за всички 10 routes × 2 locale-а
- `app/robots.ts` — disallow `/admin` + `/api`, sitemap link
- `app/[locale]/opengraph-image.tsx` — dynamic OG image via `next/og` (edge runtime, 1200×630)
- `app/[locale]/twitter-image.tsx` — re-export на OG image за Twitter

**Обновени (metadata):**
- `app/[locale]/layout.tsx` — title template + default OG/Twitter metadata + metadataBase
- `app/[locale]/page.tsx` — home-specific title
- `app/[locale]/book/page.tsx` — book page metadata

Секундарните страници (`/lessons`, `/pricing`, `/about`, etc.) използват default-ите от layout-а. Title template прави автоматично `{page} — ridewithalex`.

## Scope clarification

- **Title template:** `{pageTitle} — ridewithalex` (default: `ridewithalex — private snowboard lessons in bansko`)
- **Description source:** reuse existing `{page}.subtitle` от messages файловете — никакви нови SEO translations
- **OG image:** single dynamic image per locale (black background, brand typography) — no per-page variants за MVP
- **Canonical URLs:** automatic от Next.js + next-intl routing

## Acceptance

- [ ] `/sitemap.xml` връща XML с 20 entry-та (10 paths × 2 locales)
- [ ] `/robots.txt` показва disallow за `/admin` + `/api` + sitemap link
- [ ] `/en/opengraph-image` и `/bg/opengraph-image` връщат 1200×630 PNG
- [ ] `<meta name="description">`, `<meta property="og:*">`, `<meta name="twitter:*">` присъстват на home + book + lessons + pricing
- [ ] Title template работи: `/en/lessons` → `<title>lessons — ridewithalex</title>`
- [ ] Build/tsc/lint pass
- [ ] Commit: `feat(T016): seo layer with sitemap, robots, metadata, dynamic og image`

---

## Reports

_(попълва се след изпълнение)_
