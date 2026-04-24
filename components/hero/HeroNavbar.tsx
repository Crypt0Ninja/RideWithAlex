import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NavPill } from "@/components/ui/NavPill";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { MobileMenu } from "@/components/shared/MobileMenu";

export function HeroNavbar() {
  const t = useTranslations("nav");
  const navLinks = [
    { href: "/lessons", key: "lessons" as const },
    { href: "/about", key: "about" as const },
    { href: "/pricing", key: "pricing" as const },
    { href: "/gallery", key: "gallery" as const },
    { href: "/reviews", key: "reviews" as const },
    { href: "/contact", key: "contact" as const },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 md:px-10 pt-6 flex items-center justify-between gap-4">
      <NavPill className="flex items-center gap-2 pl-4 pr-6 py-3">
        <Logo className="h-5 w-5 text-white" />
        <span className="text-white text-sm font-normal tracking-tight lowercase">
          ridewithalex
        </span>
      </NavPill>

      <NavPill
        as="div"
        className="hidden md:flex items-center gap-1 px-3 py-2"
      >
        {navLinks.map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full lowercase"
          >
            {t(key)}
          </Link>
        ))}
      </NavPill>

      <div className="flex items-center gap-3">
        <NavPill className="hidden md:flex items-center px-4 py-2">
          <LocaleSwitcher />
        </NavPill>
        <Link href="/book" className="hidden sm:inline-flex">
          <Button variant="primary" className="text-sm">
            {t("book")}
          </Button>
        </Link>
        <MobileMenu />
      </div>
    </nav>
  );
}
