# Session s09 · 2026-04-23 · Wave planning + T019 спец

## Context at session start

s08 затвори с QA-V1 активна (визуална проверка от Alex на живия hero). Alex поиска да не пускаме паралелни агенти, които биха влизали в конфликт помежду си, и помоли за чисти промпти с които да активира downstream агентите.

## Activities

1. **Анализ на конфликтния риск за T006/T007/T008:**
   - Ако пуснат паралелно "наивно" — всеки агент ще:
     - Пипа `messages/en.json` + `messages/bg.json` → JSON merge риск
     - Построи собствен navbar + footer → visual inconsistency, 3× redundant code
   - Disjoint файлове по страница (`app/[locale]/{slug}/page.tsx`, `components/{slug}/*`) ⇒ ОК
   - Shared файлове (`messages/*.json`, всеки бъдещ shared layout) ⇒ риск

2. **Wave strategy дефинирана:**
   - **Wave 1 (sequential, 1 агент):** T019 — shared `SiteNav`, `SiteFooter`, `PageShell`, `PageHeader` + `footer.*` messages. Foundation за всички следващи страници. Не пипа hero.
   - **Wave 2 (parallel, 3 агента):** T006/T007/T008 — всяка страница пипа само свой slug + свой message namespace. Reuse-ват T019 компонентите. Merge конфликти в messages са между disjoint top-level keys → тривиални за rebase resolution.

3. **T019 task файл създаден** — [`tasks/T019-shared-page-shell.md`](../tasks/T019-shared-page-shell.md):
   - 4 нови компонента със пълни TSX code blocks (detail-rich spec принцип от T004 lessons)
   - Точни messages JSON payloads
   - Strict "Do NOT" секция — особено "не пипай hero, не пипай съществуващи message keys"
   - Git workflow с `git pull --rebase` преди и след
   - Report template

4. **Документация обновена:**
   - `tasks/000-index.md` — T019 добавен; T006/T007/T008 dependency сменен от `T002` на `T019`
   - `STATUS.md` — T019 в "Активни задачи" като Wave 1; T006-T008 маркирани "Wave 2 parallel"

## Решения взети

- **Не правя modular messages** (`messages/en/lessons.json` и т.н.) — overhead по-голям от merge риска. Оставям единични JSON файлове с disjoint top-level namespaces.
- **Не правя localized pathnames сега** (`/uroci`, `/ceni`) — това влиза в T016 SEO или следваща session. URL-ите са `/lessons`, `/pricing`, `/about` за EN и BG еднакво.
- **Hero-то остава непипнато** — `HeroNavbar` и `SiteNav` съществуват паралелно. Hero nav е `absolute` над видео; `SiteNav` е `sticky top-0` в document flow. Няма споделен код — different contexts.
- **T006/T007/T008 спецификации се пишат СЛЕД T019 accept** — за да имат точните interfaces от shipped T019 (не guesses).

## Next actions

1. Alex пуска T019 downstream агент с промпта от `tasks/T019-shared-page-shell.md` (agent prompt секция)
2. Агентът докладва → орestрaтор верифицира спрямо acceptance criteria
3. При T019 accepted → орекстратор пише T006/T007/T008 специфики (Wave 2) → Alex пуска 3-те паралелно

## Files created/modified

- `docs/orchestrator/tasks/T019-shared-page-shell.md` — създаден
- `docs/orchestrator/tasks/000-index.md` — T019 добавен, T006-T008 dep обновен
- `docs/orchestrator/STATUS.md` — активни + pipeline обновени, "Последни 3 промени" rotated
- `docs/orchestrator/sessions/2026-04-23-s09-wave-planning-t019.md` — този файл
- `docs/orchestrator/sessions/000-index.md` — s09 entry добавен

## Commits in this session

1. _(pending)_ — `docs(T019): wave planning + shared page shell spec`
