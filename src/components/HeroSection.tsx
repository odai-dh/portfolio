import type { PortfolioData } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FadeIn } from './FadeIn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

type HeroSectionProps = Pick<PortfolioData, 'name' | 'title' | 'subtitle' | 'email'>;

export function HeroSection({ name, title, subtitle, email }: HeroSectionProps) {
  return (
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
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
