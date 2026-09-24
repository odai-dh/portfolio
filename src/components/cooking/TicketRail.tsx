import Image from 'next/image';
import Link from 'next/link';
import { CookingGlyph, GLYPH_NAMES } from './CookingGlyph';

export type Ticket = {
  slug: string;
  number: number;
  title: string;
  caption: string;
  dateLabel: string;
  heroPhoto: string;
};

// Tickets never hang perfectly straight
const TILTS = ['-rotate-[1.5deg]', 'rotate-1', '-rotate-[0.5deg]', 'rotate-[2deg]'];

export function TicketRail({ label, tickets }: { label: string; tickets: Ticket[] }) {
  return (
    <section className="mb-20">
      <h2 className="mb-3 font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.3em] text-[#B4532A]">
        {label}
      </h2>

      {/* The steel rail */}
      <div
        aria-hidden
        className="h-3 rounded-full border border-[#78716C]/60"
        style={{ background: 'linear-gradient(180deg, #F5F5F4 0%, #A8A29E 55%, #D6D3D1 100%)' }}
      />

      <ul className="-mt-1.5 flex snap-x gap-6 overflow-x-auto px-2 pb-6 pt-1 sm:flex-wrap sm:gap-x-8 sm:gap-y-12 sm:overflow-visible sm:px-6 sm:pb-0">
        {tickets.map((ticket, index) => (
          <li key={ticket.slug} className={`w-[72vw] shrink-0 snap-center sm:w-[230px] ${TILTS[ticket.number % TILTS.length]}`}>
            <Link href={`/cooking/${ticket.slug}`} className="cooking-ticket group block outline-none">
              <span aria-hidden className="relative z-10 mx-auto block h-5 w-12 rounded-sm bg-[#44403C]" />
              <span className="cooking-torn-bottom -mt-2 block bg-[#FFFDF8] px-4 pb-7 pt-5 font-mono text-[11px] uppercase text-[#1C1917] ring-1 ring-inset ring-[#1C1917]/10">
                <span className="flex justify-between">
                  <span className="font-bold">No.{String(ticket.number).padStart(2, '0')}</span>
                  <span className="text-[#78716C]">Table 1</span>
                </span>
                <span aria-hidden className="my-3 block border-t border-dashed border-[#1C1917]/40" />
                <span className="relative block aspect-square overflow-hidden">
                  <Image
                    src={ticket.heroPhoto}
                    alt={ticket.title}
                    fill
                    sizes="(min-width: 640px) 200px, 90vw"
                    className="object-cover grayscale-[35%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </span>
                <span className="mt-4 block font-[family-name:var(--font-fraunces)] text-[20px] normal-case leading-tight group-hover:text-[#B4532A]">
                  {ticket.title}
                </span>
                <span className="mt-1 line-clamp-2 block font-[family-name:var(--font-fraunces)] text-[13px] normal-case italic text-[#78716C]">
                  {ticket.caption}
                </span>
                <span aria-hidden className="my-3 block border-t border-dashed border-[#1C1917]/40" />
                <span className="flex items-center justify-between">
                  <span>{ticket.dateLabel}</span>
                  <CookingGlyph name={GLYPH_NAMES[index % GLYPH_NAMES.length]} className="h-4 w-4 text-[#B4532A]" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
