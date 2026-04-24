import { db, bookings, timeSlots } from "@/db";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { formatBgn } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  await requireAdmin();

  const rows = await db
    .select({ booking: bookings, slot: timeSlots })
    .from(bookings)
    .leftJoin(timeSlots, eq(bookings.slotId, timeSlots.id))
    .orderBy(desc(bookings.createdAt))
    .limit(200);

  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Sofia",
  });
  const timeFmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Sofia",
  });

  return (
    <main className="flex flex-col gap-10">
      <header className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">admin</p>
          <h1 className="text-4xl md:text-5xl font-medium lowercase tracking-tight">bookings</h1>
          <p className="text-white/60 text-sm lowercase">{rows.length} total · showing latest 200</p>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8 text-white/60 text-sm lowercase">
          no bookings yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map(({ booking, slot }) => (
            <article
              key={booking.id}
              className="rounded-3xl border border-white/10 bg-neutral-900 p-6 grid grid-cols-1 md:grid-cols-6 gap-4"
            >
              <div className="md:col-span-2 flex flex-col gap-1">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">when</p>
                <p className="text-white text-sm font-medium lowercase">
                  {slot ? `${dateFmt.format(slot.startsAt)} · ${timeFmt.format(slot.startsAt)}—${timeFmt.format(slot.endsAt)}` : "—"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">customer</p>
                <p className="text-white text-sm lowercase">{booking.customerName}</p>
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="text-white/60 hover:text-white text-xs underline-offset-4 hover:underline"
                >
                  {booking.customerPhone}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">lesson</p>
                <p className="text-white text-sm lowercase">
                  {booking.lessonType} · {booking.headcount}p
                </p>
                <p className="text-white/60 text-xs lowercase">{formatBgn(booking.totalStotinki)}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">status</p>
                <p className="text-white text-sm lowercase">{booking.status}</p>
                {slot?.googleEventId && (
                  <p className="text-white/40 text-xs lowercase">cal: synced</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">ref</p>
                <p className="text-white/60 text-xs font-mono">{booking.id.slice(0, 8)}</p>
                <p className="text-white/40 text-xs lowercase">
                  {dateFmt.format(booking.createdAt).toLowerCase()}
                </p>
              </div>
              {booking.notes && (
                <div className="md:col-span-6 flex flex-col gap-1 pt-2 border-t border-white/5">
                  <p className="text-white/40 text-xs uppercase tracking-[0.3em]">notes</p>
                  <p className="text-white/70 text-sm lowercase">{booking.notes}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
