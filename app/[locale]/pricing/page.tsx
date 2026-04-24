import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/shared/PageShell";
import { ScrollVideoSection } from "@/components/shared/ScrollVideoSection";
import { PriceCard } from "@/components/pricing/PriceCard";
import { PricingNote } from "@/components/pricing/PricingNote";
import { PricingCta } from "@/components/pricing/PricingCta";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: { title: t("title"), description: t("subtitle") },
  };
}

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
      <ScrollVideoSection
        frameCount={120}
        framePathPrefix="/videos/pricing/frame-"
      >
        <section className="min-h-screen flex items-center justify-center px-6 md:px-10">
          <div className="flex flex-col gap-6 md:gap-10 max-w-4xl text-center">
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.4em]">
              {t("eyebrow")}
            </p>
            <h1 className="hero-title text-white font-medium text-[clamp(56px,10vw,140px)] leading-[0.95] tracking-tight">
              {t("title")}
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed lowercase max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </section>

        <section className="px-6 md:px-10 py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
      </ScrollVideoSection>
    </PageShell>
  );
}
