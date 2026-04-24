"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";

const filters = ["all", "lessons", "kids", "bansko"] as const;
type FilterKey = (typeof filters)[number];

type Tile = {
  id: number;
  category: Exclude<FilterKey, "all">;
  aspect: string;
  src: string;
};

// Placeholder images sourced from Unsplash (free for commercial use).
// Replace with Alex's own shots when available.
const tiles: Tile[] = [
  { id: 1, category: "lessons", aspect: "aspect-[4/5]", src: "/gallery/lessons-1.webp" },
  { id: 2, category: "bansko", aspect: "aspect-[3/2]", src: "/gallery/bansko-1.webp" },
  { id: 3, category: "lessons", aspect: "aspect-square", src: "/gallery/lessons-2.webp" },
  { id: 4, category: "kids", aspect: "aspect-[4/5]", src: "/gallery/kids-1.webp" },
  { id: 5, category: "bansko", aspect: "aspect-[4/3]", src: "/gallery/bansko-2.webp" },
  { id: 6, category: "lessons", aspect: "aspect-[3/4]", src: "/gallery/lessons-3.webp" },
  { id: 7, category: "kids", aspect: "aspect-square", src: "/gallery/kids-2.webp" },
  { id: 8, category: "bansko", aspect: "aspect-[5/4]", src: "/gallery/bansko-3.webp" },
  { id: 9, category: "lessons", aspect: "aspect-[2/3]", src: "/gallery/lessons-4.webp" },
  { id: 10, category: "kids", aspect: "aspect-[4/3]", src: "/gallery/kids-3.webp" },
  { id: 11, category: "bansko", aspect: "aspect-[3/2]", src: "/gallery/bansko-4.webp" },
  { id: 12, category: "lessons", aspect: "aspect-[4/5]", src: "/gallery/lessons-5.webp" },
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
              "group relative w-full break-inside-avoid rounded-3xl overflow-hidden bg-neutral-900 border border-white/5",
              tile.aspect
            )}
          >
            <Image
              src={tile.src}
              alt={t(`filters.${tile.category}`)}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <span
              aria-hidden
              className="absolute bottom-4 left-4 text-white/70 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {t(`filters.${tile.category}`)}
            </span>
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
