'use client';
import { useEffect, useRef, type ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
}

// Scroll-in reveal that never hides content it shouldn't. The markup is visible by default, so
// the page reads fine without JavaScript and before it has loaded. Once JS runs, only blocks
// that are still below the screen get hidden ("armed") and fade in when scrolled to; anything
// already on screen (the hero, most importantly) is left alone.
// The state lives in a data attribute styled in globals.css, so revealing never re-renders React.
export function FadeIn({ children, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.reveal === 'shown') return;
    if (!el.dataset.reveal) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.dataset.reveal = 'armed';
    }

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        el.dataset.reveal = 'shown';
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
