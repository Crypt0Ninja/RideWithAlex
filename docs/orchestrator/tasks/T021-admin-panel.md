# T021 · Admin panel — RideWithAlex Wave 4

Supabase Auth email+password login. Един admin user (Alex) създаден ръчно в Supabase dashboard. Защитени pages показват bookings списък + google setup + links.

## Scope (narrowed за MVP)

- Auth (login / logout / `requireAdmin` helper)
- Bookings list (view-only)
- Защита на съществуващите `/admin`, `/admin/google-setup`
- Instructions за Alex да създаде admin user

**Out of scope:** slot block/unblock UI (Alex може да го прави през Supabase Table Editor — INSERT в `time_slots` с `status='blocked'`). Ще се добави в T021b ако нужно.

## Optional env — restrict by email

Ако `ADMIN_EMAIL` е set в `.env.local`, само този email може да се логне. Иначе всеки verified Supabase user има достъп.

## Файлове (6 нови + 3 обновени)

- `lib/auth/admin.ts` — нов (`requireAdmin`, `getAdminOrNull`)
- `app/admin/login/page.tsx` — нов
- `app/admin/login/LoginForm.tsx` — нов (client)
- `app/admin/login/actions.ts` — нов (signIn server action)
- `app/admin/logout/route.ts` — нов (POST signOut)
- `app/admin/bookings/page.tsx` — нов
- `app/admin/layout.tsx` — обновен (logout link ако authenticated)
- `app/admin/page.tsx` — обновен (requireAdmin + nav)
- `app/admin/google-setup/page.tsx` — обновен (requireAdmin)

## Acceptance

- [ ] Un-authed visit на `/admin` → redirect към `/admin/login`
- [ ] Login с валидни creds → redirect към `/admin`
- [ ] Invalid creds → error message + остава на login page
- [ ] `/admin/bookings` показва всички bookings в DB, сортирани descending по created_at
- [ ] Logout link functional
- [ ] Build/tsc/lint pass
- [ ] Commit: `feat(T021): admin panel with supabase auth + bookings list`

## Alex setup after T021 ships

Да създадеш admin user:
1. Supabase dashboard → Authentication → Users
2. **"+ Add user"** → Send invitation / Create new user
3. Email: твоят admin email; Password: сигурна парола
4. (Optional) в `.env.local` → `ADMIN_EMAIL=същият-email` за да рестриктнеш достъпа

---

## Reports

_(попълва се след изпълнение)_
