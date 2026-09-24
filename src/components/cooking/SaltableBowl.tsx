'use client';

import { useRef, useState } from 'react';

type Grain = { id: number; dx: number; dy: number; delay: number; size: number; pepper: boolean };
type Pinch = { id: number; x: number; y: number; grains: Grain[] };

let nextId = 0;

// Click the bowl to season it: a shaker appears, gives it a shake, salt and pepper fall.
export function SaltableBowl({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pinches, setPinches] = useState<Pinch[]>([]);

  const season = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const pinch: Pinch = {
      id: nextId++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      grains: Array.from({ length: 40 }, () => ({
        id: nextId++,
        dx: (Math.random() - 0.5) * 90,
        dy: 40 + Math.random() * 40,
        delay: 180 + Math.random() * 420,
        size: 3 + Math.random() * 3,
        pepper: Math.random() < 0.3,
      })),
    };

    setPinches((current) => [...current.slice(-4), pinch]);
    setTimeout(() => setPinches((current) => current.filter((p) => p.id !== pinch.id)), 1600);
  };

  return (
    <div ref={ref} onClick={season} className={`cursor-pointer ${className ?? ''}`}>
      {pinches.map((pinch) => (
        <div
          key={pinch.id}
          aria-hidden
          className="pointer-events-none absolute"
          style={{ left: pinch.x, top: pinch.y - 70 }}
        >
          <svg
            viewBox="0 0 30 44"
            className="cooking-shaker absolute -left-[22px] -top-[56px] h-[66px] w-[45px] text-[#1C1917]"
            fill="#FFFDF8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          >
            <path d="M6 16 C 6 8, 24 8, 24 16 L 26 40 C 26 43, 4 43, 4 40 Z" />
            <path d="M6 16 H 24" />
            <circle cx="11" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="10.5" r="1" fill="currentColor" />
            <circle cx="19" cy="12" r="1" fill="currentColor" />
          </svg>
          {pinch.grains.map((grain) => (
            <span
              key={grain.id}
              className="cooking-salt absolute rounded-[1px]"
              style={
                {
                  width: grain.size,
                  height: grain.size,
                  background: grain.pepper ? '#1C1917' : '#FFFDF8',
                  boxShadow: grain.pepper ? 'none' : '0 0 0 1px rgba(28,25,23,0.45)',
                  animationDelay: `${grain.delay}ms`,
                  '--dx': `${grain.dx}px`,
                  '--dy': `${grain.dy + 40}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
