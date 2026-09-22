import Image from 'next/image';
import Link from 'next/link';
import type { CookingEntry } from '@/lib/cooking';
import { formatCookingDate } from '@/lib/cooking';

export function EntryCard({ entry }: { entry: CookingEntry }) {
  return (
    <Link href={`/cooking/${entry.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
        <Image
          src={entry.heroPhoto}
          alt={entry.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-[family-name:var(--font-fraunces)] text-[18px] text-[#1C1917]">
          {entry.title}
        </h3>
        <span className="shrink-0 pt-1 font-[family-name:var(--font-manrope)] text-[11px] text-[#78716C]">
          {formatCookingDate(entry.date)}
        </span>
      </div>
      <p className="mt-1 truncate font-[family-name:var(--font-manrope)] text-sm text-[#78716C]">
        {entry.caption}
      </p>
    </Link>
  );
}
