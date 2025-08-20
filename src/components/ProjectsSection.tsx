import type { PortfolioData } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ProjectCard } from './ProjectCard';
import { FadeIn } from './FadeIn';

type ProjectsSectionProps = Pick<PortfolioData, 'projects'>;

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <SectionWrapper id="projects">
        <FadeIn>
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My Projects</h2>
                <p className="mt-4 text-lg text-muted-foreground">A selection of my work. Feel free to explore.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
                {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
                ))}
            </div>
        </FadeIn>
    </SectionWrapper>
  );
}
