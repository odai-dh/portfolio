// Hand-drawn kitchen marks, in the same pen-line style as the hero steam.
const GLYPHS = {
  pan: (
    <>
      <path d="M2 11 H16 C 16 15.5, 13.5 18, 9 18 C 4.5 18, 2 15.5, 2 11 Z" />
      <path d="M16 12 H22.5" strokeWidth="2.8" />
      <path d="M6 8 C 5 6.5, 7 5.5, 6 4 M10 8 C 9 6.5, 11 5.5, 10 4" />
    </>
  ),
  whisk: (
    <>
      <path d="M12 23 V15" strokeWidth="2.4" />
      <path d="M12 15 C 5 12, 6 2, 12 2 C 18 2, 19 12, 12 15" />
      <path d="M12 15 C 9 11, 9.5 3, 12 2 C 14.5 3, 15 11, 12 15" />
    </>
  ),
  chili: (
    <>
      <path d="M8 7 C 15 7, 19 12, 20 21 C 13 18, 7 14, 8 7 Z" />
      <path d="M8 7 C 7 4, 5 3, 3 3.5" />
      <path d="M6.5 7.5 C 8 5.5, 10 5.5, 11 7" />
    </>
  ),
  garlic: (
    <>
      <path d="M12 3 C 12 6, 11 7, 9 8.5 C 5 11, 4 15, 5.5 18 C 7 21, 17 21, 18.5 18 C 20 15, 19 11, 15 8.5 C 13 7, 12 6, 12 3 Z" />
      <path d="M12 9 C 10 12, 10 17, 12 20.5 M12 9 C 14 12, 14 17, 12 20.5" />
    </>
  ),
  knife: (
    <>
      <path d="M2 16 L15 5 C 17 7, 17 10, 14 12 L6 17 Z" />
      <path d="M15 12 L21 19" strokeWidth="2.6" />
    </>
  ),
  egg: (
    <>
      <path d="M12 2.5 C 7 2.5, 4.5 10, 4.5 14 C 4.5 18.5, 8 21.5, 12 21.5 C 16 21.5, 19.5 18.5, 19.5 14 C 19.5 10, 17 2.5, 12 2.5 Z" />
      <circle cx="12" cy="14" r="3.2" fill="currentColor" />
    </>
  ),
} as const;

export type GlyphName = keyof typeof GLYPHS;
export const GLYPH_NAMES = Object.keys(GLYPHS) as GlyphName[];

export function CookingGlyph({
  name,
  className,
  size,
}: {
  name: GlyphName;
  className?: string;
  // Explicit pixel size, for use nested inside another <svg>
  size?: number;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? 'inline-block h-[1em] w-[1em]'}
    >
      {GLYPHS[name]}
    </svg>
  );
}
