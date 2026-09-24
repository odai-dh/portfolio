'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// 3D code stays out of the initial payload — loads only when 3D mode is entered
const World3D = dynamic<{ onExit?: () => void; framing?: Framing }>(() => import('./three/World3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <p className="animate-pulse rounded-md bg-background/70 px-3 py-1 font-mono text-xs tracking-widest text-muted-foreground backdrop-blur">
        ENTERING 3D…
      </p>
    </div>
  ),
});

type Mode = '2d' | '3d';
export type Framing = 'side' | 'full';

// Below this, the space right of the hero text is too small for the board
const MIN_SIDE_WIDTH = 520;
const GAP = 32;

// Where the hero text actually ends, measured on the text itself (block
// elements span the full column, so their boxes would say nothing useful)
function heroTextRight(root: HTMLElement): number {
  let right = 0;
  const range = document.createRange();
  root.querySelectorAll('#hero h1, #hero h2, #hero p').forEach((el) => {
    range.selectNodeContents(el);
    right = Math.max(right, range.getBoundingClientRect().right);
  });
  root.querySelectorAll('#hero a, #hero button').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) right = Math.max(right, rect.right);
  });
  return right;
}

// Lets the hero know when 3D mode is on, so only one snake game runs at a time
const HeroModeContext = createContext<Mode>('2d');
export const useHeroMode = () => useContext(HeroModeContext);

export function HeroMode({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('2d');
  const [fading, setFading] = useState(false);
  const [eligible, setEligible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  // the 3D canvas takes the space right of the hero text when there's room for it
  const [area, setArea] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (mode !== '3d') return;
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const textRight = heroTextRight(wrap);
      const width = document.documentElement.clientWidth - textRight - GAP;
      setArea(width >= MIN_SIDE_WIDTH ? { left: textRight + GAP - wrap.getBoundingClientRect().left, width } : null);
    };
    measure();
    const late = window.setTimeout(measure, 400); // after fonts and the fade settle
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(late);
      window.removeEventListener('resize', measure);
    };
  }, [mode]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    if (reduced) {
      if (process.env.NODE_ENV === 'development') {
        console.info('[3D mode] toggle hidden: prefers-reduced-motion is set');
      }
      return;
    }
    if (!desktop) return;
    setEligible(true);

    const url = new URL(window.location.href);
    const wants3d =
      url.searchParams.get('mode') === '3d' || localStorage.getItem('view-mode') === '3d';
    if (wants3d) setMode('3d');
  }, []);

  const toggle = useCallback(() => {
    const next: Mode = mode === '2d' ? '3d' : '2d';
    setFading(true);
    window.setTimeout(() => {
      setMode(next);
      try {
        localStorage.setItem('view-mode', next);
        const url = new URL(window.location.href);
        if (next === '3d') url.searchParams.set('mode', '3d');
        else url.searchParams.delete('mode');
        window.history.replaceState(null, '', url);
      } catch {
        // persistence is best-effort
      }
      window.setTimeout(() => setFading(false), 80);
    }, 400);
  }, [mode]);

  // ESC cancels 3D mode
  useEffect(() => {
    if (mode !== '3d') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, toggle]);

  return (
    <HeroModeContext.Provider value={mode}>
      {eligible && (
        <button
          onClick={toggle}
          className="fixed right-4 top-4 z-[60] rounded-md border border-border bg-background/80 px-3 py-1.5 font-mono text-xs tracking-widest backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          {mode === '2d' ? '▸ 3D MODE' : '▸ 2D MODE'}
        </button>
      )}

      {/* the hero stays — in 3D mode the game floats transparently above it */}
      <div ref={wrapRef} className="relative">
        {children}
        {/* one wrapper whose box changes, so a resize never restarts the game */}
        {mode === '3d' && (
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 z-40',
              !area && 'left-1/2 w-screen -translate-x-1/2'
            )}
            style={area ? { left: area.left, width: area.width } : undefined}
          >
            <World3D onExit={toggle} framing={area ? 'side' : 'full'} />
          </div>
        )}
      </div>

      {/* 400ms black fade between worlds */}
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-[70] bg-black transition-opacity duration-[400ms]',
          fading ? 'opacity-100' : 'opacity-0'
        )}
      />
    </HeroModeContext.Provider>
  );
}
