import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNotes, formatNoteDate } from '@/lib/notes';
import { NotesTopBar, DraftBadge } from '@/components/NotesChrome';

export const metadata: Metadata = {
  title: 'Notes | Odai Dahi',
  description: 'Short write-ups of problems I ran into while building, and how I solved them.',
  alternates: { canonical: 'https://www.odaidh.dev/notes' },
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <>
      <NotesTopBar />
      <main className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">Notes</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Short write-ups of problems I ran into while building, how I tracked them down, and what I changed.
        </p>

        {notes.length === 0 ? (
          <p className="mt-16 font-mono text-sm text-muted-foreground">First note coming soon.</p>
        ) : (
          <ul className="mt-14 divide-y divide-border/60 border-y border-border/60">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link prefetch={false} href={`/notes/${note.slug}`} className="group block py-7">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                    <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{note.readingMinutes} min read</span>
                    {note.draft && <DraftBadge />}
                  </div>
                  <h2 className="mt-2 font-headline text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {note.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{note.summary}</p>
                  {note.tags.length > 0 && (
                    <p className="mt-3 font-mono text-xs text-primary">{note.tags.join(' · ')}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
