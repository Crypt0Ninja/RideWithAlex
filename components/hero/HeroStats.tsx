import { useTranslations } from "next-intl";
import { StatBlock } from "@/components/ui/StatBlock";

export function HeroStats() {
  const t = useTranslations("stats");
  return (
    <>
      <div className="absolute right-6 md:right-24 top-[14%]">
        <StatBlock
          value="+8"
          label={t("years.label")}
          align="right"
          dividerDirection="up"
        />
      </div>

      <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
        <StatBlock
          value="+500"
          label={t("riders.label")}
          align="left"
          dividerDirection="down"
        />
      </div>

      <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
        <StatBlock
          value="+12"
          label={t("countries.label")}
          align="right"
          dividerDirection="down"
        />
      </div>
    </>
  );
}
