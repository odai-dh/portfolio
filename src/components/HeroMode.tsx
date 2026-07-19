'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// 3D code stays out of the initial payload — loads only when 3D mode is entered
const World3D = dynamic<{ onExit?: () => void }>(() => import('./three/World3D'), {
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

export function HeroMode({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('2d');
  const [fading, setFading] = useState(false);
  const [eligible, setEligible] = useState(false);

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
    <>
      {eligible && (
        <button
          onClick={toggle}
          className="fixed right-4 top-4 z-[60] rounded-md border border-border bg-background/80 px-3 py-1.5 font-mono text-xs tracking-widest backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          {mode === '2d' ? '▸ 3D MODE' : '▸ 2D MODE'}
        </button>
      )}

      <p className="pt-2 font-mono text-[10px] text-muted-foreground md:hidden">
        ▸ 3D mode available on desktop
      </p>

      {/* the hero stays — in 3D mode the game floats transparently above it */}
      <div className="relative">
        {children}
        {mode === '3d' && (
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-40 w-screen -translate-x-1/2">
            <World3D onExit={toggle} />
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
    </>
  );
}
