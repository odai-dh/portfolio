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
          className="prose prose-lg max-w-none text-muted-foreground prose-p:mb-4 prose-strong:text-foreground
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