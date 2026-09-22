'use client';

import { useState, useRef } from 'react';

const LENS_SIZE = 180;
const ZOOM = 2.5;

export function ImageMagnifier({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{
    left: number;
    top: number;
    bgWidth: number;
    bgHeight: number;
    bgLeft: number;
    bgTop: number;
  } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLens({
      left: x - LENS_SIZE / 2,
      top: y - LENS_SIZE / 2,
      bgWidth: rect.width * ZOOM,
      bgHeight: rect.height * ZOOM,
      bgLeft: -(x * ZOOM - LENS_SIZE / 2),
      bgTop: -(y * ZOOM - LENS_SIZE / 2),
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className ?? ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLens(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="block h-auto max-h-[70vh] w-auto max-w-full select-none"
        draggable={false}
      />
      {lens && (
        <div
          className="pointer-events-none absolute hidden rounded-full border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.25)] md:block"
          style={{
            left: lens.left,
            top: lens.top,
            width: LENS_SIZE,
            height: LENS_SIZE,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${lens.bgWidth}px ${lens.bgHeight}px`,
            backgroundPosition: `${lens.bgLeft}px ${lens.bgTop}px`,
          }}
        />
      )}
    </div>
  );
}
