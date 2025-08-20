import type { PortfolioData } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ProjectCard } from './ProjectCard';
import { FadeIn } from './FadeIn';

type ProjectsSectionProps = Pick<PortfolioData, 'projects'>;

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <SectionWrapper id="projects">
        <FadeIn>
            <div className="flex items-center gap-4 mb-12">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
                    <span className="text-primary font-mono text-2xl">03.</span> Some Things I’ve Built
                </h2>
                <div className="w-full h-px bg-border"></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
                ))}
            </div>
        </FadeIn>
    </SectionWrapper>
  );
}
