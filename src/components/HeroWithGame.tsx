'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FadeIn } from './FadeIn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Gamepad2, X } from 'lucide-react';
import { SnakeGame } from './SnakeGame';
import { useHeroMode } from './HeroMode';

type Props = {
  name: string;
  title: string;
  subtitle: string;
  email: string;
};

export function HeroWithGame({ name, title, subtitle, email }: Props) {
  const [gameOpen, setGameOpen] = useState(false);
  const mode = useHeroMode();

  return (
    <>
      {/* Wide screens: Skill·Boy sits in the hero's right half. Narrower: the Play button opens it as an overlay. */}
      <SectionWrapper
        id="hero"
        className="flex min-h-[60vh] flex-col justify-center py-12 md:py-0 xl:-mr-16 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-12 2xl:-mr-32"
      >
        <FadeIn>
          <p className="mb-4 font-mono text-primary">Hi, my name is</p>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {name}.
          </h1>
          <h2 className="mt-2 font-headline text-3xl font-bold tracking-tight text-muted-foreground sm:text-5xl lg:text-6xl xl:text-[2.6rem] 2xl:text-6xl">
            {title}.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <a href={`mailto:${email}`}>Get In Touch</a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" variant="outline">
                  Download CV
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <a href="/OdaiDahi-CV-En.pdf" download="OdaiDahi-CV-En.pdf" className="cursor-pointer">
                    English (EN)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/OdaiDahi-CV-Sv.pdf" download="OdaiDahi-CV-Sv.pdf" className="cursor-pointer">
                    Swedish (SV)
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="lg"
              variant={gameOpen ? 'destructive' : 'outline'}
              onClick={() => setGameOpen(v => !v)}
              className="xl:hidden"
            >
              {gameOpen ? (
                <><X className="mr-2 h-4 w-4" /> Stop</>
              ) : (
                <><Gamepad2 className="mr-2 h-4 w-4" /> Play</>
              )}
            </Button>
          </div>
        </FadeIn>

        {/* Powered off while 3D mode runs its own snake over the hero */}
        {mode === '2d' && (
          <FadeIn className="hidden xl:block">
            <div className="w-[320px] rotate-[4deg] 2xl:w-[380px] drop-shadow-[0_30px_60px_rgba(0,153,255,0.18)] transition-transform duration-500 focus-within:rotate-0 hover:rotate-0">
              <SnakeGame />
            </div>
          </FadeIn>
        )}
      </SectionWrapper>

      {/* Game — fixed overlay, touches nothing in the layout.
          Mobile: centered near the top, capped to the viewport; desktop: top-right. */}
      {gameOpen && (
        <div className="fixed z-50 flex max-h-[92svh] w-[min(94vw,26rem)] flex-col items-center gap-3 overflow-auto rounded-xl border border-border bg-background p-3 shadow-2xl animate-in fade-in duration-300 left-1/2 top-4 -translate-x-1/2 lg:left-auto lg:right-6 lg:top-6 lg:w-auto lg:translate-x-0 lg:p-4 lg:slide-in-from-right-8">
          <SnakeGame onClose={() => setGameOpen(false)} />
        </div>
      )}
    </>
  );
}
