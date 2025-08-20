import Image from 'next/image';
import type { Project } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Folder, Github } from 'lucide-react';
import { ProjectEnhancer } from './ProjectEnhancer';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="group">
      <div className="flex h-full flex-col overflow-hidden rounded-md bg-card p-6 transition-all hover:-translate-y-2 hover:shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <Folder className="h-8 w-8 text-primary" />
          <div className="flex items-center gap-2">
            {project.github && (
              <Button variant="ghost" size="icon" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </a>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="View Project">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            </Button>
          </div>
        </div>
        <h3 className="font-headline text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">{project.title}</h3>
        <p className="mt-3 flex-grow text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
        <div className="mt-4">
            <ProjectEnhancer project={project} />
        </div>
      </div>
    </a>
  );
}
