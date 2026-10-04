import Link from 'next/link';
import { getAllNotes } from '@/lib/notes';

export function Footer({ name }: { name: string }) {
  // Link to Notes only once something is published (drafts don't count in production)
  const hasNotes = getAllNotes().length > 0;

  return (
    <footer className="bg-background py-6">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <p className="text-center text-xs text-muted-foreground">
          Designed & Built by {name}.
        </p>
        {hasNotes && (
          <p className="mt-2 text-center text-xs">
            <Link prefetch={false} href="/notes" className="font-mono text-muted-foreground transition-colors hover:text-primary">
              Notes
            </Link>
          </p>
        )}
      </div>
    </footer>
  );
}
