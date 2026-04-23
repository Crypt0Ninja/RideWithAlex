import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { PriceCard } from "@/components/pricing/PriceCard";
import { PricingNote } from "@/components/pricing/PricingNote";
import { PricingCta } from "@/components/pricing/PricingCta";

export default function PricingPage() {
  const t = useTranslations("pricing");

  const packages = [
    { key: "twoHours" as const, price: "€100", featured: false },
    { key: "fourHours" as const, price: "€200", featured: false },
    { key: "fullDay" as const, price: "€250", featured: true },
    { key: "week" as const, price: "€1000", featured: false },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="px-6 md:px-10 pb-16 md:pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
        {packages.map(({ key, price, featured }) => (
          <PriceCard
            key={key}
            name={t(`packages.${key}.name`)}
            duration={t(`packages.${key}.duration`)}
            price={price}
            description={t(`packages.${key}.description`)}
            featured={featured}
            bestValueLabel={t("bestValue")}
          />
        ))}
      </section>

      <PricingNote />
      <PricingCta />
    </PageShell>
  );
}
