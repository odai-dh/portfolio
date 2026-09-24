import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CookingTopBar } from '@/components/cooking/CookingTopBar';
import { CookingGlyph, GLYPH_NAMES } from '@/components/cooking/CookingGlyph';
import { ImageMagnifier } from '@/components/cooking/ImageMagnifier';
import {
  getAllCookingEntries,
  getAdjacentCookingEntries,
  getCookingEntryBySlug,
  getImageDimensions,
  formatCookingDate,
  type CookingEntry,
} from '@/lib/cooking';

export function generateStaticParams() {
  return getAllCookingEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCookingEntryBySlug(slug);
  if (!entry) return {};

  return {
    title: `${entry.title} — Odai cooks`,
    description: entry.caption,
  };
}

const Rule = () => <div aria-hidden className="my-5 border-t border-dashed border-[#1C1917]/40" />;

function orderNumber(entries: CookingEntry[], slug: string) {
  return String(entries.length - entries.findIndex((entry) => entry.slug === slug)).padStart(2, '0');
}

function Neighbour({ entry, number, direction }: { entry: CookingEntry; number: string; direction: 'prev' | 'next' }) {
  const isNext = direction === 'next';
  return (
    <Link
      href={`/cooking/${entry.slug}`}
      className={`group flex items-center gap-4 ${isNext ? 'flex-row-reverse text-right' : ''}`}
    >
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full outline outline-1 outline-offset-4 outline-[#1C1917]/30 transition-[outline-color] group-hover:outline-[#B4532A]">
        <Image src={entry.heroPhoto} alt="" fill sizes="64px" className="object-cover" />
      </span>
      <span>
        <span className="block font-mono text-[11px] uppercase text-[#78716C]">
          {isNext ? 'Next order' : 'Previous order'} · No.{number}
        </span>
        <span className="block font-[family-name:var(--font-fraunces)] text-[20px] text-[#1C1917] group-hover:text-[#B4532A]">
          {isNext ? `${entry.title} →` : `← ${entry.title}`}
        </span>
      </span>
    </Link>
  );
}

export default async function CookingEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCookingEntryBySlug(slug);
  if (!entry) notFound();

  const allEntries = getAllCookingEntries();
  const number = orderNumber(allEntries, slug);
  const { prev, next } = getAdjacentCookingEntries(slug);
  const heroDimensions = getImageDimensions(entry.heroPhoto);
  const glyph = GLYPH_NAMES[Number(number) % GLYPH_NAMES.length];

  return (
    <>
      <CookingTopBar aboutHref="/cooking#about" />

      <main className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-12 md:grid-cols-[1.1fr_1fr] md:px-10 md:py-20">
        {/* The photo, taped to the page */}
        <div className="flex justify-center">
          <div className="relative bg-[#FFFDF8] p-3 ring-1 [@media(hover:hover)]:pb-12 ring-[#1C1917]/10">
            <span aria-hidden className="absolute -top-3 left-6 z-10 h-7 w-24 -rotate-6 bg-[#E9DFC9]/85" />
            <span aria-hidden className="absolute -top-3 right-6 z-10 h-7 w-24 rotate-[5deg] bg-[#E9DFC9]/85" />
            <ImageMagnifier
              src={entry.heroPhoto}
              alt={entry.title}
              width={heroDimensions.width}
              height={heroDimensions.height}
              priority
            />
            <p className="absolute bottom-3 left-0 right-0 hidden text-center [@media(hover:hover)]:block font-[family-name:var(--font-fraunces)] text-[15px] italic text-[#78716C]">
              Hover to look closer
            </p>
          </div>
        </div>

        {/* The order ticket */}
        <div className="relative">
          <div className="cooking-torn-bottom bg-[#FFFDF8] px-8 pb-12 pt-8 font-mono text-[12px] uppercase text-[#1C1917] ring-1 ring-inset ring-[#1C1917]/10 md:px-10">
            <div className="flex justify-between">
              <span className="font-bold">Order No.{number}</span>
              <span className="text-[#78716C]">Table 1</span>
            </div>
            <div className="mt-1 text-[#78716C]">
              {formatCookingDate(entry.date, { year: 'numeric' })} · Stockholm
            </div>
            <Rule />
            <h1 className="cooking-display font-[family-name:var(--font-fraunces)] text-[40px] normal-case leading-[1.05] lg:text-[54px]">
              {entry.title}
            </h1>
            <p className="mt-4 font-[family-name:var(--font-fraunces)] text-[20px] normal-case italic leading-[1.6] text-[#44403C]">
              {entry.caption}
            </p>

            {entry.content.trim().length > 0 && (
              <>
                <Rule />
                <div className="cooking-prose font-[family-name:var(--font-manrope)] text-[15px] normal-case text-[#1C1917] [&_a]:underline [&_a]:decoration-[#B4532A] [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:text-2xl [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_p]:leading-[1.8] [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6">
                  <MDXRemote source={entry.content} />
                </div>
              </>
            )}

            <Rule />
            <div className="flex justify-between">
              <span>1 × {entry.title}</span>
              <span>Served</span>
            </div>
            <div className="flex justify-between">
              <span>Chef</span>
              <span>Odai</span>
            </div>
            <div className="flex justify-between">
              <span>Time to plate wreck</span>
              <span>~90 sec</span>
            </div>
            <div aria-hidden className="my-5 border-t-2 border-double border-[#1C1917]" />
            <div className="flex items-center justify-center gap-3 font-bold tracking-[0.15em]">
              <CookingGlyph name={glyph} className="h-5 w-5 text-[#B4532A]" />
              Thank you — come hungry
              <CookingGlyph name={glyph} className="h-5 w-5 text-[#B4532A]" />
            </div>
          </div>

          {/* Rubber stamp */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 right-3 rotate-[-14deg] rounded-md border-[3px] border-[#B4532A] px-3 py-1 font-mono text-[20px] md:-right-6 md:top-20 md:px-4 md:text-[26px] font-bold tracking-[0.25em] text-[#B4532A] opacity-80 mix-blend-multiply md:-right-6"
          >
            EATEN
          </div>
        </div>
      </main>

      {entry.photos.length > 0 && (
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-8 px-6 pb-16 md:px-10">
          {entry.photos.map((photo) => {
            const dimensions = getImageDimensions(photo);
            return (
              <ImageMagnifier
                key={photo}
                src={photo}
                alt={entry.title}
                width={dimensions.width}
                height={dimensions.height}
              />
            );
          })}
        </div>
      )}

      <nav className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-[#1C1917]/15 px-6 py-14 sm:flex-row sm:items-center sm:justify-between md:px-10">
        {/* Entries are sorted newest first, so the library's `next` is the older dish */}
        {next ? <Neighbour entry={next} number={orderNumber(allEntries, next.slug)} direction="prev" /> : <span />}
        {prev ? <Neighbour entry={prev} number={orderNumber(allEntries, prev.slug)} direction="next" /> : <span />}
      </nav>
    </>
  );
}
