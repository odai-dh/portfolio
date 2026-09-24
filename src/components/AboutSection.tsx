'use client';

import { FadeIn } from './FadeIn';
import { SectionWrapper } from './SectionWrapper';
import { useEffect, useRef } from 'react';

interface AboutSectionProps {
  aboutHtml: string;
  tiktokUrl?: string;
}

export function AboutSection({ aboutHtml, tiktokUrl }: AboutSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the lemon emoji in the rendered HTML
    if (!contentRef.current || !tiktokUrl) return;

    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent || '';
      // Already linked (effects can run twice in dev) — don't wrap it again
      if (node.parentElement?.closest('.lemon-link')) break;
      if (text.includes('🍋')) {
        const parent = node.parentElement;
        if (parent) {
          // Replace the lemon emoji with a clickable link
          const newHTML = text.replace(
            '🍋',
            `<a href="${tiktokUrl}" target="_blank" rel="noopener noreferrer" class="lemon-link" title="Watch me cook on TikTok">🍋</a>`
          );
          parent.innerHTML = parent.innerHTML.replace(text, newHTML);
        }
        break;
      }
    }
  }, [aboutHtml, tiktokUrl]);

  return (
    <SectionWrapper id="about">
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
            <span className="text-primary font-mono text-2xl">01.</span> About Me
          </h2>
          <div className="w-full h-px bg-border"></div>
        </div>
        <div 
          ref={contentRef}
          className="text-lg leading-relaxed text-muted-foreground [&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_a:not(.lemon-link)]:text-foreground [&_a:not(.lemon-link)]:underline [&_a:not(.lemon-link)]:decoration-primary [&_a:not(.lemon-link)]:underline-offset-4 [&_a:not(.lemon-link):hover]:text-primary
          [&_.lemon-link]:inline-block 
          [&_.lemon-link]:text-2xl 
          [&_.lemon-link]:transition-all 
          [&_.lemon-link]:duration-300 
          [&_.lemon-link]:cursor-pointer
          [&_.lemon-link]:no-underline
          [&_.lemon-link:hover]:scale-125 
          [&_.lemon-link:hover]:rotate-12
          [&_.lemon-link:active]:scale-110
          [&_.lemon-link:active]:rotate-6"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
      </FadeIn>
    </SectionWrapper>
  );
}