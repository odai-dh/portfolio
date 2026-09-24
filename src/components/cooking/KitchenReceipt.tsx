import type { CookingEntry } from '@/lib/cooking';
import { formatCookingDate } from '@/lib/cooking';

function count(entries: CookingEntry[], pattern: RegExp) {
  return entries.filter((entry) => pattern.test(entry.title)).length;
}

function Row({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{left}</span>
      <span className="text-right">{right}</span>
    </div>
  );
}

const Rule = () => <div aria-hidden className="my-3 border-t border-dashed border-[#1C1917]/50" />;

export function KitchenReceipt({ entries }: { entries: CookingEntry[] }) {
  const newest = entries[0];
  const oldest = entries[entries.length - 1];
  const dateLong = { year: 'numeric' } as const;

  return (
    <div className="cooking-receipt mx-auto w-full max-w-[340px] rotate-[2deg] bg-[#FFFDF8] px-7 py-10 font-mono text-[12px] uppercase leading-relaxed text-[#1C1917]">
      <p className="text-center text-[15px] font-bold tracking-[0.2em]">Odai&apos;s Kitchen</p>
      <p className="text-center text-[#78716C]">Stockholm · mostly weekends</p>
      <Rule />
      <Row left="Table 1" right="Guest: you" />
      <Rule />
      <Row left={`${entries.length} × plates`} right="cooked" />
      <Row left={`${count(entries, /ramen/i)} × ramen`} right="slurped" />
      <Row left={`${count(entries, /steak/i)} × steak`} right="seared" />
      <Row left={`${count(entries, /pizza/i)} × pizza`} right="folded" />
      <Rule />
      <Row left="Carbs" right="Plenty" />
      <Row left="Bad decisions" right="All of them" />
      <Rule />
      {oldest && <Row left="First plate" right={formatCookingDate(oldest.date, dateLong)} />}
      {newest && <Row left="Latest" right={formatCookingDate(newest.date, dateLong)} />}
      <div aria-hidden className="my-3 border-t-2 border-double border-[#1C1917]" />
      <p className="text-center font-bold tracking-[0.15em]">Thank you — come hungry</p>
      <div
        aria-hidden
        className="mx-auto mt-5 h-10 w-4/5"
        style={{
          background:
            'repeating-linear-gradient(90deg, #1C1917 0 2px, transparent 2px 4px, #1C1917 4px 5px, transparent 5px 8px, #1C1917 8px 11px, transparent 11px 13px)',
        }}
      />
    </div>
  );
}
