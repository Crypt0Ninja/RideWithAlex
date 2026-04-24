"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

type NavKey = "lessons" | "about" | "pricing" | "gallery" | "reviews" | "contact";

const links: { href: string; key: NavKey }[] = [
  { href: "/lessons", key: "lessons" },
  { href: "/about", key: "about" },
  { href: "/pricing", key: "pricing" },
  { href: "/gallery", key: "gallery" },
  { href: "/reviews", key: "reviews" },
  { href: "/contact", key: "contact" },
];

type Props = {
  className?: string;
};

export function MobileMenu({ className }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const stripLocale = (path: string) => path.replace(/^\/(en|bg)(?=\/|$)/, "") || "/";
  const currentPath = stripLocale(pathname ?? "/");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="open menu"
        aria-expanded={open}
        className={cn(
          "md:hidden inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm text-white hover:border-white/30 transition-colors",
          className,
        )}
      >
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          aria-hidden
        >
          <line x1="0" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="site navigation"
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="ridewithalex home"
              className="flex items-center gap-2 text-white"
            >
              <Logo className="h-5 w-5" />
              <span className="text-sm tracking-tight lowercase">ridewithalex</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="close menu"
              className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/10 text-white hover:border-white/30 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" />
                <line x1="1" y1="13" x2="13" y2="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-8 gap-2 overflow-y-auto">
            {links.map(({ href, key }) => {
              const active = currentPath === href;
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-4xl font-medium lowercase tracking-tight py-3 transition-colors border-b border-white/5",
                    active ? "text-white" : "text-white/60 hover:text-white",
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 pb-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            <div className="text-white">
              <LocaleSwitcher />
            </div>
            <Link href="/book" onClick={() => setOpen(false)}>
              <Button variant="primary" className="text-sm">
                {t("book")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
