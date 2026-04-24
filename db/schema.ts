import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const slotStatusEnum = pgEnum("slot_status", [
  "available",
  "blocked",
  "booked",
]);

export const lessonTypeEnum = pgEnum("lesson_type", [
  "private",
  "group",
  "kids",
  "freestyle",
  "offpiste",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const timeSlots = pgTable(
  "time_slots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "date" }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "date" }).notNull(),
    status: slotStatusEnum("status").notNull().default("available"),
    googleEventId: text("google_event_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    startsAtIdx: index("time_slots_starts_at_idx").on(table.startsAt),
    statusIdx: index("time_slots_status_idx").on(table.status),
  })
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slotId: uuid("slot_id").references(() => timeSlots.id, {
      onDelete: "set null",
    }),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    lessonType: lessonTypeEnum("lesson_type").notNull(),
    headcount: integer("headcount").notNull().default(1),
    totalStotinki: integer("total_stotinki").notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    slotIdIdx: index("bookings_slot_id_idx").on(table.slotId),
    statusIdx: index("bookings_status_idx").on(table.status),
    createdAtIdx: index("bookings_created_at_idx").on(table.createdAt),
  })
);

export type TimeSlot = typeof timeSlots.$inferSelect;
export type NewTimeSlot = typeof timeSlots.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
