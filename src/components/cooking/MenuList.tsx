'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CookingGlyph } from './CookingGlyph';

export type MenuItem = {
  slug: string;
  number: number;
  title: string;
  caption: string;
  dateLabel: string;
  heroPhoto: string;
};

export type MenuGroup = { label: string; items: MenuItem[] };

const PLATE_SIZE = 280;

export function MenuList({ groups }: { groups: MenuGroup[] }) {
  const items = groups.flatMap((group) => group.items);
  const [active, setActive] = useState<string | null>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });

  // The plate trails the cursor and leans into the direction it's moving
  useEffect(() => {
    const pos = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      const dx = target.current.x - pos.x;
      pos.x += dx * 0.14;
      pos.y += (target.current.y - pos.y) * 0.14;
      const lean = Math.max(-18, Math.min(18, dx * 0.12));
      if (plateRef.current) {
        plateRef.current.style.transform = `translate3d(${pos.x - PLATE_SIZE / 2}px, ${pos.y - PLATE_SIZE / 2}px, 0) rotate(${lean}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="menu" className="relative scroll-mt-24 pb-14 pt-24">
      <header className="text-center">
        <p className="font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.3em] text-[#78716C]">
          Served whenever
        </p>
        <h2 className="cooking-display mt-3 font-[family-name:var(--font-fraunces)] text-[56px] italic leading-none text-[#1C1917] md:text-[80px]">
          The Menu
        </h2>
        <div aria-hidden className="mx-auto mt-6 flex w-48 items-center gap-3 text-[#B4532A]">
          <span className="h-px flex-1 bg-current" />
          <CookingGlyph name="whisk" className="h-7 w-7" />
          <span className="h-px flex-1 bg-current" />
        </div>
      </header>

      <div className="mx-auto mt-16 max-w-3xl" onPointerLeave={() => setActive(null)}>
        {groups.map((group) => (
          <div key={group.label} className="mb-14">
            <h3 className="mb-6 text-center font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.3em] text-[#B4532A]">
              {group.label}
            </h3>
            <ul>
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link prefetch={false}
                    href={`/cooking/${item.slug}`}
                    onPointerEnter={() => setActive(item.slug)}
                    onFocus={() => setActive(item.slug)}
                    onBlur={() => setActive(null)}
                    className="group flex items-center gap-4 py-4 outline-none"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full [@media(hover:hover)]:hidden">
                      <Image src={item.heroPhoto} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3 text-[#1C1917]">
                        <span className="font-[family-name:var(--font-manrope)] text-[11px] tabular-nums tracking-[0.1em] text-[#78716C]">
                          No.{String(item.number).padStart(2, '0')}
                        </span>
                        <span className="font-[family-name:var(--font-fraunces)] text-[22px] transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-[#B4532A] group-focus-visible:text-[#B4532A] md:text-[28px]">
                          {item.title}
                        </span>
                        <span aria-hidden className="cooking-leader hidden sm:block" />
                        <span className="hidden shrink-0 font-[family-name:var(--font-manrope)] text-[12px] uppercase tracking-[0.15em] text-[#78716C] sm:block">
                          {item.dateLabel}
                        </span>
                      </span>
                      <span className="mt-1 block truncate font-[family-name:var(--font-fraunces)] text-[15px] italic text-[#78716C] md:pl-[3.4rem]">
                        {item.caption}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* The floating plate — only for real pointers */}
      <div
        ref={plateRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{ width: PLATE_SIZE, height: PLATE_SIZE }}
      >
        <div
          className={`relative h-full w-full rounded-full border-[10px] border-[#F3EDE3] outline outline-1 outline-[#1C1917]/70 transition-[opacity,transform] duration-300 ease-out ${
            active ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {items.map((item) => (
              <Image
                key={item.slug}
                src={item.heroPhoto}
                alt=""
                fill
                sizes={`${PLATE_SIZE}px`}
                loading="eager"
                className={`object-cover transition-opacity duration-200 ${
                  active === item.slug ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
