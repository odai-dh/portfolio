import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllNotes, getNoteBySlug, formatNoteDate } from '@/lib/notes';
import { NotesTopBar, DraftBadge } from '@/components/NotesChrome';

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};

  const url = `https://www.odaidh.dev/notes/${note.slug}`;
  return {
    title: `${note.title} | Odai Dahi`,
    description: note.summary,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: note.title, description: note.summary, publishedTime: note.date },
    twitter: { card: 'summary_large_image', creator: '@odaidh' },
  };
}

// No typography plugin on this site, so MDX elements get explicit styles
const mdxComponents = {
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="mb-3 mt-10 font-headline text-2xl font-bold text-foreground" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="mb-2 mt-8 font-headline text-xl font-bold text-foreground" {...props} />,
  p: (props: React.ComponentProps<'p'>) => <p className="mb-5 leading-relaxed text-foreground/85" {...props} />,
  ul: (props: React.ComponentProps<'ul'>) => <ul className="mb-5 list-disc space-y-2 pl-6 text-foreground/85" {...props} />,
  ol: (props: React.ComponentProps<'ol'>) => <ol className="mb-5 list-decimal space-y-2 pl-6 text-foreground/85" {...props} />,
  a: (props: React.ComponentProps<'a'>) => <a className="text-primary underline underline-offset-4 hover:opacity-80" {...props} />,
  strong: (props: React.ComponentProps<'strong'>) => <strong className="font-semibold text-foreground" {...props} />,
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote className="mb-5 border-l-2 border-primary/60 pl-4 italic text-muted-foreground" {...props} />
  ),
  code: (props: React.ComponentProps<'code'>) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />,
  pre: (props: React.ComponentProps<'pre'>) => (
    <pre className="mb-5 overflow-x-auto rounded-lg border border-border/60 bg-card p-4 font-mono text-sm [&_code]:bg-transparent [&_code]:p-0" {...props} />
  ),
};

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: note.title,
    description: note.summary,
    datePublished: note.date,
    keywords: note.tags.join(', '),
    author: { '@type': 'Person', name: 'Odai Dahi', url: 'https://www.odaidh.dev' },
    mainEntityOfPage: `https://www.odaidh.dev/notes/${note.slug}`,
  };

  return (
    <>
      <NotesTopBar back={{ href: '/notes', label: 'All notes' }} />
      <main className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <article>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
              <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
              <span aria-hidden>·</span>
              <span>{note.readingMinutes} min read</span>
              {note.draft && <DraftBadge />}
            </div>
            <h1 className="mt-3 font-headline text-3xl font-bold tracking-tight text-foreground md:text-5xl">{note.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{note.summary}</p>
            {note.tags.length > 0 && <p className="mt-4 font-mono text-xs text-primary">{note.tags.join(' · ')}</p>}
          </header>
          <MDXRemote source={note.content} components={mdxComponents} />
        </article>
      </main>
    </>
  );
}
