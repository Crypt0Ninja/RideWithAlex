import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { MeetingPoint } from "@/components/contact/MeetingPoint";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { ContactCta } from "@/components/contact/ContactCta";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ContactInfo />
      <MeetingPoint />
      <FaqAccordion />
      <ContactCta />
    </PageShell>
  );
}
