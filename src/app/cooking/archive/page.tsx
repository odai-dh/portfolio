import type { Metadata } from 'next';
import { CookingTopBar } from '@/components/cooking/CookingTopBar';
import { CookingFooter } from '@/components/cooking/CookingFooter';
import { EntryGrid } from '@/components/cooking/EntryGrid';
import { getAllCookingEntries } from '@/lib/cooking';

export const metadata: Metadata = {
  title: 'Archive — Odai cooks',
};

export default function CookingArchivePage() {
  const entries = getAllCookingEntries();

  return (
    <>
      <CookingTopBar aboutHref="/cooking#about" />

      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <h1 className="mb-12 font-[family-name:var(--font-fraunces)] text-[32px] text-[#1C1917]">
          Archive
        </h1>
        <EntryGrid entries={entries} />
      </main>

      <CookingFooter />
    </>
  );
}
