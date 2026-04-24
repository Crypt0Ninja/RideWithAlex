import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function GalleryUploadHint() {
  const t = useTranslations("gallery.hint");

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/10 max-w-4xl mx-auto">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="text-white text-2xl md:text-3xl font-medium lowercase tracking-tight mb-6">
        {t("title")}
      </h2>
      <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase max-w-2xl mb-8">
        {t("body")}
      </p>
      <Link href="/book">
        <Button variant="secondary">{t("cta")}</Button>
      </Link>
    </section>
  );
}
