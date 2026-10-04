'use client';

import { useState } from 'react';
import type { PortfolioData } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ProjectCard } from './ProjectCard';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { FadeIn } from './FadeIn';

type ProjectsSectionProps = Pick<PortfolioData, 'projects'>;

const FEATURED_COUNT = 2; // newest, strongest work gets the wide cards
const INITIAL_COUNT = 3; // regular cards shown before "Show More"

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const featured = projects.slice(0, FEATURED_COUNT);
  const rest = projects.slice(FEATURED_COUNT);
  const visible = showAll ? rest : rest.slice(0, INITIAL_COUNT);
  const hasMore = rest.length > INITIAL_COUNT;

  return (
    <SectionWrapper id="projects">
        <FadeIn>
            <div className="flex items-center gap-4 mb-12">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
                    <span className="text-primary font-mono text-2xl">03.</span> Some Things I've Built
                </h2>
                <div className="w-full h-px bg-border"></div>
            </div>
            <div className="mb-4 grid gap-4 md:grid-cols-2">
                {featured.map(project => (
                <FeaturedProjectCard key={project.slug} project={project} />
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((project, index) => (
                <ProjectCard key={index} project={project} />
                ))}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => setShowAll(prev => !prev)}
                        className="font-mono text-sm text-primary border border-primary rounded px-6 py-3 hover:bg-primary/10 transition-colors"
                    >
                        {showAll ? 'Show Less' : `Show More (${rest.length - INITIAL_COUNT} more)`}
                    </button>
                </div>
            )}
        </FadeIn>
    </SectionWrapper>
  );
}
