import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";

const navLinks = [
  { href: "/lessons" as const, key: "lessons" as const },
  { href: "/about" as const, key: "about" as const },
  { href: "/pricing" as const, key: "pricing" as const },
  { href: "/gallery" as const, key: "gallery" as const },
  { href: "/reviews" as const, key: "reviews" as const },
  { href: "/contact" as const, key: "contact" as const },
];

const contactLinks = [
  {
    label: "alex@ridewithalex.org",
    href: "mailto:alex@ridewithalex.org",
    external: false,
  },
  {
    label: "+359 88 513 7471",
    href: "tel:+359885137471",
    external: false,
  },
  {
    label: "@ridewithalex",
    href: "https://instagram.com/ridewithalex",
    external: true,
  },
];

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="border-t border-white/10 bg-black text-white mt-16 md:mt-24">
      <div className="px-6 md:px-10 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* Brand — 5 of 12 cols */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Logo className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium tracking-tight lowercase">
                ridewithalex
              </span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed lowercase max-w-[260px]">
              {t("tagline")}
            </p>
          </div>

          {/* Explore — 4 cols, links in 2-col grid */}
          <nav className="md:col-span-4 flex flex-col gap-4">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
              {t("explore")}
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs lowercase">
              {navLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {tn(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect — 3 cols */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
              {t("contact")}
            </p>
            <ul className="space-y-2 text-xs lowercase">
              {contactLinks.map(({ label, href, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="px-6 md:px-10 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[10px] text-white/40 uppercase tracking-[0.25em]">
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
      </div>
    </footer>
  );
}
