# T012 · Email (Resend) — RideWithAlex Wave 4

При successful booking изпращаме 2 email-a: confirmation към клиента (ако е оставил email) + notification към Alex. Използваме `resend` SDK + plain HTML templates. EN-only за MVP.

## Scope

- `lib/email/client.ts` — Resend wrapper + 2 send functions
- Integrate в `lib/booking.ts` non-blocking (failure log-ва но не rollback-ва booking)
- HTML templates inline (no React Email dep)

`from`: `RESEND_FROM_EMAIL` env (`onboarding@resend.dev` за MVP)
`customer to`: `booking.customerEmail` (skip ако null)
`alex to`: `RESEND_TO_EMAIL` env

## Файлове (1 нов + 1 обновен)

- `lib/email/client.ts` — нов
- `lib/booking.ts` — обновен (извиква email функциите след Calendar event)

## Acceptance

- [ ] `resend` installed
- [ ] `lib/email/client.ts` exports `sendCustomerConfirmation(booking)` + `sendAlexNotification(booking)`
- [ ] Booking flow извиква двете (customer само ако email е present)
- [ ] Email failures log-ват но не fail-ват booking
- [ ] Build/tsc/lint pass
- [ ] Commit: `feat(T012): resend email notifications for bookings`

---

## Reports

_(попълва се след изпълнение)_
