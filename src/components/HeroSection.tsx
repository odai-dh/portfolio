import type { PortfolioData } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FadeIn } from './FadeIn';

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
        <div className="mt-10">
          <Button asChild size="lg">
            <a href={`mailto:${email}`}>Get In Touch</a>
          </Button>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
