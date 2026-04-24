import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { db, bookings, timeSlots } from "@/db";
import { eq } from "drizzle-orm";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatBgn } from "@/lib/pricing";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ConfirmedPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const rows = await db
    .select({
      booking: bookings,
      slot: timeSlots,
    })
    .from(bookings)
    .leftJoin(timeSlots, eq(bookings.slotId, timeSlots.id))
    .where(eq(bookings.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) notFound();

  const locale = await getLocale();
  const t = await getTranslations("book.confirmed");
  const tTypes = await getTranslations("book.lessonTypes");

  const dateFmt = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Sofia",
  });
  const timeFmt = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Sofia",
  });

  const b = row.booking;
  const slot = row.slot;
  const startsAt = slot?.startsAt ?? null;
  const endsAt = slot?.endsAt ?? null;

  const detailRow = (label: string, value: string) => (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-white/10 last:border-b-0">
      <span className="text-white/40 text-xs uppercase tracking-[0.3em]">{label}</span>
      <span className="text-white text-sm font-medium lowercase text-right">{value}</span>
    </div>
  );

  return (
    <PageShell>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="px-6 md:px-10 pb-24 md:pb-32 max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 px-6 md:px-8 py-4">
          {startsAt && detailRow(t("date"), dateFmt.format(startsAt).toLowerCase())}
          {startsAt &&
            endsAt &&
            detailRow(t("time"), `${timeFmt.format(startsAt)} — ${timeFmt.format(endsAt)}`)}
          {detailRow(t("name"), b.customerName)}
          {detailRow(t("phone"), b.customerPhone)}
          {b.customerEmail && detailRow(t("email"), b.customerEmail)}
          {detailRow(t("lessonType"), tTypes(b.lessonType))}
          {b.headcount > 1 && detailRow(t("headcount"), String(b.headcount))}
          {detailRow(t("total"), formatBgn(b.totalStotinki))}
          {b.notes && detailRow(t("notes"), b.notes)}
          {detailRow(t("bookingId"), b.id.slice(0, 8))}
        </div>

        <div className="mt-10 rounded-3xl border border-white/5 bg-neutral-950 px-6 md:px-8 py-8 flex flex-col gap-4">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">{t("nextEyebrow")}</p>
          <p className="text-white text-lg md:text-xl font-medium lowercase">{t("nextTitle")}</p>
          <p className="text-white/70 text-sm leading-relaxed lowercase">
            {t("nextBody")}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
