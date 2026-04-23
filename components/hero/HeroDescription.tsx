import { useTranslations } from "next-intl";

export function HeroDescription() {
  const t = useTranslations("home");
  return (
    <p className="absolute left-6 md:left-10 top-[46%] max-w-[260px] text-[15px] leading-snug text-white/90 lowercase hidden md:block">
      {t("tagline")}
    </p>
  );
}
