import { cn } from "@/lib/cn";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, subtitle, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "px-6 md:px-10 pt-24 md:pt-32 pb-16 md:pb-24 max-w-4xl mx-auto text-center flex flex-col gap-6 md:gap-10",
        className
      )}
    >
      <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.4em]">
        {eyebrow}
      </p>
      <h1 className="hero-title text-white font-medium text-[clamp(56px,10vw,140px)] leading-[0.95] tracking-tight">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-white/70 text-base md:text-lg leading-relaxed lowercase max-w-2xl mx-auto">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
