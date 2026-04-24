import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/shared/PageShell";
import { ScrollVideoSection } from "@/components/shared/ScrollVideoSection";
import { ReviewsStats } from "@/components/reviews/ReviewsStats";
import { ReviewsGrid } from "@/components/reviews/ReviewsGrid";
import { ReviewsCta } from "@/components/reviews/ReviewsCta";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: { title: t("title"), description: t("subtitle") },
  };
}

export default function ReviewsPage() {
  const t = useTranslations("reviews");

  return (
    <PageShell>
      <ScrollVideoSection
        frameCount={90}
        framePathPrefix="/videos/lessons/frame-"
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

        <ReviewsStats />
        <ReviewsGrid />
        <ReviewsCta />
      </ScrollVideoSection>
    </PageShell>
  );
}
