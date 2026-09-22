import type { CookingEntry } from '@/lib/cooking';
import { EntryCard } from './EntryCard';

export function EntryGrid({ entries }: { entries: CookingEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-12">
      {entries.map((entry) => (
        <EntryCard key={entry.slug} entry={entry} />
      ))}
    </div>
  );
}
