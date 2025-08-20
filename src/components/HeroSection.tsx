import type { PortfolioData } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FadeIn } from './FadeIn';

type HeroSectionProps = Pick<PortfolioData, 'name' | 'title' | 'subtitle' | 'aboutHtml'>;

export function HeroSection({ name, title, subtitle, aboutHtml }: HeroSectionProps) {
  return (
    <SectionWrapper id="hero" className="pt-24 md:pt-32">
      <div className="text-center">
        <FadeIn>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </FadeIn>
        <FadeIn delay="duration-700">
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
        </FadeIn>
        <FadeIn delay="duration-1000">
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild>
              <a href="#projects">View My Work</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#contact">Get in Touch</a>
            </Button>
          </div>
        </FadeIn>
      </div>

      <FadeIn className="mt-16 md:mt-24">
        <div 
          className="prose prose-lg mx-auto max-w-2xl text-center text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
      </FadeIn>
    </SectionWrapper>
  );
}
