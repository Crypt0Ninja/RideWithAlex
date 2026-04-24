import { db, timeSlots, bookings } from "@/db";
import { eq } from "drizzle-orm";
import { isSlotAvailable, SLOT_DURATION_HOURS } from "./slots";
import { calculateTotalStotinki, type LessonType } from "./pricing";
import { createCalendarEvent } from "@/lib/google/calendar";

export type CreateBookingInput = {
  startsAt: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  lessonType: LessonType;
  headcount: number;
  notes: string | null;
};

export type CreateBookingResult = {
  bookingId: string;
  slotId: string;
  calendarEventId: string | null;
  totalStotinki: number;
};

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const available = await isSlotAvailable(input.startsAt);
  if (!available) {
    throw new Error("slot_unavailable");
  }

  const endsAt = new Date(input.startsAt.getTime() + SLOT_DURATION_HOURS * 60 * 60 * 1000);
  const totalStotinki = calculateTotalStotinki(
    input.lessonType,
    SLOT_DURATION_HOURS,
    input.headcount,
  );

  const insertedSlots = await db
    .insert(timeSlots)
    .values({
      startsAt: input.startsAt,
      endsAt,
      status: "booked",
    })
    .returning({ id: timeSlots.id });

  const slot = insertedSlots[0];
  if (!slot) throw new Error("slot_insert_failed");

  const insertedBookings = await db
    .insert(bookings)
    .values({
      slotId: slot.id,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      lessonType: input.lessonType,
      headcount: input.headcount,
      totalStotinki,
      status: "confirmed",
      notes: input.notes,
    })
    .returning({ id: bookings.id });

  const booking = insertedBookings[0];
  if (!booking) throw new Error("booking_insert_failed");

  let calendarEventId: string | null = null;
  try {
    calendarEventId = await createCalendarEvent({
      bookingId: booking.id,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      lessonType: input.lessonType,
      headcount: input.headcount,
      notes: input.notes,
      startsAt: input.startsAt,
      endsAt,
    });

    await db
      .update(timeSlots)
      .set({ googleEventId: calendarEventId })
      .where(eq(timeSlots.id, slot.id));
  } catch (err) {
    // Calendar failure shouldn't roll back the booking — Alex can
    // re-sync later. Log for visibility.
    console.error("Calendar event creation failed for booking", booking.id, err);
  }

  return {
    bookingId: booking.id,
    slotId: slot.id,
    calendarEventId,
    totalStotinki,
  };
}
