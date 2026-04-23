import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { TermsContent } from "@/components/terms/TermsContent";

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <TermsContent />
    </PageShell>
  );
}
