import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function NotesTopBar({ back = { href: '/', label: 'odaidh.dev' } }: { back?: { href: string; label: string } }) {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 md:px-6">
        <Link prefetch={false} href={back.href} className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {back.label}
        </Link>
        <Link prefetch={false} href="/notes" className="font-headline text-lg font-bold text-foreground">
          Notes
        </Link>
      </div>
    </header>
  );
}

export function DraftBadge() {
  return (
    <span className="rounded border border-amber-500/50 px-2 py-0.5 font-mono text-[11px] text-amber-500">
      Draft · dev only
    </span>
  );
}
