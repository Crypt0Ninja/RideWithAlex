"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  frameCount: number;
  framePathPrefix: string;
  frameExtension?: string;
  framePathPad?: number;
  children: React.ReactNode;
};

/**
 * Full-page scroll video background. Canvas sits in a sticky wrapper that
 * spans the entire content height; the video scrubs as the user scrolls
 * from the top to the bottom of the children. All children render over
 * the video with a gradient overlay for contrast.
 */
export function ScrollVideoSection({
  frameCount,
  framePathPrefix,
  frameExtension = "webp",
  framePathPad = 3,
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
    <div ref={wrapperRef} className="relative min-h-screen">
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"
          aria-hidden
        />
      </div>
      <div className="relative z-10 -mt-[100vh]">{children}</div>
      {!criticalLoaded && (
        <div className="fixed bottom-6 right-6 z-20 text-[10px] uppercase tracking-[0.3em] text-white/40">
          loading {progressPct}%
        </div>
      )}
    </div>
  );
}
