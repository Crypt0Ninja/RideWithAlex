"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  frameCount: number;
  framePathPrefix: string;
  frameExtension?: string;
  framePathPad?: number;
  /** Total scroll distance in vh. Default 200 = user scrolls 1 viewport height
   *  through the entire frame range (wrapper is 200vh, 100vh is sticky). */
  scrollRangeVh?: number;
  children: React.ReactNode;
};

export function ScrollVideoSection({
  frameCount,
  framePathPrefix,
  frameExtension = "webp",
  framePathPad = 3,
  scrollRangeVh = 200,
  children,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [criticalLoaded, setCriticalLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pad = (n: number) => n.toString().padStart(framePathPad, "0");
    const frames: HTMLImageElement[] = [];
    const critical = Math.min(8, frameCount);
    let completed = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = `${framePathPrefix}${pad(i)}.${frameExtension}`;
      const onSettled = () => {
        completed += 1;
        setLoadedCount(completed);
        if (completed >= critical) setCriticalLoaded(true);
      };
      img.onload = onSettled;
      img.onerror = onSettled;
      frames.push(img);
    }
    framesRef.current = frames;
  }, [frameCount, framePathPrefix, frameExtension, framePathPad]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawFrame = (index: number) => {
      const img = framesRef.current[index];
      const ctx = canvas.getContext("2d");
      if (!img || !img.complete || !ctx) return;

      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      if (!canvasW || !canvasH || !imgW || !imgH) return;

      const canvasRatio = canvasW / canvasH;
      const imgRatio = imgW / imgH;

      let sx: number, sy: number, sw: number, sh: number;
      if (imgRatio > canvasRatio) {
        sh = imgH;
        sw = imgH * canvasRatio;
        sx = (imgW - sw) / 2;
        sy = 0;
      } else {
        sw = imgW;
        sh = imgW / canvasRatio;
        sx = 0;
        sy = (imgH - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const nextW = Math.max(1, Math.ceil(rect.width * dpr));
      const nextH = Math.max(1, Math.ceil(rect.height * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
    };

    let rafId = 0;
    let lastIndex = -1;

    const update = () => {
      rafId = 0;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      resizeCanvas();

      const rect = wrapper.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(0, -rect.top), Math.max(scrollRange, 1));
      const progress = scrollRange > 0 ? scrolled / scrollRange : 0;
      const index = reducedMotion
        ? 0
        : Math.min(frameCount - 1, Math.floor(progress * (frameCount - 1)));

      if (index !== lastIndex) {
        lastIndex = index;
        drawFrame(index);
      } else {
        drawFrame(index);
      }
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [frameCount, reducedMotion, criticalLoaded]);

  const progressPct = Math.round((loadedCount / frameCount) * 100);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `${scrollRangeVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" aria-hidden />
        <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-10">
          {children}
        </div>
        {!criticalLoaded && (
          <div className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-white/40">
            loading {progressPct}%
          </div>
        )}
      </div>
    </div>
  );
}
