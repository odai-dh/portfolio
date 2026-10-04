'use client';

import type { Project } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Folder, Github, Figma } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

// Projects without a real screenshot (Figma-only or private) still point at placehold.co
const hasScreenshot = (image?: string) => Boolean(image && !image.includes('placehold.co'));

const MAX_TAGS = 4;

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 border border-border/50 hover:border-primary/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Link prefetch={false}
        href={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[1200/630] overflow-hidden border-b border-border/50"
      >
        {hasScreenshot(project.image) ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-card to-card">
            <span className="absolute left-3 top-3 rounded border border-primary/40 bg-background/70 px-2 py-0.5 font-mono text-[11px] text-primary">
              {project.figma ? 'Design concept' : 'In development'}
            </span>
            <Folder className={cn(
              "h-12 w-12 text-primary transition-all duration-500",
              isHovered && "scale-110 rotate-12"
            )} />
          </div>
        )}
      </Link>

      <div className="relative z-10 flex flex-grow flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <Link prefetch={false} href={`/projects/${project.slug}`} className="relative after:absolute after:inset-0">
            <h3 className="font-headline text-xl font-bold text-card-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
              {project.title}
            </h3>
          </Link>
          <div className="-mr-2 -mt-1 flex shrink-0 items-center gap-1">
            {project.figma && (
              <Button variant="ghost" size="icon" asChild className="transition-all hover:scale-110 hover:bg-primary/10">
                <a href={project.figma} target="_blank" rel="noopener noreferrer" aria-label="Figma design" onClick={(e) => e.stopPropagation()}>
                  <Figma className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </a>
              </Button>
            )}
            {project.github && project.github !== '#' && (
              <Button variant="ghost" size="icon" asChild className="transition-all hover:scale-110 hover:bg-primary/10">
                <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub link" onClick={(e) => e.stopPropagation()}>
                  <Github className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </a>
              </Button>
            )}
            {project.link && (
              <Button variant="ghost" size="icon" asChild className="transition-all hover:scale-110 hover:bg-primary/10">
                <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="External project link" onClick={(e) => e.stopPropagation()}>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <p className="mt-3 flex-grow text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, MAX_TAGS).map((tag, index) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "text-xs font-mono transition-all duration-300 hover:scale-105 hover:bg-primary/20",
                isHovered && "animate-in fade-in slide-in-from-bottom-2"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards'
              }}
            >
              {tag}
            </Badge>
          ))}
          {project.tags.length > MAX_TAGS && (
            <span className="self-center font-mono text-xs text-muted-foreground">
              +{project.tags.length - MAX_TAGS} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
