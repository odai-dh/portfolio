'use client';

import type { Experience } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FadeIn } from './FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'lucide-react';

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<string>(experiences[0]?.company || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({});

  // Update container height when tab changes
  useEffect(() => {
    // Skip if no experiences
    if (!experiences.length) return;

    // Get all content heights after render
    const updateHeight = () => {
      // Find max height of all tabs
      let maxHeight = 0;
      contentRefs.current.forEach((element) => {
        const height = element.scrollHeight;
        maxHeight = Math.max(maxHeight, height);
      });

      // Add a small buffer to prevent scrollbars
      maxHeight += 10;

      // Set container style with fixed height
      setContainerStyle({
        height: `${maxHeight}px`,
        position: 'relative',
        overflow: 'hidden'
      });
    };

    // Wait a bit for rendering to complete
    const timer = setTimeout(updateHeight, 50);

    // Also handle window resize
    window.addEventListener('resize', updateHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateHeight);
    };
  }, [experiences, activeTab]);

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <SectionWrapper id="experience">
      <FadeIn>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
            <span className="text-primary font-mono text-2xl">02.</span> Where I've Worked
          </h2>
          <div className="w-full h-px bg-border"></div>
        </div>

        <Tabs
          defaultValue={experiences[0].company}
          className="flex flex-col md:flex-row gap-8"
          onValueChange={(value) => setActiveTab(value)}
        >
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

          <div className="flex-grow" style={containerStyle} ref={containerRef}>
            {experiences.map((exp) => (
              <TabsContent
                key={exp.company}
                value={exp.company}
                className="mt-0 w-full absolute top-0 left-0 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300 data-[state=active]:z-10 pointer-events-none data-[state=active]:pointer-events-auto"
                forceMount
                ref={(el) => {
                  if (el) contentRefs.current.set(exp.company, el);
                }}
              >
                <h3 className="text-xl font-bold text-foreground">
                  {exp.title}{' '}
                  <span className="text-primary">
                    @ {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center"
                      >
                        {exp.company}
                          <Link className="ml-1 h-3 w-3" />
                      </a>
                    ) : (
                      exp.company
                    )}
                  </span>
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