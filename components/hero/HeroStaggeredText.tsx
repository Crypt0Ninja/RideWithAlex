import { cn } from "@/lib/cn";

const words = [
  {
    text: "ride",
    className: "left-4 md:left-10 top-[14%] md:top-[18%]",
    delay: 0,
  },
  {
    // On mobile: left-anchored to prevent right-anchor overflow on narrow screens.
    // On desktop (md+): right-anchored for the original staggered look.
    text: "with",
    className: "left-4 md:left-auto md:right-10 top-[34%] md:top-[38%]",
    delay: 120,
  },
  {
    text: "alex",
    className: "left-[18%] md:left-[28%] top-[54%] md:top-[58%]",
    delay: 240,
  },
];

export function HeroStaggeredText() {
  return (
    <>
      {words.map(({ text, className, delay }) => (
        <h1
          key={text}
          className={cn(
            "hero-title absolute text-white font-medium leading-none",
            "text-[clamp(56px,15vw,160px)] md:text-[clamp(96px,13vw,220px)]",
            "opacity-0 translate-y-3 motion-safe:animate-[hero-word-in_600ms_ease-out_forwards]",
            "motion-reduce:opacity-100 motion-reduce:translate-y-0",
            className
          )}
          style={{ animationDelay: `${delay}ms` }}
        >
          {text}
        </h1>
      ))}
    </>
  );
}
