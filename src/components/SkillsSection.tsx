import type { PortfolioData } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SkillsChart } from '@/components/SkillsChart';
import { FadeIn } from './FadeIn';

type SkillsSectionProps = Pick<PortfolioData, 'skills'>;

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <SectionWrapper id="skills" className="bg-muted/30">
        <FadeIn>
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My Technical Skills</h2>
            <p className="mt-4 text-lg text-muted-foreground">A snapshot of the technologies I work with.</p>
          </div>
          <div className="mt-12">
            <SkillsChart skills={skills} />
          </div>
        </FadeIn>
    </SectionWrapper>
  );
}
