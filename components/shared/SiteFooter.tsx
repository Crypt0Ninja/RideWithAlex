import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const navLinks = [
    { href: "/lessons" as const, key: "lessons" as const },
    { href: "/pricing" as const, key: "pricing" as const },
    { href: "/gallery" as const, key: "gallery" as const },
    { href: "/reviews" as const, key: "reviews" as const },
    { href: "/contact" as const, key: "contact" as const },
  ];

  return (
    <footer className="bg-black text-white border-t border-white/10 mt-24">
      <div className="px-6 md:px-10 py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Logo className="h-6 w-6 text-white" />
            <span className="text-white text-lg font-medium tracking-tight lowercase">
              ridewithalex
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed lowercase max-w-xs">
            {t("tagline")}
          </p>
        </div>

        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
            {t("explore")}
          </p>
          <ul className="space-y-2">
            {navLinks.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-white/70 hover:text-white transition-colors text-sm lowercase"
                >
                  {tn(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
            {t("contact")}
          </p>
          <ul className="space-y-2 text-sm lowercase">
            <li>
              <a
                href="mailto:alex@ridewithalex.org"
                className="text-white/70 hover:text-white transition-colors"
              >
                alex@ridewithalex.org
              </a>
            </li>
            <li>
              <a
                href="tel:+359885137471"
                className="text-white/70 hover:text-white transition-colors"
              >
                +359 88 513 7471
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/ridewithalex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                @ridewithalex
              </a>
            </li>
            <li className="text-white/50 not-italic">{t("meetingPoint")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50 lowercase">
        <p>© 2026 ridewithalex · {t("rights")}</p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-white transition-colors">
            {t("terms")}
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
