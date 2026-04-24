# T026 · Scroll video scrubbing — analysis + plan

> **Статус:** 🟡 В планиране — Alex преглежда + одобрява approach преди execute.

Цел: добавяне на scroll-driven видео анимация на `/lessons` (и потенциално други страници) за да направи вътрешните страници по-кинематографни.

---

## 1. Анализ на source видеото

`vecteezy_snowboarder-carving-through-fresh-powder-on-a-sunny-mountain_77379843.mp4`

| Параметър | Стойност | Web-ready? |
|---|---|---|
| Резолюция | 1920×1080 | ✅ |
| Framerate | 24 fps | ✅ |
| Duration | 8.06 секунди | ✅ (добре за scroll mapping) |
| Codec | H.264 | ✅ |
| **Bitrate** | **26 Mbps** | ❌ **хагаден** (уеб стандарт е 2-8 Mbps) |
| **File size** | **26 MB** | ❌ (стандарт за hero видео: 2-6 MB) |
| Keyframe interval | ~2-5s (предполагам) | ❌ **критично за scroll scrubbing** — нужен е **every-frame** keyframe |

**Необходима обработка преди deploy:**
- Re-encode с `CRF 23` + `-g 1` (keyframe всеки frame → instant seek)
- Target: ~3-5 MB за 1080p, ~1.5-2 MB за 720p mobile
- `-movflags +faststart` за stream-friendly поведение
- Без audio (scrubbing не използва звук)

ffmpeg е достъпен локално — мога да го направя с една команда при execute.

---

## 2. Техники за scroll scrubbing — 3 opciones

### Опция A — Native `<video>` + `currentTime` manipulation

```
scroll % → video.currentTime = progress × video.duration
```

| Pro | Con |
|---|---|
| Най-лесно (50 реда React код) | **iOS Safari е flaky** — buffering, judder |
| Малки чанджове в UI | Изисква re-encode с every-frame keyframes |
| Без допълнителна подготовка | Понякога черни кадри между keyframes |

### Опция B — Frame sequence + canvas (Apple technique)

Експорт на видеото в 60-120 JPG кадъра. Preload. Рисуваме current frame на `<canvas>` спрямо scroll.

| Pro | Con |
|---|---|
| **Идеално плавно** на всички устройства (включително iOS) | По-сложна имплементация (preloader + canvas) |
| Няма video codec quirks | Има memory cost (60 × ~40KB = ~2.4 MB в памет) |
| Често по-малки overall (WEBP frames) | Нужна е pre-processing стъпка (ffmpeg + оптимизация) |

