import type { Skill } from '@/lib/markdown';
import { SectionWrapper } from './SectionWrapper';
import { FadeIn } from './FadeIn';

const CATEGORIES = [
  { key: 'frontend', label: 'Frontend', tag: 'FE' },
  { key: 'backend', label: 'Backend', tag: 'BE' },
  { key: 'tools', label: 'Tools & More', tag: 'TL' },
] as const;

export function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <SectionWrapper id="skills">
      <FadeIn>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
            <span className="text-primary font-mono text-2xl">04.</span> Skills
          </h2>
          <div className="w-full h-px bg-border"></div>
        </div>

        <div className="space-y-10">
          {CATEGORIES.map((cat) => {
            const items = skills.filter((s) => s.category === cat.key);
            if (!items.length) return null;
            return (
              <div key={cat.key}>
                <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">
                  <span className="text-primary">▸</span> {cat.label}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((skill, i) => (
                    <div
                      key={skill.name}
                      className="group relative rounded-lg border border-border bg-secondary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.35)]"
                      style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
                    >
                      {/* cartridge grip ridges */}
                      <div className="h-2.5 rounded-t-lg border-b border-border/60 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,hsl(var(--border))_6px,hsl(var(--border))_8px)] opacity-70" />
                      {/* label plate */}
                      <div className="px-3 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                            {skill.name}
                          </span>
                          <span className="shrink-0 rounded-sm border border-primary/40 px-1 py-0.5 font-mono text-[9px] leading-none text-primary/80">
                            {cat.tag}
                          </span>
                        </div>
                      </div>
                      {/* cartridge notch */}
                      <div className="absolute -bottom-px left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-sm bg-border/70" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 font-mono text-xs text-muted-foreground">
          <span className="text-primary">▸ INSERT CARTRIDGE:</span> press{' '}
          <span className="text-foreground">Play</span> in the hero to collect these in
          Skill·Boy and earn your developer title.
        </p>
      </FadeIn>
    </SectionWrapper>
  );
}
