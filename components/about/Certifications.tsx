import { useTranslations } from "next-intl";

export function Certifications() {
  const t = useTranslations("about.certifications");

  const certs = [
    { key: "isia" as const, pending: true },
    { key: "bss" as const, pending: true },
    { key: "basi" as const, pending: true },
    { key: "firstAid" as const, pending: false },
  ];

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/10 max-w-6xl mx-auto">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)] mb-6">
        {t("title")}
      </h2>
      <p className="text-white/60 text-sm md:text-base leading-relaxed lowercase max-w-2xl mb-12">
        {t("note")}
      </p>
      <ul className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
        {certs.map(({ key, pending }) => (
          <li
            key={key}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-6"
          >
            <div className="flex flex-col gap-1">
              <p className="text-white text-lg md:text-xl font-medium lowercase tracking-tight">
                {t(`items.${key}.name`)}
              </p>
              <p className="text-white/60 text-sm lowercase">
                {t(`items.${key}.full`)}
              </p>
            </div>
            <span
              className={
                pending
                  ? "text-white/40 text-[10px] uppercase tracking-[0.3em]"
                  : "text-white/80 text-[10px] uppercase tracking-[0.3em]"
              }
            >
              {pending ? t("statusPending") : t("statusActive")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
