'use client';

import { useState } from 'react';
import type { PortfolioData } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ProjectCard } from './ProjectCard';
import { FadeIn } from './FadeIn';

type ProjectsSectionProps = Pick<PortfolioData, 'projects'>;

const INITIAL_COUNT = 6;

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? projects : projects.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;

  return (
    <SectionWrapper id="projects">
        <FadeIn>
            <div className="flex items-center gap-4 mb-12">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
                    <span className="text-primary font-mono text-2xl">03.</span> Some Things I've Built
                </h2>
                <div className="w-full h-px bg-border"></div>
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
                        {showAll ? 'Show Less' : `Show More (${projects.length - INITIAL_COUNT} more)`}
                    </button>
                </div>
            )}
        </FadeIn>
    </SectionWrapper>
  );
}
