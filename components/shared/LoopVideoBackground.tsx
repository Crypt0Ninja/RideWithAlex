type Props = {
  src: string;
  poster?: string;
  /** Tailwind gradient for the overlay. Default is a darker mix tuned for
   *  legible form content on top. */
  overlayClassName?: string;
  children: React.ReactNode;
};

/**
 * Ambient autoplay-loop video background for content-heavy or form pages.
 * Uses a sticky container pattern (wrapper spans the children's height, inner
 * sticks to the viewport) so the video stays visible while the user scrolls
 * through the content.
 */
export function LoopVideoBackground({
  src,
  poster,
  overlayClassName = "bg-gradient-to-b from-black/55 via-black/60 to-black/80",
  children,
}: Props) {
  return (
    <div className="relative min-h-screen">
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden
        >
          <source src={src} type="video/mp4" />
        </video>
        <div aria-hidden className={`absolute inset-0 ${overlayClassName}`} />
      </div>
      <div className="relative z-10 -mt-[100vh]">{children}</div>
    </div>
  );
}
