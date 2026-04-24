import { getValidAccessToken } from "./oauth";

const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";

function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID ?? "primary";
}

type CalendarEvent = {
  id: string;
  status: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
};

export type BookingForCalendar = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  lessonType: string;
  headcount: number;
  notes: string | null;
  startsAt: Date;
  endsAt: Date;
};

function buildEventBody(booking: BookingForCalendar) {
  const summary = `lesson · ${booking.customerName} (${booking.lessonType}, ${booking.headcount}p)`;
  const description = [
    `phone: ${booking.customerPhone}`,
    `lesson type: ${booking.lessonType}`,
    `headcount: ${booking.headcount}`,
    booking.notes ? `notes: ${booking.notes}` : null,
    `booking id: ${booking.bookingId}`,
    "",
    "auto-created by ridewithalex.org",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    summary,
    description,
    start: { dateTime: booking.startsAt.toISOString(), timeZone: "Europe/Sofia" },
    end: { dateTime: booking.endsAt.toISOString(), timeZone: "Europe/Sofia" },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 120 },
        { method: "email", minutes: 1440 },
      ],
    },
  };
}

export async function createCalendarEvent(booking: BookingForCalendar): Promise<string> {
  const { accessToken } = await getValidAccessToken();
  const calendarId = encodeURIComponent(getCalendarId());
  const res = await fetch(`${CALENDAR_BASE}/calendars/${calendarId}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildEventBody(booking)),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar event create failed: ${res.status} ${text}`);
  }

  const event = (await res.json()) as { id: string };
  return event.id;
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const { accessToken } = await getValidAccessToken();
  const calendarId = encodeURIComponent(getCalendarId());
  const res = await fetch(
    `${CALENDAR_BASE}/calendars/${calendarId}/events/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (res.status !== 204 && res.status !== 404 && res.status !== 410) {
    const text = await res.text();
    throw new Error(`Calendar event delete failed: ${res.status} ${text}`);
  }
}

export async function listUpcomingEvents(daysAhead = 14): Promise<CalendarEvent[]> {
  const { accessToken } = await getValidAccessToken();
  const calendarId = encodeURIComponent(getCalendarId());
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });

  const res = await fetch(
    `${CALENDAR_BASE}/calendars/${calendarId}/events?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar list failed: ${res.status} ${text}`);
  }

  const body = (await res.json()) as { items: CalendarEvent[] };
  return body.items.filter((e) => e.status !== "cancelled");
}
