'use client';

import type { Project } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Folder, Github } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-md bg-card p-6 transition-all hover:-translate-y-2 hover:shadow-xl">
      <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
        <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
                <Folder className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 z-10">
                {project.github && (
                <Button variant="ghost" size="icon" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub link" onClick={(e) => e.stopPropagation()}>
                        <Github className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    </a>
                </Button>
                )}
                {project.link && (
                    <Button variant="ghost" size="icon" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="External project link" onClick={(e) => e.stopPropagation()}>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    </a>
                    </Button>
                )}
            </div>
        </div>
        <h3 className="font-headline text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">
            {project.title}
        </h3>
      </Link>
        <p className="mt-3 flex-grow text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs font-mono">{tag}</Badge>
            ))}
        </div>
    </div>
  );
}
