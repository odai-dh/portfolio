import Image from 'next/image';
import { CookingGlyph, type GlyphName } from './CookingGlyph';
import { SaltableBowl } from './SaltableBowl';

// The rim is split into arcs with a kitchen mark in each gap
const RIM_RADIUS = 228;
const RIM_GAP = 54;
const RIM_SEGMENTS: { text: string; glyph: GlyphName }[] = [
  { text: 'Odai cooks', glyph: 'pan' },
  { text: 'Powered by carbs and bad decisions', glyph: 'whisk' },
  { text: 'Stockholm, mostly weekends', glyph: 'chili' },
];

function rimLayout() {
  const circumference = 2 * Math.PI * RIM_RADIUS;
  const perChar =
    (circumference - RIM_SEGMENTS.length * RIM_GAP) /
    RIM_SEGMENTS.reduce((sum, segment) => sum + segment.text.length, 0);

  let offset = 0;
  return RIM_SEGMENTS.map((segment) => {
    // Glyph sits in the middle of the gap that precedes its text
    const angle = (offset + RIM_GAP / 2) / RIM_RADIUS;
    const glyph = {
      name: segment.glyph,
      x: 250 - RIM_RADIUS * Math.cos(angle),
      y: 250 - RIM_RADIUS * Math.sin(angle),
      rotate: (angle * 180) / Math.PI - 90,
    };
    const length = segment.text.length * perChar;
    const text = { value: segment.text, start: offset + RIM_GAP, length };
    offset += RIM_GAP + length;
    return { glyph, text };
  });
}

export function PlateHero() {
  const rim = rimLayout();

  return (
    <section className="grid items-center gap-14 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
      <div>
        <p className="flex items-center font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.3em] text-[#78716C]">
          A cooking journal
          <CookingGlyph name="pan" className="mx-3 h-5 w-5 text-[#B4532A]" />
          Stockholm
        </p>
        <h1 className="cooking-display mt-6 font-[family-name:var(--font-fraunces)] text-[clamp(3.2rem,8vw,7rem)] font-normal leading-[0.92] tracking-[-0.025em] text-[#1C1917]">
          Powered by <em className="text-[#B4532A]">carbs</em>
          <br />
          and bad <em>decisions.</em>
        </h1>
        <p className="mt-8 max-w-sm font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#78716C]">
          Stockholm, mostly weekends.
        </p>
        <a
          href="#menu"
          className="mt-10 inline-flex items-center gap-3 border-b border-[#1C1917] pb-1 font-[family-name:var(--font-manrope)] text-sm uppercase tracking-[0.2em] text-[#1C1917] transition-colors hover:border-[#B4532A] hover:text-[#B4532A]"
        >
          Read the menu <span aria-hidden>↓</span>
        </a>
      </div>

      <div>
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          {/* Steam, drawn like pen lines */}
          <svg
            aria-hidden
            viewBox="0 0 120 140"
            className="cooking-steam absolute -top-[30%] left-1/2 z-10 w-[22%] -translate-x-1/2 text-[#1C1917]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M30 135 C 10 110, 50 95, 30 70 S 10 30, 30 5" />
            <path d="M60 135 C 40 110, 80 95, 60 70 S 40 30, 60 5" />
            <path d="M90 135 C 70 110, 110 95, 90 70 S 70 30, 90 5" />
          </svg>

          {/* Rim text and marks, turning the other way */}
          <svg aria-hidden viewBox="0 0 500 500" className="cooking-spin-rim absolute inset-0 text-[#1C1917]">
            <defs>
              <path
                id="plate-rim"
                d={`M250,250 m-${RIM_RADIUS},0 a${RIM_RADIUS},${RIM_RADIUS} 0 1,1 ${RIM_RADIUS * 2},0 a${RIM_RADIUS},${RIM_RADIUS} 0 1,1 -${RIM_RADIUS * 2},0`}
              />
            </defs>
            {rim.map(({ glyph, text }) => (
              <g key={text.value}>
                <g
                  transform={`translate(${glyph.x} ${glyph.y}) rotate(${glyph.rotate}) translate(-16 -16)`}
                  className="text-[#B4532A]"
                >
                  <CookingGlyph name={glyph.name} size={32} />
                </g>
                <text
                  className="font-[family-name:var(--font-manrope)] uppercase"
                  fontSize="15"
                  fontWeight="600"
                  fill="currentColor"
                  dy="5"
                >
                  <textPath
                    href="#plate-rim"
                    startOffset={text.start}
                    textLength={text.length}
                    lengthAdjust="spacing"
                  >
                    {text.value}
                  </textPath>
                </text>
              </g>
            ))}
          </svg>

          <div className="absolute inset-[10%] rounded-full border border-[#1C1917]/80" />
          <div className="absolute inset-[12.5%] overflow-hidden rounded-full bg-[#E7E0D4]">
            <div className="cooking-spin-slow absolute inset-0">
              <Image
                src="/images/cooking/ramen.jpg"
                alt="Top-down bowl of ramen with steak, soft eggs, mushrooms and spring onion"
                fill
                priority
                sizes="(min-width: 768px) 420px, 80vw"
                className="scale-[1.18] object-cover"
                style={{ objectPosition: '55% 53%' }}
              />
            </div>
          </div>
          <SaltableBowl className="absolute inset-[12.5%] z-20 rounded-full" />
        </div>
        <p className="mt-6 text-center font-[family-name:var(--font-fraunces)] text-[15px] italic text-[#78716C]">
          Needs salt? Tap the bowl.
        </p>
      </div>
    </section>
  );
}
