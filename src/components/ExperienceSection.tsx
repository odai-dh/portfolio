'use client';

import type { Experience } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FadeIn } from './FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <SectionWrapper id="experience">
      <FadeIn>
        <div className="flex items-center gap-4 mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
                <span className="text-primary font-mono text-2xl">02.</span> Where I’ve Worked
            </h2>
            <div className="w-full h-px bg-border"></div>
        </div>
        
        <Tabs defaultValue={experiences[0].company} className="flex flex-col md:flex-row gap-8">
          <TabsList className="flex flex-row md:flex-col h-auto md:h-full justify-start bg-transparent p-0">
            {experiences.map((exp) => (
              <TabsTrigger 
                key={exp.company} 
                value={exp.company}
                className="w-full justify-start text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-secondary data-[state=active]:shadow-none rounded-none border-b-2 md:border-b-0 md:border-l-2 border-border data-[state=active]:border-primary px-4 py-3"
              >
                {exp.company}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex-grow">
            {experiences.map((exp) => (
              <TabsContent key={exp.company} value={exp.company} className="mt-0">
                <h3 className="text-xl font-bold text-foreground">
                  {exp.title}{' '}
                  <span className="text-primary">@ {exp.company}</span>
                </h3>
                <p className="mt-1 font-mono text-sm text-muted-foreground">{exp.date}</p>
                <ul className="mt-4 list-disc list-inside space-y-2">
                  {exp.duties.map((duty, i) => (
                    <li key={i} className="text-muted-foreground pl-2 relative before:content-['▹'] before:absolute before:left-0 before:text-primary">
                      {duty}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </FadeIn>
    </SectionWrapper>
  );
}
