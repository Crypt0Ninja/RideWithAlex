import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { BioBlock } from "@/components/about/BioBlock";
import { WhyMe } from "@/components/about/WhyMe";
import { Certifications } from "@/components/about/Certifications";
import { AboutCta } from "@/components/about/AboutCta";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <BioBlock />
      <WhyMe />
      <Certifications />
      <AboutCta />
    </PageShell>
  );
}
