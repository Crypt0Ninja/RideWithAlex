"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";

const faqKeys = [
  "equipment",
  "clothing",
  "groupSize",
  "minAge",
  "language",
  "weather",
  "cancellation",
  "location",
  "liftPass",
  "payment",
] as const;

type FaqKey = (typeof faqKeys)[number];

export function FaqAccordion() {
  const t = useTranslations("contact.faq");
  const [openKey, setOpenKey] = useState<FaqKey | null>(null);

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/10 max-w-4xl mx-auto">
      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
        {t("eyebrow")}
      </p>
      <h2 className="hero-title text-white font-medium text-[clamp(36px,6vw,72px)] mb-12">
        {t("title")}
      </h2>

      <ul className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
        {faqKeys.map((key) => {
          const isOpen = openKey === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : key)}
                aria-expanded={isOpen}
                aria-controls={`faq-${key}`}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="text-white text-lg md:text-xl font-medium lowercase tracking-tight group-hover:text-white/80 transition-colors">
                  {t(`items.${key}.q`)}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "text-white/40 text-2xl leading-none transition-transform shrink-0",
                    isOpen ? "rotate-45" : "rotate-0"
                  )}
                >
                  +
                </span>
              </button>
              <div
                id={`faq-${key}`}
                hidden={!isOpen}
                className="pb-6 pr-10 text-white/70 text-sm md:text-base leading-relaxed lowercase"
              >
                {t(`items.${key}.a`)}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
