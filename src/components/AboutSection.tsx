import { FadeIn } from './FadeIn';
import { SectionWrapper } from './SectionWrapper';

interface AboutSectionProps {
  aboutHtml: string;
}

export function AboutSection({ aboutHtml }: AboutSectionProps) {
  return (
    <SectionWrapper id="about">
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
                <span className="text-primary font-mono text-2xl">01.</span> About Me
            </h2>
            <div className="w-full h-px bg-border"></div>
        </div>
        <div 
          className="prose prose-lg max-w-none text-muted-foreground prose-p:mb-4 prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
      </FadeIn>
    </SectionWrapper>
  );
}