Това е техниката зад [Apple AirPods Pro](https://www.apple.com/airpods-pro/) scroll sequences.

### Опция C — Hybrid (low-quality preview + desktop full video)

Ship 2 видеа — 720p mobile + 1080p desktop, `<video srcset>`-style. Still native video approach.

| Pro | Con |
|---|---|
| По-малки файлове на mobile | Пак е native video (iOS проблем) |
| 2× encoding работа | Не решава principal iOS issue |

---

## 3. Препоръка

**→ Опция B (frame sequence + canvas)** за production quality.

Причини:
- **Плавност** — никакви codec surprises
- **Мобилна съвместимост** — работи навсякъде без special handling
- **Performance** — canvas rendering е често по-бърз от video seek
- **Fallback** — ако JS не се зарежда, първият frame остава като static background

Недостатъкът (сложност) е еднократен — веднъж написан, компонентът е reusable за други страници (и потенциално hero секцията).

**Ако приоритет е скорост на shipping** → Опция A + повторно оптимизирано видео. Приемлив за desktop-heavy audience; може да има judder на стари iPhone-и.

---

## 4. UX integration с `/lessons` — 3 подхода

Текущата страница (прочетена от `app/[locale]/lessons/page.tsx`):
- PageHeader (eyebrow + title + subtitle)
- Grid с 3 lesson cards (private/kids/group)
- LessonsCta

### Подход 1 — Fullscreen fixed video (целият page над видеото)

- `<video>` / canvas с `position: fixed`, 100vw × 100vh
- Всички content-и `position: relative` над видеото
- Dark overlay (`bg-black/50 backdrop-blur-xs`) за четимост
- Scrub mapping: scroll от top до bottom на цялата страница → video 0% → 100%

```
┌────────────────────────┐
│  [snowboarder skiing]  │  ← fixed video bg (scrubs with scroll)
│                        │
│   LESSONS              │  ← content над видеото
│   three ways to ride   │
│                        │
│   [private] [kids] [group] │
│                        │
│   [CTA]                │
└────────────────────────┘
```

### Подход 2 — Sticky hero section

- Video е fullscreen **само в първия screen** (sticky, докато scroll-ваш през него)
- След като видеото е "приключило" скролването си (реално scroll-нато 100vh) → нормален контент продължава на solid black bg
- Lesson cards не са върху видео

```
┌────────────────────────┐
│  [video bg with header]│ ← sticky top, scrubs while visible
│   LESSONS              │
└────────────────────────┘
┌────────────────────────┐
│  [private] [kids] [group] │ ← normal flow, solid black
│  [CTA]                 │
└────────────────────────┘
```

### Подход 3 — Cinematic entrance (hybrid)

- Video fullscreen, sticky за първите 2 screen-а scroll
- Page header (eyebrow + title + subtitle) появява се fade-in върху видеото
- На 2×screen-scroll point → video "освобождава" и контентът продължава
- След video section, lessons grid е на solid dark bg (не върху видео)

Това е подходът на Apple Watch launch pages + много Vercel примери.

---

## 5. Моите предпочитания

**Подход 3 (cinematic entrance) + Опция B (frame sequence)**

Причини:
- Видеото функционира като **"герой момент"** вместо да е постоянен background разсейващ от съдържанието
- Lesson cards запазват настоящата си четимост на solid dark bg (не се налага да се борят с контраст върху пъстро видео)
- Matches минималистично-editorial естетика на сайта — видеото подсилва, не доминира

Ако Alex предпочита Подход 1 (видео навсякъде на страницата) → ще работи, но ще трябва:
- Много по-тъмен overlay (75%+) за четимост
- Lesson cards със по-opaque backgrounds (`bg-neutral-900/95`)
- Възможно е да изглежда "noisy"

---

## 6. Accessibility + performance

- **`prefers-reduced-motion`** → skip scrubbing, show first frame като static background. Критично за users с vestibular sensitivities.
- **Preload strategy:**
  - Опция A: `<video preload="auto">` — browser handles
  - Опция B: custom preloader с `<link rel="preload" as="image">` за първите 20 frames + progressive load
- **Loading state** — докато видеото/frames не са готови, показваме dark background + content нормално
- **scroll listener** → throttled с `requestAnimationFrame`
- **Video file в CDN** — през Vercel static assets (`/public/videos/lessons-bg.mp4`)

---

## 7. Scope разширение — други страници?

Alex спомена *"скучните вътрешни страници"* (множествено число). Кои други се квалифицират за същата обработка?

| Страница | Подходящо за scroll video? | Видео asset? |
|---|---|---|
| `/lessons` | ✅ (тази задача) | ✅ |
| `/about` | ✅ (story page, video пасва) | Нужен различен asset (Alex teaching? landscape?) |
| `/pricing` | ⚠️ (повече информация-heavy, видео може да разсейва) | — |
| `/contact` | ✅ (short page, video-ready) | ✅ (може да reuse-не lessons видеото) |
| `/gallery` | ❌ (galleries са саморе-noisy) | — |
| `/reviews` | ❌ (text-heavy, нужен е фокус) | — |
| `/terms`, `/privacy` | ❌ (legal, design трябва да остане плосък) | — |

**Препоръка:** правим T026 само за `/lessons` сега. Ако Alex хареса резултата → пускаме T027 за `/about` + `/contact` със същия component и различни видео assets.

---

## 8. Въпроси за Alex преди execute

**Q1 — Approach:** Опция A (simple native video) или Опция B (frame sequence, best quality)?
- Препоръчвам B. Отнема ~2× по-дълго но няма да трябва fix-ове после.

**Q2 — UX подход:** Подход 1 (video навсякъде), 2 (video само hero, sticky), или 3 (cinematic entrance, препоръка)?
- Препоръчвам 3.

**Q3 — Другите страници:** само `/lessons` сега, или отваряме директно T027 за `/about` + `/contact`?
- Препоръчвам **само `/lessons` сега** + review преди expansion.

**Q4 — Audio:** Оставяме ли видеото muted + без audio track (препоръка), или запазваме аудиото за бъдеща user-triggered play?
- Препоръчвам muted + no audio (scrubbing не ползва; audio само утежнява файла).

**Q5 — Loop behaviour:** Когато user достигне края на scroll range → последният frame замръзва (препоръка) или видеото се loop-ва?
- Препоръчвам freeze — loop на scrub изглежда странно.

---

## 9. Ако Alex одобри → task план

**Execution sequence:**

1. **Video prep (~5 мин)** — ffmpeg команди:
   - Option B: export frame sequence (JPG 1920×1080 на 12 fps → ~100 frames)
   - Optimize всеки frame с mozjpeg / webp
   - Total target: <3 MB bundled
   - Output: `public/videos/lessons/frame-{001..100}.jpg` (или `.webp`)

2. **Component development (~30-45 мин):**
   - `components/shared/ScrollVideo.tsx` (client component) с Canvas + Intersection Observer + rAF-throttled scroll listener
   - Preloader с progress indicator
   - `prefers-reduced-motion` fallback
   - Responsive (desktop + mobile layouts)

3. **Integration (~15 мин):**
   - Update `app/[locale]/lessons/page.tsx` с ScrollVideo wrapper
   - Tweak card backgrounds ако е нужно за contrast
   - Test на Chrome + Safari + iOS Safari (simulator)

4. **QA (~15 мин):**
   - Browser/device matrix test
   - Reduced motion test
   - Slow 3G preload test
   - Lighthouse performance check

5. **Commit + docs:**
   - `feat(T026): scroll video scrubbing on lessons page`
   - Update STATUS + tasks/000-index + session note
   - Ако harese → write T027 spec за other pages

**Estimated total:** 1.5-2 часа execute-self, ~3-4 часа ако downstream agent.

---

## 10. Рискове

- **iOS Safari:** Ако избереш Опция A и тества не върви добре на iPhone → fallback към Опция B (rework, ~45 min extra).
- **Video too "busy":** Ако snowboarding footage е твърде dinamic и lesson cards се губят → може да трябва pause-able segments или по-slow playback scrubbing curve.
- **Scroll mapping:** Different page lengths (desktop vs mobile) означават различни scroll-to-video ratios — ще го handle-на с `getBoundingClientRect`-based mapping, не с fixed pixels.
- **SEO:** Lighthouse ще markира ако video preload е агресивен. Ще balance-ваме.

---

## Decision matrix — quick summary

| Въпрос | Препоръка | Alternative |
|---|---|---|
| Технически подход | **Опция B** (frames) | Опция A (video) ако бързаш |
| UX integration | **Подход 3** (cinematic entrance) | Подход 1 (видео навсякъде) |
| Scope | **Само `/lessons`** | Expand до `/about` + `/contact` post-review |
| Audio | **Muted, no track** | — |
| Loop | **Freeze last frame** | — |

---

## Reports

_(попълва се след execute, ако Alex одобри plan-а)_
