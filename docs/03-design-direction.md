# 03 · Дизайн посока

> **Посока:** минималистичен, модерен, изчистен. Editorial brutalism meets calm. Черно и бяло, кинематично видео, големи lowercase заглавия. Нищо декоративно, всичко служи на усещането "планината и ти".

## Дизайн философия

1. **Тишина > шум.** Пустото пространство е функция, не дефицит.
2. **Видеото разказва, текстът само подсказва.** Hero-то е 90% картина, 10% думи.
3. **Lowercase навсякъде.** Дори заглавия, бутони, навигация. Смирено, модерно, не крещи.
4. **Монохром.** Черно, бяло, и нюанси сиво. Никакви акцентни цветове. Контрастът идва от силата на снимките и типографията, не от палитра.
5. **Типографията е герой.** Гигантски, плътни, stagger-нати думи. Tight letter-spacing, short line-height.

## Цветова палитра (strict)

| Token | HEX | Tailwind | Употреба |
|---|---|---|---|
| Black | `#000000` | `bg-black` | Основен фон навсякъде |
| White | `#FFFFFF` | `text-white` | Основен текст |
| Neutral-900 | `#171717` | `bg-neutral-900` | Pill навигация, карти |
| White / 90 | `rgba(255,255,255,0.9)` | `text-white/90` | Параграфи |
| White / 70 | `rgba(255,255,255,0.7)` | `text-white/70` | Sub-labels |
| White / 40 | `rgba(255,255,255,0.4)` | `bg-white/40` | Divider линии |

**Нула цветни акценти.** Без оранжево, синьо, зелено. Ако някога добавим color, то е само за eror/success състояние, не за brand.

## Типография

