import { cn } from "@/lib/cn";

type StatBlockProps = {
  value: string;
  label: string;
  align?: "left" | "right";
  dividerDirection?: "up" | "down";
  className?: string;
};

export function StatBlock({
  value,
  label,
  align = "left",
  dividerDirection = "up",
  className,
}: StatBlockProps) {
  const rowJustify = align === "right" ? "justify-end" : "justify-start";
  const labelAlign = align === "right" ? "text-right" : "text-left";
  const dividerClass =
    dividerDirection === "up" ? "diagonal-divider-right" : "diagonal-divider-left";
  const divider = <span aria-hidden className={cn("hidden md:block", dividerClass)} />;
  return (
    <div className={className}>
      <div className={cn("flex items-center gap-3", rowJustify)}>
        {align === "right" ? (
          <>
            {divider}
            <span className="text-4xl md:text-5xl font-medium tracking-tight">
              {value}
            </span>
          </>
        ) : (
          <>
            <span className="text-4xl md:text-5xl font-medium tracking-tight">
              {value}
            </span>
            {divider}
          </>
        )}
      </div>
      <p className={cn("text-xs md:text-sm text-white/70 mt-1 lowercase", labelAlign)}>
        {label}
      </p>
    </div>
  );
}
