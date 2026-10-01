'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function CookingTopBar({ aboutHref }: { aboutHref: string }) {
  const [detached, setDetached] = useState(false);

  useEffect(() => {
    const onScroll = () => setDetached(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors',
        detached && 'bg-[#FAF7F2]/80 backdrop-blur-md'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <Link prefetch={false}
          href="/cooking"
          className="font-[family-name:var(--font-fraunces)] text-[20px] font-normal text-[#1C1917]"
        >
          Odai Cooks
        </Link>
        <nav className="flex items-center gap-6 font-[family-name:var(--font-manrope)] text-sm text-[#1C1917]">
          <Link prefetch={false} href={aboutHref}>About</Link>
          <Link prefetch={false} href="/">← Back to portfolio</Link>
        </nav>
      </div>
    </header>
  );
}