**Шрифт:** [Onest](https://fonts.google.com/specimen/Onest) — geometric, леко rounded sans-serif. Чете се отлично и на латиница, и на кирилица — което е критично, понеже BG е first-class locale за сайта.

**Защо Onest, а не Readex Pro (първоначален избор):** Readex Pro няма cyrillic subset в Google Fonts (нито в source-а), което би значило system font fallback за BG страниците. Onest запазва същия geometric editorial feel, но с пълна cyrillic поддръжка.

**Weights за зареждане:** 300, 400, 500, 600, 700

**Правила за заглавия (`.hero-title`):**
```css
font-family: 'Onest', system-ui, sans-serif;
letter-spacing: -0.04em;
line-height: 0.95;
text-transform: lowercase;
```

**Скали:**
| Level | Размер (mobile / desktop) | Употреба |
|---|---|---|
| Hero word | `14vw` / `13vw` | Големи staggered думи в hero |
| H1 | `clamp(48px, 8vw, 120px)` | Секционни заглавия |
| H2 | `clamp(32px, 5vw, 64px)` | Подсекции |
| H3 | `24px` | Карти, параграфни заглавия |
| Body | `16px` / `18px` | Основен текст |
| Caption | `12px` / `14px` | Sub-labels, footer |

**Всичко lowercase. Без изключения.** Дори "Alex" става "alex" в UI (името остава "Alex" за SEO и legal страници).

## Hero секция — спец

Това е централният момент от сайта. Ето точна спецификация:

### Структура
```tsx
<section className="relative h-screen w-full overflow-hidden bg-black">
  <video
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay loop muted playsInline
    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
  />
  {/* лек черен овърлей, за да изпъкне текста */}
  <div className="absolute inset-0 bg-black/20" />
  {/* градиент към дъното за четимост на долните elements */}
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

  <Navbar />
  <HeroContent />
</section>
```

### Stagger-нати думи — ✅ финализирано

**Избран вариант: `ride` · `with` · `alex`** — призивно, action-first, лично.

```
ride         ← top-left       (left-4 md:left-10, top-[18%])
    with     ← top-right      (right-4 md:right-10, top-[38%])
        alex ← center-left    (left-[18%] md:left-[28%], top-[58%])
```

Всяка дума е:
```tsx
<h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw]">
  ride
</h1>
```

с `.hero-title` CSS клас:
```css
.hero-title {
  font-family: 'Onest', system-ui, sans-serif;
  letter-spacing: -0.04em;
  line-height: 0.95;
  text-transform: lowercase;
}
```

**Анимация при зареждане:** трите думи се появяват stagger-нато — `ride` при 0ms, `with` при 120ms, `alex` при 240ms. Всяка: `opacity 0 → 1` + `translateY 12px → 0` за 600ms (ease-out).

**Алтернативи (отхвърлени, за референция):**
- ~~`your · line · bansko`~~ — поетично, но по-малко действено
- ~~`snow · party · bansko`~~ — brand-first, но губи личния аспект

### Описателен параграф
`max-w-[260px]`, `text-[15px]`, `text-white/90`, поставен вляво около `top-[46%]`:

> "private snowboard lessons in bansko. your pace, your mountain, your progress."

### Stat блокове — потвърдени

Три малки стат блока — горе-дясно, долу-ляво, долу-дясно — с диагонален разделител и голямо число. Всеки с `rotate-[20deg]` или `rotate-[-20deg]` бяла линия `h-px w-24 bg-white/40` до числото.

**Позиция 1 (top-right):** `+8` / `years teaching` ✅
**Позиция 2 (bottom-left):** `+500` / `riders taught` ✅
**Позиция 3 (bottom-right):** _чака избор_ — виж варианти долу

**Варианти за 3-та позиция (без ревюта засега):**

| Вариант | Число | Sub-label | Логика |
|---|---|---|---|
| **A** ⭐ | `+12` | `countries served` | Международен credibility — туристите от UK/IL/RO веднага се свързват |
| **B** | `2` | `languages spoken` | BG + EN — достъпност за международни клиенти |
| **C** | `100%` | `personal approach` | Директно връзва с USP-то |
| **D** | `4` | `lesson packages` | Препраща към пакетите (2ч / 4ч / цял ден / седмица) |
| **E** | _премахваме_ | _(само 2 стата)_ | По-чист, по-editorial. Securify-то има 3, но 2 също работят |

**Моята препоръка:** **Вариант A** (`+12 countries served`) — дава социален proof без да искаш ревю, и таргетира точно чужди туристи, които са ти най-ценният пазар. Ако си обучавал клиенти от по-малко страни — смени числото на реалното (напр. `+7` countries).

## Navbar — floating pill

Три pill компонента подредени в една линия, `absolute top-0 left-0 right-0 z-20 px-6 md:px-10 pt-6`:

**Ляв pill — лого + бранд:**
```tsx
<div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3">
  <Logo className="h-5 w-5" />
  <span className="text-white text-sm font-normal tracking-tight">
    ridewithalex
  </span>
</div>
```

**Централен pill — навигация (скрит на мобилен):**
- `hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2`
- Линкове: `lessons`, `pricing`, `gallery`, `reviews`, `contact`
- Всеки: `text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full`

**Десен pill — CTA бутон:**
```tsx
<button className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors">
  book now
</button>
```

## Компонентен стил — останалите страници

Извън hero-то, принципите се пренасят така:

### Секции
- Пълна ширина, черен фон
- `py-24 md:py-32` — дишат
- Големи lowercase заглавия вляво, content вдясно (или обратно — асиметрия)

### Карти (пакети, услуги)
- `bg-neutral-900`, `rounded-3xl`, `p-8`
- Без border (или `border border-white/5` за едва видим контур)
- Тънки divider-и между редове: `border-t border-white/10`

### Бутони
- Primary: `bg-white text-black rounded-full px-6 py-3`
- Secondary: `border border-white/20 text-white rounded-full px-6 py-3 hover:bg-white/5`
- Всички lowercase, всички `rounded-full`

### Форми
- Инпути: `bg-transparent border-b border-white/20 focus:border-white` — линия, не кутия
- Label-и над полето, в малък, white/70
- Никакви placeholder-и като labels

### Галерия
- Mason grid или strict grid — без рамки, без shadows
- Hover: леко затъмняване + fade на caption (title + date)
- Lightbox на клик — fullscreen черно, стрелки ляво/дясно

## Анимация и motion

**Принцип:** движение когато има причина, не за декорация.

- **Hero видео** — автоплей, loop, muted (задължителен за автоплей в браузърите)
- **Скрол fade-in** на секциите — `opacity 0 → 1` с Intersection Observer, нищо повече
- **Микро hover** — 150ms transition на бутони и линкове
- **Page transition** — leaflet fade (200ms), не slide
- **Stagger при зареждане на hero думите** — появяват се една след друга с 100ms delay

Framer Motion за скрол ефектите. `prefers-reduced-motion` се спазва.

## Иконография

- [Lucide Icons](https://lucide.dev/) — outline, `stroke-width: 1.5`, бели
- Никога повече от 1 икона на визуален блок

## Логото

Трябва ново лого за **RideWithAlex**. Варианти, които ще предложа:

1. **Монограм "RWA"** — три преплетени букви, абстрактно като carve (следа от борд)
2. **Wordmark "ridewithalex"** — lowercase, Onest, с тънка линия под "ride" като следа от кант
3. **Иконично** — минималистична геометрична форма (триъгълник = планина + хоризонтална линия = следа от борд)
4. **Стрелка/chevron** — стилизирана като наклонен сноуборд отгоре, която насочва надолу/напред

Логото е бяло винаги. Никакви градиенти, никакви сенки. Векторно (SVG) за всякакъв размер.

## Mobile-first

- Навигационният център (линкове) се крие на mobile → `hidden md:flex`
- Вместо него — hamburger меню горе-дясно, което отваря fullscreen черен overlay с lowercase меню
- Hero думите остават staggered, но с 18vw-20vw, защото екранът е тесен
- Stat блоковете долу стават в колона, не разпръснати

## Препратки (за вдъхновение)

- Securify landing page промптът (даден от теб) — основен източник на стила
- [Linear.app](https://linear.app) — за изчистено мобилно
- [Framer.com](https://framer.com) — за типография и ритъм
- [Beat.app](https://beat.app) — за floating pill навигация

## Какво НЕ правим

- ❌ Никакви акцентни цветове
- ❌ Никакви обемни сенки / neumorphism
- ❌ Никакви glass-morphism на снимки (имахме го в предния драфт — махаме)
- ❌ Никакви rounded-2xl полутонове — или `rounded-full`, или `rounded-3xl`
- ❌ Никакви CAPS LOCK / Title Case / UPPERCASE
- ❌ Никакви serif шрифтове
- ❌ Никакви стокови снимки
