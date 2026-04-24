import { useTranslations } from "next-intl";

const reviewKeys = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;

export function ReviewsGrid() {
  const t = useTranslations("reviews");

  return (
    <section className="px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {reviewKeys.map((key) => (
        <article
          key={key}
          className="bg-neutral-900 rounded-3xl p-8 border border-white/5 flex flex-col gap-6"
        >
          <span aria-hidden className="text-white/20 text-6xl leading-none font-medium">
            &ldquo;
          </span>
          <p className="text-white/90 text-base md:text-lg leading-relaxed lowercase -mt-6">
            {t(`items.${key}.quote`)}
          </p>
          <footer className="border-t border-white/10 pt-6 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 text-sm lowercase">
              <p className="text-white font-medium">{t(`items.${key}.name`)}</p>
              <p className="text-white/60">{t(`items.${key}.country`)}</p>
            </div>
            <div className="flex flex-col gap-1 text-xs text-right text-white/40 uppercase tracking-[0.2em]">
              <p>{t(`items.${key}.level`)}</p>
              <p>{t(`items.${key}.date`)}</p>
            </div>
          </footer>
        </article>
      ))}
    </section>
  );
}
