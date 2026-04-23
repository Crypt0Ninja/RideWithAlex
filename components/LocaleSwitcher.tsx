"use client";

import { useLocale } from "next-intl";
import { usePathname, Link, routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const current = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm lowercase">
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/30">/</span>}
          <Link
            href={pathname}
            locale={locale}
            className={
              locale === current
                ? "text-white"
                : "text-white/50 hover:text-white transition-colors"
            }
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
