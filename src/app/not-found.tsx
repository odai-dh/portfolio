import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-border bg-secondary/20 p-6 shadow-2xl">
        {/* Skill·Boy shell header */}
        <div className="mb-4 flex w-full items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 opacity-80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 opacity-80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400 opacity-80" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Skill·Boy
          </span>
          <div className="w-12" />
        </div>

        {/* screen — fixed dark like the game's LCD, theme-independent */}
        <div className="w-full rounded-lg border-2 border-border bg-[#0d0d1a] p-6 text-center shadow-inner">
          <h1 className="font-mono text-5xl font-bold tracking-widest text-[#3B82F6]">
            404<span className="sr-only">: page not found</span>
          </h1>
          <p className="mt-3 font-mono text-lg font-bold uppercase tracking-[0.3em] text-red-400">
            Game Over
          </p>
          <p className="mt-4 font-mono text-xs leading-relaxed text-slate-400">
            The snake ate this page.
            <br />
            Level not found.
          </p>
          <p className="mt-5 animate-pulse font-mono text-xs tracking-widest text-slate-400">
            ▸ PRESS CONTINUE
          </p>
        </div>

        <Button asChild size="lg" className="mt-6 w-full font-mono">
          <Link prefetch={false} href="/">▶ CONTINUE — BACK HOME</Link>
        </Button>
      </div>
    </main>
  );
}
