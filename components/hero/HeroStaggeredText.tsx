import { cn } from "@/lib/cn";

const words = [
  { text: "ride", className: "left-4 md:left-10 top-[18%]", delay: 0 },
  { text: "with", className: "right-4 md:right-10 top-[38%]", delay: 120 },
  { text: "alex", className: "left-[18%] md:left-[28%] top-[58%]", delay: 240 },
];

export function HeroStaggeredText() {
  return (
    <>
      {words.map(({ text, className, delay }) => (
        <h1
          key={text}
          className={cn(
            "hero-title absolute text-white font-medium text-[18vw] md:text-[13vw] leading-none",
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
