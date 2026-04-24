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

/**
 * Extract Y/M/D/H parts for a Date as seen in the given IANA timezone.
 * Handles DST correctly.
 */
function getZonedParts(instant: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(instant);
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

/**
 * Convert a wall-clock time in the given IANA timezone to the corresponding
 * UTC Date. DST-aware via round-trip through Intl.
 */
function zonedTimeToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  timeZone: string,
): Date {
  // Start with a naive UTC interpretation of the wall time.
  const naive = new Date(Date.UTC(year, month - 1, day, hour, 0, 0));

  // Find what that UTC instant displays as in the target timezone.
  const displayed = getZonedParts(naive, timeZone);
  const displayedAsUtc = Date.UTC(
    displayed.year,
    displayed.month - 1,
    displayed.day,
    displayed.hour,
    displayed.minute,
  );

  // Offset between what we wanted and what's displayed — add it to naive.
  const offsetMs = naive.getTime() - displayedAsUtc;
  return new Date(naive.getTime() + offsetMs);
}

function nowInSofia() {
  return getZonedParts(new Date(), BUSINESS_TIMEZONE);
}

/** Returns the Date representing Sofia midnight on (today + offsetDays). */
function sofiaDateFromOffset(offsetDays: number): Date {
  const today = nowInSofia();
  // Roll the calendar day; the zonedTimeToUtc call handles month/year rollover
  // correctly since Date constructors normalize overflow.
  return zonedTimeToUtc(
    today.year,
    today.month,
    today.day + offsetDays,
    0,
    BUSINESS_TIMEZONE,
  );
}

function buildSlotDate(offsetDays: number, hour: number): Date {
  const today = nowInSofia();
  return zonedTimeToUtc(
    today.year,
    today.month,
    today.day + offsetDays,
    hour,
    BUSINESS_TIMEZONE,
  );
}

function dayStringFromOffset(offsetDays: number): string {
  const today = nowInSofia();
  // Manually compute target Sofia date (handling month rollover via a Date
  // helper — we only need the Y-M-D string).
  const helper = new Date(Date.UTC(today.year, today.month - 1, today.day + offsetDays));
  const y = helper.getUTCFullYear();
  const m = String(helper.getUTCMonth() + 1).padStart(2, "0");
  const d = String(helper.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
    const slots: VirtualSlot[] = [];

    for (const hour of SLOT_HOURS) {
      const startsAt = buildSlotDate(i, hour);
      const endsAt = buildSlotDate(i, hour + SLOT_DURATION_HOURS);

      const inPast = startsAt.getTime() <= now.getTime();
      const isTaken = taken.has(startsAt.toISOString());

      slots.push({
        startsAt,
        endsAt,
        available: !inPast && !isTaken,
      });
    }

    result.push({ date: dayStringFromOffset(i), slots });
  }

  return result;
}

export async function isSlotAvailable(startsAt: Date): Promise<boolean> {
  if (startsAt.getTime() <= Date.now()) return false;

  // Verify the slot start is at an allowed Sofia wall-clock hour.
  const sofiaParts = getZonedParts(startsAt, BUSINESS_TIMEZONE);
  const allowedHours: number[] = [...SLOT_HOURS];
  if (!allowedHours.includes(sofiaParts.hour) || sofiaParts.minute !== 0) {
    return false;
  }

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

  return rows.length === 0;
}

export { BUSINESS_TIMEZONE, SLOT_HOURS, SLOT_DURATION_HOURS };
