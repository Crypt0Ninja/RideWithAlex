import { useTranslations } from "next-intl";

export function BioBlock() {
  const t = useTranslations("about.bio");

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 max-w-6xl mx-auto">
      {/* Portrait placeholder */}
      <div className="md:col-span-5">
        <div
          className="relative aspect-[3/4] w-full bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center"
          aria-label="portrait placeholder"
        >
          <div className="text-center px-6">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
              portrait
            </p>
            <p className="text-white/50 text-sm lowercase">
              {t("portraitPlaceholder")}
            </p>
          </div>
          {/* thin diagonal accent */}
          <span
            aria-hidden
            className="absolute top-8 right-8 diagonal-divider-right"
          />
        </div>
      </div>

      {/* Bio text */}
      <div className="md:col-span-7 flex flex-col gap-6">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
          {t("eyebrow")}
        </p>
        <h2 className="text-white text-3xl md:text-5xl font-medium lowercase tracking-tight leading-tight">
          {t("heading")}
        </h2>
        <div className="flex flex-col gap-4 text-white/80 text-base md:text-lg leading-relaxed lowercase">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}
