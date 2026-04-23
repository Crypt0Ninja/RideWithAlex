# T005 · Vercel deploy + preview URL

**Status:** 🟢 Ready
**Priority:** High
**Depends on:** T001 ✅
**Estimated effort:** ~5–10 минути ръчно от Alex
**Assigned:** **Alex (не downstream агент)** — това е UI dashboard задача

## Цел

Свързване на repo-то към Vercel и получаване на preview URL (`ridewithalex-xxx.vercel.app`), който се обновява автоматично при всеки push на `main`. Custom домейнът `ridewithalex.com` ще се добави по-късно (чака Q7 — покупка).

## Защо това е ръчна задача, а не агентска

Vercel setup изисква:
- Oauth login (GitHub) през браузър
- Клик в UI
- Потенциален 2FA

Няма смисъл да се автоматизира и да дава токени на агент, когато го правиш за 5 минути.

## Стъпки (ти, Alex)

1. **Отвори** [vercel.com](https://vercel.com) и натисни **"Sign up"**.
2. Избери **"Continue with GitHub"** — логни се с `Crypt0Ninja` акаунта.
3. Приеми permissions (Vercel иска read access до public/private repo-ти).
4. На Dashboard → **"Add New..."** → **"Project"**.
5. В списъка с repo-та намери `RideWithAlex` и натисни **"Import"**.
   - Ако не го виждаш → "Adjust GitHub App Permissions" → дай достъп до RideWithAlex.
6. На "Configure Project" екрана:
   - **Framework Preset:** Next.js (auto-detected — не го пипай)
   - **Root Directory:** `.` (default)
   - **Build Command:** `pnpm build` (auto-detected)
   - **Install Command:** `pnpm install` (auto-detected)
   - **Environment Variables:** нищо — засега няма
7. Натисни **"Deploy"**.
8. Изчакай ~2 минути. Ще ти даде URL тип `ridewithalex-xyz.vercel.app`.
9. **Отвори URL-а** и провери:
   - Черна страница с `ridewithalex` в центъра ✅
   - Favicon е бял chevron ✅
10. **Copy URL-а** и го дай на оркестратора → ще го запазя в `STATUS.md` и в този файл.

## Какво става после

- **Всеки push на `main`** → автоматичен redeploy за 1-2 минути
- **Всяка pull request** → отделен preview URL (полезно за review на downstream работа)
- **Analytics** — Vercel ще включи Web Vitals автоматично
- **Не се нуждаеш от кредитна карта** за Hobby plan (безплатен)

## Кога да добавим custom домейна

След като купиш `ridewithalex.com` (Q7 в STATUS.md):
1. В Vercel → Project Settings → Domains → Add `ridewithalex.com`
2. Vercel ти дава 2 DNS записа (A + CNAME)
3. Добавяш ги при регистратора на домейна
4. ~5 минути до 24 часа — домейнът сочи към Vercel

Ще направя отделна задача T_DOMAIN когато стане време.

## Acceptance criteria

- [ ] Проектът е импортнат в Vercel под акаунта на Alex
- [ ] Auto-deploy на push към `main` е включен (по подразбиране е)
- [ ] Preview URL е live и показва страницата правилно
- [ ] URL-ът е записан в `STATUS.md` на оркестратора

## Report формат (пиши в чата на оркестратора)

```
T005 done:
- Preview URL: [the vercel.app URL]
- Build time: [X seconds, от Vercel dashboard]
- Всичко работи / проблем: [опиши]
```

---

## Reports

_(празно — чака Alex да направи ръчното setup)_
