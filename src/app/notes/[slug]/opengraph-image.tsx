import { formatNoteDate, getAllNotes, getNoteBySlug } from '@/lib/notes';
import { OG_SIZE, renderOgCard } from '@/lib/og-card';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A note by Odai Dahi';

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return new Response('Not found', { status: 404 });

  return renderOgCard({
    label: 'Note',
    title: note.title,
    description: note.summary,
    meta: `${formatNoteDate(note.date)} · ${note.readingMinutes} min read`,
  });
}
