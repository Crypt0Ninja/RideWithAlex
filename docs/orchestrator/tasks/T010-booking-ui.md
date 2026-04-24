# T010 · Booking UI — RideWithAlex Wave 4

Booking flow: клиент избира дата + 2ч slot → попълва име/телефон/тип урок → POST /api/bookings → създава time_slot + booking + Calendar event (через T020 `createCalendarEvent`) → redirect към confirmation page.

## Scope clarification

**MVP = само 2ч bookings.** Multi-hour (4ч / full day / week) → пост-MVP (add separate task или admin-mediated booking).

Работни часове: 9:00–17:00 всеки ден, 4 fixed slot-а (9-11, 11-13, 13-15, 15-17). Europe/Sofia timezone.

## Файлове (9 нови + 2 обновени)

**Helpers (3):**
- `lib/slots.ts` — slot generator за следващите N дни; availability check спрямо DB
- `lib/pricing.ts` — lesson_type → BGN/hour placeholder rates; `calculateTotalStotinki(type, hours, headcount)`
- `lib/booking.ts` — `createBooking(input)` orchestrator: DB transaction + Calendar event + return booking id

**API (1):**
- `app/api/bookings/route.ts` — POST, Zod validation, error handling

**Pages (2):**
- `app/[locale]/book/page.tsx` — server component (holds metadata); renders client `<BookingFlow>`
- `app/[locale]/book/confirmed/[id]/page.tsx` — server, reads booking from DB, shows details

**Client components (3):**
- `components/book/BookingFlow.tsx` — state machine (pick slot → form → submitting → redirect)
- `components/book/SlotPicker.tsx` — date strip + slot grid
- `components/book/BookingForm.tsx` — form (name, phone, email, lesson_type, headcount, notes)

**Messages (2 обновени):**
- `messages/en.json` + `messages/bg.json` — добавяне на `book` namespace

## Поведение

1. `/book` — SlotPicker показва 14 дни напред; deafult избрана е утрешната. За всеки ден показва 4 slot-а; disabled ако booked/blocked.
2. Избор на slot → fade-in на BookingForm (slot printed в disabled field отгоре)
3. Submit → POST /api/bookings с JSON payload → response returns `{ bookingId }`
4. Client redirect → `/book/confirmed/[bookingId]`
5. Confirmation page — показва детайли + "what happens next" copy + contact info ако въпрос

## Validation (zod)

- name: 2-80 chars, trim
- phone: BG format (+359... или 08..., 8-15 digits; регex approximation)
- email: optional email format
- lesson_type: enum from schema
- headcount: 1-4
- notes: optional, max 500 chars
- slot_starts_at: ISO 8601 date string, must be in future, aligned to 2h boundary

## Pricing placeholder rates (BGN/h, per person за private/kids/freestyle/offpiste; per-group за group)

- private: 120
- kids: 80
- group: 60 (per person)
- freestyle: 150
- offpiste: 200

total_stotinki = rate × hours × headcount × 100 (BGN → stotinki). За group headcount×rate е cena per group (не per person).

Placeholder — Alex ще корригира в lib/pricing.ts когато знаем final rates.

## Acceptance

- [ ] `/en/book` + `/bg/book` render
- [ ] Slot picker показва следващите 14 дни × 4 slot-а; заетите са disabled
- [ ] Form validation блокира submit със грешни данни
- [ ] POST /api/bookings:
  - Създава time_slots row (INSERT) с `status='booked'`
  - Създава bookings row (INSERT) с `status='pending'`
  - Викa `createCalendarEvent` от T020 → сохрани `google_event_id` в time_slots
  - Връща `{ bookingId: uuid }`
- [ ] `/book/confirmed/[id]` показва booking details (name, date, time, total)
- [ ] Build/tsc/lint pass
- [ ] pushed като `feat(T010): booking flow with slot picker, form, api, confirmation`

## Do NOT

- ❌ Implement multi-hour bookings (out of scope — MVP 2h only)
- ❌ Implement email notifications (това е T012)
- ❌ Implement admin panel (T021)
- ❌ Touch existing pages (home/lessons/pricing/etc.)
- ❌ Add payment collection
- ❌ Skip git workflow checks

---

## Reports

_(попълва се след изпълнение)_
