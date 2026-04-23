import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <PrivacyContent />
    </PageShell>
  );
}
