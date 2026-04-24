import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const sectionKeys = [
  "service",
  "booking",
  "payment",
  "cancellation",
  "weather",
  "equipment",
  "liability",
  "minors",
  "intellectualProperty",
  "changes",
] as const;

export function TermsContent() {
  const t = useTranslations("terms");

  return (
    <section className="px-6 md:px-10 pb-24 md:pb-32 max-w-3xl mx-auto">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-10">
        {t("lastUpdatedLabel")}: {t("lastUpdated")}
      </p>

      <article className="flex flex-col gap-12">
        {sectionKeys.map((key, index) => (
          <section
            key={key}
            className="flex flex-col gap-4 border-t border-white/10 pt-10 first:border-t-0 first:pt-0"
          >
            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-medium lowercase tracking-tight">
              {t(`sections.${key}.title`)}
            </h2>
            <div className="flex flex-col gap-4 text-white/80 text-base leading-relaxed lowercase">
              <p>{t(`sections.${key}.p1`)}</p>
              <p>{t(`sections.${key}.p2`)}</p>
            </div>
          </section>
        ))}
      </article>

      <footer className="mt-16 border-t border-white/10 pt-10 flex flex-col gap-4 text-sm text-white/60 lowercase">
        <p>{t("footer.questions")}</p>
        <p>
          <a
            href="mailto:alex@ridewithalex.com"
            className="text-white/80 hover:text-white transition-colors"
          >
            alex@ridewithalex.com
          </a>
        </p>
        <p>
          <Link
            href="/privacy"
            className="text-white/60 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
          >
            {t("footer.privacyLink")}
          </Link>
        </p>
      </footer>
    </section>
  );
}
