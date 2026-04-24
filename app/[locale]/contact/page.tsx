import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/shared/PageShell";
import { ScrollVideoSection } from "@/components/shared/ScrollVideoSection";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { MeetingPoint } from "@/components/contact/MeetingPoint";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { ContactCta } from "@/components/contact/ContactCta";
import {
  BreadcrumbListJsonLd,
  FaqPageJsonLd,
} from "@/components/seo/StructuredData";

const FAQ_KEYS = [
  "equipment",
  "clothing",
  "groupSize",
  "minAge",
  "language",
  "weather",
  "cancellation",
  "location",
  "liftPass",
  "payment",
] as const;

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: { title: t("title"), description: t("subtitle") },
  };
}

export default async function ContactPage({ params }: MetadataProps) {
  const { locale } = await params;
  const tFaq = await getTranslations({ locale, namespace: "contact.faq" });
  const tn = await getTranslations({ locale, namespace: "nav" });

  const faqItems = FAQ_KEYS.map((key) => ({
    question: tFaq(`items.${key}.q`),
    answer: tFaq(`items.${key}.a`),
  }));

  return <ContactPageInner locale={locale} faqItems={faqItems} navLabel={tn("contact")} />;
}

function ContactPageInner({
  locale,
  faqItems,
  navLabel,
}: {
  locale: string;
  faqItems: { question: string; answer: string }[];
  navLabel: string;
}) {
  const t = useTranslations("contact");

  return (
    <PageShell>
      <BreadcrumbListJsonLd
        items={[
          { name: "home", href: `/${locale}` },
          { name: navLabel, href: `/${locale}/contact` },
        ]}
      />
      <FaqPageJsonLd items={faqItems} />
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

        <ContactInfo />
        <MeetingPoint />
        <FaqAccordion />
        <ContactCta />
      </ScrollVideoSection>
    </PageShell>
  );
}
