import { CookingGlyph, GLYPH_NAMES } from './CookingGlyph';

export function DishTicker({ dishes }: { dishes: string[] }) {
  const row = dishes.map((dish, index) => (
    <span key={dish} className="flex items-center gap-8 pr-8">
      <span>{dish}</span>
      <CookingGlyph
        name={GLYPH_NAMES[index % GLYPH_NAMES.length]}
        className="h-7 w-7 text-[#F3C98B]"
      />
    </span>
  ));

  // The outer wrapper clips the tilted band so it can't widen the page
  return (
    <div aria-hidden className="overflow-hidden py-6">
      <div className="-mx-4 -rotate-1 overflow-hidden bg-[#B4532A] py-4 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#FAF7F2] md:text-[32px]">
        <div className="cooking-marquee flex w-max whitespace-nowrap">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
