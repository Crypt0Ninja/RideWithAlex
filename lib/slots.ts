import { db, timeSlots } from "@/db";
import { and, gte, lt, or, eq } from "drizzle-orm";

const BUSINESS_TIMEZONE = "Europe/Sofia";
const SLOT_HOURS = [9, 11, 13, 15] as const;
const SLOT_DURATION_HOURS = 2;

export type VirtualSlot = {
  startsAt: Date;
  endsAt: Date;
  available: boolean;
};

export type DaySlots = {
  date: string;
  slots: VirtualSlot[];
};

function dayStringFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sofiaDateFromOffset(offsetDays: number): Date {
  const now = new Date();
  const shifted = new Date(now);
  shifted.setDate(shifted.getDate() + offsetDays);
  shifted.setHours(0, 0, 0, 0);
  return shifted;
}

function buildSlotDate(baseDate: Date, hour: number): Date {
  const d = new Date(baseDate);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export async function getAvailableSlots(daysAhead = 14): Promise<DaySlots[]> {
  const startRange = sofiaDateFromOffset(0);
  const endRange = sofiaDateFromOffset(daysAhead);

  const takenRows = await db
    .select({ startsAt: timeSlots.startsAt, endsAt: timeSlots.endsAt })
    .from(timeSlots)
    .where(
      and(
        gte(timeSlots.startsAt, startRange),
        lt(timeSlots.startsAt, endRange),
        or(eq(timeSlots.status, "booked"), eq(timeSlots.status, "blocked")),
      ),
    );

  const taken = new Set(takenRows.map((r) => r.startsAt.toISOString()));

  const result: DaySlots[] = [];
  const now = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const dayDate = sofiaDateFromOffset(i);
    const slots: VirtualSlot[] = [];

    for (const hour of SLOT_HOURS) {
      const startsAt = buildSlotDate(dayDate, hour);
      const endsAt = buildSlotDate(dayDate, hour + SLOT_DURATION_HOURS);

      const inPast = startsAt.getTime() <= now.getTime();
      const isTaken = taken.has(startsAt.toISOString());

      slots.push({
        startsAt,
        endsAt,
        available: !inPast && !isTaken,
      });
    }

    result.push({ date: dayStringFromDate(dayDate), slots });
  }

  return result;
}

export async function isSlotAvailable(startsAt: Date): Promise<boolean> {
  const endsAt = new Date(startsAt.getTime() + SLOT_DURATION_HOURS * 60 * 60 * 1000);

  if (startsAt.getTime() <= Date.now()) return false;

  const sofiaHour = startsAt.getHours();
  const alignedHours: number[] = [...SLOT_HOURS];
  if (!alignedHours.includes(sofiaHour)) return false;

  const rows = await db
    .select({ id: timeSlots.id })
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.startsAt, startsAt),
        or(eq(timeSlots.status, "booked"), eq(timeSlots.status, "blocked")),
      ),
    )
    .limit(1);

  return rows.length === 0 && endsAt instanceof Date;
}

export { BUSINESS_TIMEZONE, SLOT_HOURS, SLOT_DURATION_HOURS };
