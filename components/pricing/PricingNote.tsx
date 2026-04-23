import { useTranslations } from "next-intl";

export function PricingNote() {
  const t = useTranslations("pricing.note");

  const items = [
    { label: t("deposit.label"), value: t("deposit.value") },
    { label: t("included.label"), value: t("included.value") },
    { label: t("notIncluded.label"), value: t("notIncluded.value") },
    { label: t("cancellation.label"), value: t("cancellation.value") },
  ];

  return (
    <section className="px-6 md:px-10 py-16 md:py-20 border-t border-white/10 max-w-6xl">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-8">
        {t("eyebrow")}
      </p>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {items.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-2">
            <dt className="text-white text-lg font-medium lowercase tracking-tight">
              {label}
            </dt>
            <dd className="text-white/70 text-sm md:text-base leading-relaxed lowercase">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
