'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// A short silent loop over a project's still image on the featured cards.
// - The still image stays underneath; the video fades in only once it is actually playing, so
//   there is never a blank box (and without JavaScript the still is all you see).
// - It plays only while on screen, never downloads before it is near the screen, and does not
//   start by itself for visitors who prefer reduced motion.
// - Anything that moves for more than five seconds needs a way to stop it (WCAG 2.2.2), hence the
//   pause button.
export function ProjectVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // stays true after the first frame, so a paused video keeps showing where it stopped
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !video.dataset.userPaused) {
          if (video.preload === 'none') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      delete video.dataset.userPaused;
      video.preload = 'auto';
      video.play().catch(() => {});
    } else {
      video.dataset.userPaused = 'true';
      video.pause();
    }
  };
  const paused = !playing;

  return (
    <>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        onPlaying={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 group-hover:scale-105 ${started ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? `Play the ${label} preview` : `Pause the ${label} preview`}
        className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground backdrop-blur transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
    </>
  );
}
