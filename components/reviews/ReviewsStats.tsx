import { useTranslations } from "next-intl";
import { StatBlock } from "@/components/ui/StatBlock";

export function ReviewsStats() {
  const t = useTranslations("stats");

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6 md:gap-12 border-t border-b border-white/10 py-10 md:py-14">
        <StatBlock
          value="+500"
          label={t("riders.label")}
          align="left"
          dividerDirection="down"
        />
        <StatBlock
          value="+12"
          label={t("countries.label")}
          align="left"
          dividerDirection="down"
        />
        <StatBlock
          value="+8"
          label={t("years.label")}
          align="left"
          dividerDirection="down"
        />
      </div>
    </section>
  );
}
