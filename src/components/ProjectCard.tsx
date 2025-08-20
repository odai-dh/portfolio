import Image from 'next/image';
import type { Project } from '@/lib/markdown';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { ProjectEnhancer } from './ProjectEnhancer';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
      <CardHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
           <Image 
            src={project.image} 
            alt={project.title} 
            fill 
            className="object-cover" 
            data-ai-hint={project['data-ai-hint']}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <CardDescription className="mt-4">{project.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-2">
        <Button variant="ghost" asChild>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            View Project <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <ProjectEnhancer project={project} />
      </CardFooter>
    </Card>
  );
}
