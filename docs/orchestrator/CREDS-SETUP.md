# CREDS SETUP · Wave 4 pre-reqs за Alex

> Стъпка-по-стъпка инструкции за 2-те останали creds-а: **Google Cloud OAuth** (за T020 Calendar sync) + **Resend** (за T012 email).
> Отвори това като reference докато го правиш — всяка стъпка има точни клик-пътеки + стойности за копиране.

**Последна актуализация:** 2026-04-24 · s15

---

## 1. Google Cloud OAuth — Calendar API

**Цел:** получаване на `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` за да може сайтът да създава събития в твоя Google Calendar когато клиент резервира урок.

**Време:** ~10 минути.

### Стъпка 1 — Създай Google Cloud проект

1. Отвори [console.cloud.google.com](https://console.cloud.google.com)
2. Логни се с **твоя личен Gmail** (не с друг акаунт) — този на който искаш уроците да се появяват в календара
3. Top bar → **"Select a project"** dropdown → **"New Project"**
4. Project name: `RideWithAlex`
5. Location: остави **"No organization"** (освен ако имаш business Google Workspace)
6. → **Create**
7. Изчакай 10 секунди → избери `RideWithAlex` от top bar

### Стъпка 2 — Enable Google Calendar API

1. Hamburger menu (☰ горе вляво) → **APIs & Services** → **Library**
2. Search bar → напиши: `Google Calendar API`
3. Click на резултата → натисни синия бутон **Enable**
4. Изчакай ~5s до "API enabled" confirmation

### Стъпка 3 — OAuth consent screen

1. Hamburger menu → **APIs & Services** → **OAuth consent screen**
2. User Type: избери **External** → **Create**
3. **App information** секция:
   - App name: `RideWithAlex`
   - User support email: твоят Gmail
   - Leave **App logo** empty (optional)
4. **App domain** секция (optional — можеш да пропуснеш)
5. **Developer contact information**:
   - Email addresses: твоят Gmail
6. → **Save and Continue**
7. **Scopes** екран → **Add or Remove Scopes**
8. В popup-а → filter или search: `calendar`
9. Намери **`.../auth/calendar`** (пълен Calendar access) → ☑️ чекирай
10. → **Update** → **Save and Continue**
11. **Test users** екран → **+ Add Users**
12. Добави **твоя Gmail** (този с който ще ти се запазват срещите) → **Add** → **Save and Continue**
13. **Summary** → **Back to Dashboard**

### Стъпка 4 — Създай OAuth Client ID

1. **APIs & Services** → **Credentials**
2. Top bar → **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `RideWithAlex Web`
5. **Authorized redirect URIs** секция → натисни **+ Add URI** и добави всичките 3 (по един на ред):

```
http://localhost:3000/api/auth/google/callback
https://ridewithalex.vercel.app/api/auth/google/callback
https://ridewithalex.com/api/auth/google/callback
```

6. → **Create**

### Стъпка 5 — Копирай creds

Появява се popup **"OAuth client created"** с:
- **Client ID** (дълъг низ, завършва на `.apps.googleusercontent.com`)
- **Client Secret** (започва с `GOCSPX-`)

**Копирай двете.** Ако затвориш popup-а без да ги копираш → върни се в **Credentials** → click на името → има бутон **Download JSON** за повторен достъп.

### Стъпка 6 — Paste в `.env.local`

Отвори `C:\Users\Alex\Desktop\1a\.env.local`. Намери тези редове:

```
# --- Google OAuth (Wave 4 — Calendar sync) --- pending Alex's creds (V3)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GOOGLE_CALENDAR_ID=primary
```

Замени ги с (премахни `# ` пред всеки ред, paste стойностите):

```
# --- Google OAuth (Wave 4 — Calendar sync) ---
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_CALENDAR_ID=primary
```

Save файла.

**Готово!** Кажи ми "Google готово" в чата.

---

## 2. Resend — Email notifications

**Цел:** получаване на `RESEND_API_KEY` за да може сайтът да изпраща 2 email-а при нов booking: confirmation към клиента + notification към теб.

**Време:** ~5 минути.

### Стъпка 1 — Регистрация

1. Отвори [resend.com](https://resend.com)
2. Click **Sign Up** (горе дясно)
3. Регистрация:
   - Email: твоят Gmail (същият като Google Cloud — за простота)
   - ИЛИ директно с "Continue with Google" / "Continue with GitHub"
4. Verify email (линк в mailbox-а)

### Стъпка 2 — ⚠️ Domain decision

Resend изисква **verified domain** за production email sending. Имаш 2 опции:

**Опция A (препоръка за СЕГА):** Използваме Resend-овия вграден **test sender** `onboarding@resend.dev`.
- ✅ Работи веднага, без DNS настройки
- ⚠️ Получателят вижда `onboarding@resend.dev` като подател (не `alex@ridewithalex.com`)
- ✅ Perfect за тестване + ранно launch

**Опция B (production, когато `ridewithalex.com` е купен):**
- Resend dashboard → **Domains** → **Add Domain** → `ridewithalex.com`
- Resend показва 3-4 DNS записа (SPF, DKIM, MX)
- Добавяш ги в DNS зоната на домейна (Cloudflare / domain registrar)
- Verify → вече можеш да изпращаш от `alex@ridewithalex.com`

**Сега правим само Опция A.** Опция B → след като купиш домейна (отделна сесия, кратка процедура).

### Стъпка 3 — Create API Key

1. Logged in → лявото меню → **API Keys**
2. Click **+ Create API Key**
3. Name: `RideWithAlex Production`
4. Permission: избери **Sending access** (достатъчно; не нужно Full access)
5. Domain: **All domains** (ще използваме `onboarding@resend.dev`)
6. → **Add**

**Ключът се показва ВЕДНЪЖ** (започва с `re_...`). Копирай веднага. Ако го загубиш → trябва да създадеш нов.

### Стъпка 4 — Paste в `.env.local`

Отвори `C:\Users\Alex\Desktop\1a\.env.local`. Намери тези редове:

```
# --- Resend (Wave 4 — email) --- pending Alex's creds (V3)
# RESEND_API_KEY=
# RESEND_FROM_EMAIL=onboarding@resend.dev
# RESEND_TO_EMAIL=
```

Замени с (премахни `# `, paste ключа, попълни twoя email):

```
# --- Resend (Wave 4 — email) ---
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=твоят-gmail@gmail.com
```

`RESEND_FROM_EMAIL` — адрес-а от който клиентите ще получават booking confirmation (сега `onboarding@resend.dev`; после — `alex@ridewithalex.com`)
`RESEND_TO_EMAIL` — твоят email, на който ТИ получаваш notification при нов booking

Save файла.

**Готово!** Кажи ми "Resend готово".

---

## След като и двете са готови

`.env.local` трябва да изглежда така (в Supabase секцията + Google + Resend — другото е друго):

```
# --- Supabase --- (вече попълнено)
NEXT_PUBLIC_SUPABASE_URL=https://jfccgssbodkqzivhxpzk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
DATABASE_URL=postgresql://...
DATABASE_POOL_URL=postgresql://...

# --- Google OAuth --- (ново)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_CALENDAR_ID=primary

# --- Resend --- (ново)
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=твоят@gmail.com
```

Аз ще започна **T020 (Google Calendar sync)** + **T010 (Booking UI)** + **T012 (Email)** orchestrator execute-self mode, както направихме Wave 3 + T011. Ще ти докладвам след всеки shipped commit.

---

## Common issues

**Google OAuth**

- "This app isn't verified" при първия login → нормално за test user; натисни **Advanced** → **Go to RideWithAlex (unsafe)**. Alex е verified test user, това е ОК.
- "redirect_uri_mismatch" → проверй че всичките 3 redirect URIs са добавени точно (без trailing `/`, case-sensitive)
- Forgot to add scope → върни се в OAuth consent screen → Edit App → Scopes → Add `.../auth/calendar`

**Resend**

- API key показан само веднъж → ако го загубиш, Delete + Create нов
- Test email не пристига → провери spam folder + verify че `RESEND_FROM_EMAIL=onboarding@resend.dev` (не друг email)
- 403 "domain not verified" → използвай `onboarding@resend.dev` като from address; verified domain е за production

---

## Quick links

- Google Cloud Console: [console.cloud.google.com](https://console.cloud.google.com)
- Resend Dashboard: [resend.com/overview](https://resend.com/overview)
- Supabase Dashboard: [supabase.com/dashboard/project/jfccgssbodkqzivhxpzk](https://supabase.com/dashboard/project/jfccgssbodkqzivhxpzk)
- RideWithAlex live: [ridewithalex.vercel.app](https://ridewithalex.vercel.app)
- GitHub repo: [Crypt0Ninja/RideWithAlex](https://github.com/Crypt0Ninja/RideWithAlex)
