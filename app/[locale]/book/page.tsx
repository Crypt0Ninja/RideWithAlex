import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { BookingFlow } from "@/components/book/BookingFlow";
import { getAvailableSlots } from "@/lib/slots";
import type { SerializedDay } from "@/components/book/SlotPicker";

export const dynamic = "force-dynamic";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: { title: t("title"), description: t("subtitle") },
  };
}

export default async function BookPage() {
  const daysRaw = await getAvailableSlots(14);
  const days: SerializedDay[] = daysRaw.map((d) => ({
    date: d.date,
    slots: d.slots.map((s) => ({
      startsAtIso: s.startsAt.toISOString(),
      endsAtIso: s.endsAt.toISOString(),
      available: s.available,
    })),
  }));

  return <BookPageInner days={days} />;
}

function BookPageInner({ days }: { days: SerializedDay[] }) {
  const t = useTranslations("book");

  return (
    <PageShell>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="px-6 md:px-10 pb-24 md:pb-32 max-w-4xl">
        <BookingFlow days={days} />
      </section>
    </PageShell>
  );
}
