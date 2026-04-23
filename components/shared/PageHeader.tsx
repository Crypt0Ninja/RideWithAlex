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
        "px-6 md:px-10 pt-16 md:pt-24 pb-12 md:pb-20 max-w-6xl",
        className
      )}
    >
      <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] mb-6">
        {eyebrow}
      </p>
      <h1 className="hero-title text-white font-medium text-[clamp(48px,8vw,120px)]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-8 text-white/70 text-base md:text-lg leading-relaxed lowercase max-w-2xl">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
