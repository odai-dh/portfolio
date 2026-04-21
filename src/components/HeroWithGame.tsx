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

type Props = {
  name: string;
  title: string;
  subtitle: string;
  email: string;
};

export function HeroWithGame({ name, title, subtitle, email }: Props) {
  const [gameOpen, setGameOpen] = useState(false);

  return (
    <>
      {/* Hero — layout completely unchanged */}
      <SectionWrapper id="hero" className="flex min-h-[60vh] flex-col justify-center py-12 md:py-0">
        <FadeIn>
          <p className="mb-4 font-mono text-primary">Hi, my name is</p>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {name}.
          </h1>
          <h2 className="mt-2 font-headline text-3xl font-bold tracking-tight text-muted-foreground sm:text-5xl lg:text-6xl">
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
              className="hidden lg:inline-flex"
            >
              {gameOpen ? (
                <><X className="mr-2 h-4 w-4" /> Stop</>
              ) : (
                <><Gamepad2 className="mr-2 h-4 w-4" /> Play</>
              )}
            </Button>
          </div>
        </FadeIn>
      </SectionWrapper>

      {/* Game — fixed overlay, touches nothing in the layout */}
      {gameOpen && (
        <div className="fixed top-6 right-6 z-50 hidden lg:flex flex-col items-center gap-3 bg-background border border-border rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-300">
          <SnakeGame />
        </div>
      )}
    </>
  );
}
