type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="ridewithalex"
    >
      <path d="M5 27 L16 5 L27 27" />
      <path d="M10 19 L22 19" />
    </svg>
  );
}
