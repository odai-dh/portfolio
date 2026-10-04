'use client';

import type { Project } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MAX_TAGS = 6;

export function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 ">
      <Link
        prefetch={false}
        href={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[1200/630] overflow-hidden border-b border-border/50"
      >
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-grow flex-col p-6">
        <p className="font-mono text-xs text-primary">Featured project</p>
        <div className="mt-2 flex items-start justify-between gap-2">
          <Link prefetch={false} href={`/projects/${project.slug}`} className="relative after:absolute after:inset-0">
            <h3 className="font-headline text-2xl font-bold text-card-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </Link>
          <div className="relative z-10 flex shrink-0 gap-3 pt-1 text-muted-foreground">
            {project.github && project.github !== '#' && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub link" className="hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="External project link" className="hover:text-primary">
                <ArrowUpRight className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
        <p className="mt-3 flex-grow text-sm text-muted-foreground group-hover:text-foreground">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, MAX_TAGS).map(tag => (
            <Badge key={tag} variant="secondary" className="font-mono text-xs">{tag}</Badge>
          ))}
          {project.tags.length > MAX_TAGS && (
            <span className="self-center font-mono text-xs text-muted-foreground">+{project.tags.length - MAX_TAGS} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
