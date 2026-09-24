import type { Metadata } from 'next';
import { CookingTopBar } from '@/components/cooking/CookingTopBar';
import { CookingFooter } from '@/components/cooking/CookingFooter';
import { CookingGlyph } from '@/components/cooking/CookingGlyph';
import { TicketRail } from '@/components/cooking/TicketRail';
import { getAllCookingEntries, groupByMonth, toCookingTicket } from '@/lib/cooking';

export const metadata: Metadata = {
  title: 'Archive — Odai cooks',
};

export default function CookingArchivePage() {
  const entries = getAllCookingEntries();
  const months = groupByMonth(entries.map((entry, index) => toCookingTicket(entry, index, entries.length)));

  return (
    <>
      <CookingTopBar aboutHref="/cooking#about" />

      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <header className="mb-20 max-w-xl">
          <p className="flex items-center font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.3em] text-[#78716C]">
            The archive
            <CookingGlyph name="knife" className="mx-3 h-5 w-5 text-[#B4532A]" />
            {entries.length} plates
          </p>
          <h1 className="cooking-display mt-4 font-[family-name:var(--font-fraunces)] text-[64px] italic leading-none text-[#1C1917] md:text-[96px]">
            The Pass
          </h1>
          <p className="mt-6 font-[family-name:var(--font-fraunces)] text-[20px] leading-[1.6] text-[#78716C]">
            Every order that ever left this kitchen, clipped to the rail. Newest first, one rail a month.
          </p>
        </header>

        {months.map((month) => (
          <TicketRail key={month.label} label={month.label} tickets={month.items} />
        ))}
      </main>

      <CookingFooter />
    </>
  );
}
