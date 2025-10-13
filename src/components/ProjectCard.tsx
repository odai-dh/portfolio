'use client';

import type { Project } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Folder, Github, Figma } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-card p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 border border-border/50 hover:border-primary/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <Link href={`/projects/${project.slug}`} className="flex-grow">
          <Folder className={cn(
            "h-10 w-10 text-primary transition-all duration-500",
            isHovered && "scale-110 rotate-12"
          )} />
        </Link>
        <div className="flex items-center gap-1">
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
      
      <Link href={`/projects/${project.slug}`} className="relative z-10 after:absolute after:inset-0">
        <h3 className="font-headline text-xl font-bold text-card-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
          {project.title}
        </h3>
      </Link>
      
      <p className="mt-3 flex-grow text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground relative z-10">
        {project.description}
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2 relative z-10">
        {project.tags.map((tag, index) => (
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
      </div>
    </div>
  );
}