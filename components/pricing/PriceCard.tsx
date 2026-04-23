import { cn } from "@/lib/cn";

type PriceCardProps = {
  name: string;
  duration: string;
  price: string;
  description: string;
  featured?: boolean;
  bestValueLabel: string;
};

export function PriceCard({
  name,
  duration,
  price,
  description,
  featured = false,
  bestValueLabel,
}: PriceCardProps) {
  return (
    <article
      className={cn(
        "relative rounded-3xl p-8 flex flex-col gap-6 border transition-colors",
        featured
          ? "bg-white text-black border-white"
          : "bg-neutral-900 text-white border-white/5 hover:border-white/20"
      )}
    >
      {featured ? (
        <span
          className={cn(
            "absolute -top-3 right-6 bg-black text-white text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full"
          )}
        >
          {bestValueLabel}
        </span>
      ) : null}

      <header>
        <p
          className={cn(
            "uppercase tracking-[0.3em] text-[10px] mb-3",
            featured ? "text-black/50" : "text-white/40"
          )}
        >
          {duration}
        </p>
        <h2
          className={cn(
            "text-3xl md:text-4xl font-medium lowercase tracking-tight",
            featured ? "text-black" : "text-white"
          )}
        >
          {name}
        </h2>
      </header>

      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "hero-title font-medium text-5xl md:text-6xl",
            featured ? "text-black" : "text-white"
          )}
        >
          {price}
        </span>
      </div>

      <p
        className={cn(
          "text-sm leading-relaxed lowercase",
          featured ? "text-black/70" : "text-white/70"
        )}
      >
        {description}
      </p>
    </article>
  );
}
