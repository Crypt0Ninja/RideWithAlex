import { cn } from "@/lib/cn";

type NavPillProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "nav";
};

export function NavPill({ as = "div", className, children, ...props }: NavPillProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "bg-neutral-900/90 backdrop-blur rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
