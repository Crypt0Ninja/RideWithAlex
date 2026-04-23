import { useTranslations } from "next-intl";

export function MeetingPoint() {
  const t = useTranslations("contact.meeting");

  return (
    <section className="px-6 md:px-10 py-16 md:py-24 border-t border-white/10 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-5 flex flex-col gap-4">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
            {t("eyebrow")}
          </p>
          <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)]">
            {t("title")}
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed lowercase">
            {t("address")}
          </p>
          <p className="text-white/60 text-sm leading-relaxed lowercase">
            {t("directions")}
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
            <iframe
              src="https://www.google.com/maps?q=Bansko+Gondola+Pirin+Street+1&output=embed"
              title={t("mapTitle")}
              className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-90"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
