'use client';

import type { Experience } from '@/lib/markdown';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FadeIn } from './FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState, useRef } from 'react';
import { Link, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    if (!experiences.length) return;

    const updateHeight = () => {
      let maxHeight = 0;
      contentRefs.current.forEach((element) => {
        const height = element.scrollHeight;
        maxHeight = Math.max(maxHeight, height);
      });

      maxHeight += 10;

      setContainerStyle({
        height: `${maxHeight}px`,
        position: 'relative',
        overflow: 'hidden'
      });
    };

    const timer = setTimeout(updateHeight, 50);
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
          value={activeTab}
          className="flex flex-col md:flex-row gap-8"
          onValueChange={setActiveTab}
        >
          <TabsList className="flex flex-row md:flex-col h-auto md:h-full justify-start bg-transparent p-0 gap-0">
            {experiences.map((exp) => (
              <TabsTrigger
                key={exp.company}
                value={exp.company}
                onMouseEnter={() => setActiveTab(exp.company)}
                className={cn(
                  "w-full justify-start transition-all duration-300 group relative",
                  "rounded-none border-b-2 md:border-b-0 md:border-l-2 px-4 py-3",
                  // Active state
                  activeTab === exp.company && "border-primary bg-secondary/50 text-primary",
                  // Default state
                  activeTab !== exp.company && "border-border text-muted-foreground hover:border-primary/50 hover:bg-secondary/20 hover:text-foreground"
                )}
              >
                {/* Animated background indicator */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity duration-300",
                  activeTab === exp.company && "opacity-100"
                )} />
                
                <div className="relative z-10 flex items-center gap-2">
                  <Briefcase className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    activeTab === exp.company && "scale-110"
                  )} />
                  <span className="font-medium">{exp.company}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-grow" style={containerStyle} ref={containerRef}>
            {experiences.map((exp) => (
              <TabsContent
                key={exp.company}
                value={exp.company}
                className={cn(
                  "mt-0 w-full absolute top-0 left-0 transition-all duration-500",
                  "opacity-0 translate-x-4",
                  activeTab === exp.company && "opacity-100 translate-x-0 z-10 pointer-events-auto",
                  activeTab !== exp.company && "pointer-events-none"
                )}
                forceMount
                ref={(el) => {
                  if (el) contentRefs.current.set(exp.company, el);
                }}
              >
                <div className="space-y-4">
                  {/* Header with border accent */}
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {exp.title}{' '}
                      <span className="text-primary">
                        @ {exp.link ? (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center group/link"
                          >
                            {exp.company}
                            <Link className="ml-1 h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                          </a>
                        ) : (
                          exp.company
                        )}
                      </span>
                    </h3>
                    <p className="mt-1 font-mono text-sm text-muted-foreground">{exp.date}</p>
                  </div>

                  {/* Duties with staggered animation */}
                  <ul className="space-y-3">
                    {exp.duties.map((duty, i) => (
                      <li 
                        key={i} 
                        className="flex gap-3 text-muted-foreground group/duty animate-in fade-in slide-in-from-left duration-500"
                        style={{ 
                          animationDelay: `${i * 100}ms`,
                          animationFillMode: 'backwards' 
                        }}
                      >
                        <span className="text-primary mt-1 transition-transform group-hover/duty:scale-125 group-hover/duty:translate-x-1">
                          ▹
                        </span>
                        <span className="flex-1 transition-colors group-hover/duty:text-foreground">
                          {duty}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </FadeIn>
    </SectionWrapper>
  );
}