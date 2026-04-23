# Prompt template — за downstream агенти

Всеки промпт, който оркестраторът дава на Alex да копира, следва тази структура. Self-contained — агентът не знае нищо за предишни сесии.

---

## Шаблон

```markdown
# [Task ID] · [Task title]

You are working on **RideWithAlex** — a website for Alex, a snowboard instructor in Bansko, Bulgaria. The site is being built in multiple coordinated sessions. This task is atomic and self-contained.

## Context (read these first)

Repo: `github.com/Crypt0Ninja/RideWithAlex`, branch `main`, working dir `C:\Users\Alex\Desktop\1a`.

Before you start, read:
- `docs/orchestrator/STATUS.md` — current project state
- `docs/03-design-direction.md` — visual rules (monochrome, lowercase, Readex Pro)
- `docs/04-tech-stack.md` — required technologies
- `docs/orchestrator/tasks/[TASK_ID].md` — this task's full spec
- Any task-specific docs linked below

## Your task

[Clear, specific description of what to build]

## Requirements (must-haves)

- [ ] [Requirement 1]
- [ ] [Requirement 2]
- ...

## Design rules (enforce strictly)

- Background: `bg-black`
- Text: `text-white`, `text-white/90`, `text-white/70` only
- **All UI text is lowercase** — no exceptions
- Font: Readex Pro (weights 300, 400, 500, 600, 700)
- No color accents (no orange, blue, green)
- Tailwind CSS v4
- TypeScript strict mode

## Do NOT

- ❌ [Out-of-scope items]
- ❌ Modify files in `docs/` or `assets/` (those are content, not code)
- ❌ Change the `.gitignore`
- ❌ Add dependencies not listed in `docs/04-tech-stack.md` without justification
- ❌ Skip git hooks (no `--no-verify`)

## Acceptance criteria (all must pass)

- [ ] [Criterion 1 — concrete, checkable]
- [ ] [Criterion 2]
- [ ] `pnpm build` succeeds with no errors
- [ ] `pnpm tsc --noEmit` passes
- [ ] ESLint passes
- [ ] Visible in browser at [URL] and matches the spec

## Git workflow

- Commit messages: `<type>([TASK_ID]): <short description>`
  - Example: `feat(T001): scaffold next.js with tailwind and readex pro`
- Push to `origin/main` when all acceptance criteria pass
- If you get stuck partway: commit what you have with `wip([TASK_ID]): <what's done>` and report what blocked you

## Report format (send this back to the orchestrator)

Respond with exactly this markdown block, filled in:

```markdown
## Report — [TASK_ID]

**Status:** completed | partial | blocked
**Commits:** [SHA1 — message], [SHA2 — message]
**Time spent:** ~X minutes

### What I did
(1-3 paragraphs, ≤ 200 words)

### Acceptance criteria
- [x] Criterion 1 — evidence: ...
- [x] Criterion 2 — evidence: ...
- [ ] Criterion 3 — not done because: ...

### Deviations from spec
(If any — why, and what was different)

### Blockers / questions
(If any — what would unblock you)

### Files changed
- `path/to/file.ts` — created | modified | deleted
- ...
```
```

---

## Tips за оркестратора при писане на промпти

1. **Не давай context който не ти трябва.** Агентът чете само файловете, които са му казани. Ако не е важно за задачата — не го слагай.
2. **Всяко acceptance criterion трябва да е checkable.** Избягвай "looks good" — пиши "matches design in `docs/03-design-direction.md` section §Hero".
3. **Включи explicit "Do NOT" секция.** Агентите са склонни да "помагат" с неща, които не са поискани.
4. **Линкове към конкретни файлове + секции.** Не "the design doc" — а `docs/03-design-direction.md` §Navbar.
5. **Задача == 1 PR-ов обем работа.** Ако се чувства като 2 — раздели я на 2 задачи.
