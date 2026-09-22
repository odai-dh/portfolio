import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CookingTopBar } from '@/components/cooking/CookingTopBar';
import {
  getAllCookingEntries,
  getAdjacentCookingEntries,
  getCookingEntryBySlug,
  formatCookingDate,
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

export default async function CookingEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCookingEntryBySlug(slug);
  if (!entry) notFound();

  const { prev, next } = getAdjacentCookingEntries(slug);
  const heroAspectClass = entry.heroAspect === '16:9' ? 'aspect-[16/9]' : 'aspect-[4/5]';

  return (
    <>
      <CookingTopBar aboutHref="/cooking#about" />

      <div className="md:grid md:grid-cols-2 md:items-stretch">
        <div className={`relative w-full ${heroAspectClass} md:aspect-auto md:min-h-[70vh]`}>
          <Image
            src={entry.heroPhoto}
            alt={entry.title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <main className="flex flex-col justify-center px-6 py-12 md:px-12 md:py-16 lg:px-20">
          <p className="font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.08em] text-[#78716C]">
            {formatCookingDate(entry.date, { year: 'numeric' })}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-[36px] leading-tight text-[#1C1917] lg:text-[48px]">
            {entry.title}
          </h1>
          <p className="mt-6 max-w-[480px] font-[family-name:var(--font-fraunces)] text-[22px] italic leading-[1.7] text-[#1C1917]">
            {entry.caption}
          </p>

          <hr className="mt-10 w-10 border-t border-[#78716C]" />

          {entry.content.trim().length > 0 && (
            <div
              className="cooking-prose mt-10 max-w-[480px] font-[family-name:var(--font-manrope)] text-[#1C1917] [&_a]:underline [&_a]:decoration-[#B45309] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:text-2xl [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_p]:leading-[1.8] [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6"
            >
              <MDXRemote source={entry.content} />
            </div>
          )}
        </main>
      </div>

      {entry.photos.length > 0 && (
        <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-6 pb-16 md:px-10">
          {entry.photos.map((photo) => (
            <div key={photo} className="relative aspect-[4/5] w-full">
              <Image
                src={photo}
                alt={entry.title}
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <nav className="mx-auto flex max-w-[720px] items-center justify-between px-6 py-16 font-[family-name:var(--font-manrope)] text-sm text-[#1C1917] md:px-10">
        {prev ? (
          <Link href={`/cooking/${prev.slug}`} aria-label="Previous entry" className="hover:text-[#B45309]">
            ←
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/cooking/${next.slug}`} aria-label="Next entry" className="hover:text-[#B45309]">
            →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
