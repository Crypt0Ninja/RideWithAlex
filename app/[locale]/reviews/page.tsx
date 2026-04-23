import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReviewsStats } from "@/components/reviews/ReviewsStats";
import { ReviewsGrid } from "@/components/reviews/ReviewsGrid";
import { ReviewsCta } from "@/components/reviews/ReviewsCta";

export default function ReviewsPage() {
  const t = useTranslations("reviews");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ReviewsStats />
      <ReviewsGrid />
      <ReviewsCta />
    </PageShell>
  );
}
