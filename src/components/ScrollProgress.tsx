'use client';

import { useEffect, useRef } from 'react';

// The bar follows the scroll position exactly. It is scaled with a transform (which the browser
// can draw without re-laying out the page) and updated at most once per frame, straight on the
// element. An earlier version set React state on every scroll event and animated `width` with a
// 150 ms transition, so the bar trailed behind the page and moved in visible steps.
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-primary to-accent will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
