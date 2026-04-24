import { useTranslations } from "next-intl";

export function WhyMe() {
  const t = useTranslations("about.why");

  const points = [
    { key: "pace" as const },
    { key: "language" as const },
    { key: "smallGroups" as const },
    { key: "flexibility" as const },
  ];

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/10 max-w-6xl mx-auto">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)] mb-16">
        {t("title")}
      </h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {points.map(({ key }) => (
          <div key={key} className="flex flex-col gap-3 border-t border-white/10 pt-6">
            <dt className="text-white text-xl md:text-2xl font-medium lowercase tracking-tight">
              {t(`${key}.title`)}
            </dt>
            <dd className="text-white/70 text-sm md:text-base leading-relaxed lowercase">
              {t(`${key}.body`)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
