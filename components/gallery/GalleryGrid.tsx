"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";

const filters = ["all", "lessons", "kids", "bansko"] as const;
type FilterKey = (typeof filters)[number];

type Tile = {
  id: number;
  category: Exclude<FilterKey, "all">;
  aspect: string;
};

const tiles: Tile[] = [
  { id: 1, category: "lessons", aspect: "aspect-[4/5]" },
  { id: 2, category: "bansko", aspect: "aspect-[3/2]" },
  { id: 3, category: "lessons", aspect: "aspect-square" },
  { id: 4, category: "kids", aspect: "aspect-[4/5]" },
  { id: 5, category: "bansko", aspect: "aspect-[4/3]" },
  { id: 6, category: "lessons", aspect: "aspect-[3/4]" },
  { id: 7, category: "kids", aspect: "aspect-square" },
  { id: 8, category: "bansko", aspect: "aspect-[5/4]" },
  { id: 9, category: "lessons", aspect: "aspect-[2/3]" },
  { id: 10, category: "kids", aspect: "aspect-[4/3]" },
  { id: 11, category: "bansko", aspect: "aspect-[3/2]" },
  { id: 12, category: "lessons", aspect: "aspect-[4/5]" },
];

export function GalleryGrid() {
  const t = useTranslations("gallery");
  const [active, setActive] = useState<FilterKey>("all");

  const visible = active === "all" ? tiles : tiles.filter((tile) => tile.category === active);

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={cn(
              "px-5 py-2 rounded-full text-sm lowercase transition-colors border",
              active === key
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/70 border-white/20 hover:border-white/40 hover:text-white"
            )}
          >
            {t(`filters.${key}`)}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4">
        {visible.map((tile) => (
          <div
            key={tile.id}
            className={cn(
              "relative w-full break-inside-avoid rounded-3xl overflow-hidden bg-neutral-900 border border-white/5",
              tile.aspect
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">
                  {t(`filters.${tile.category}`)}
                </p>
                <p className="text-white/30 text-xs lowercase mt-2">
                  {t("tilePlaceholder")}
                </p>
              </div>
            </div>
            <span
              aria-hidden
              className="absolute top-4 right-4 diagonal-divider-right"
            />
          </div>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-white/40 text-sm lowercase text-center py-12">
          {t("emptyState")}
        </p>
      ) : null}
    </section>
  );
}
