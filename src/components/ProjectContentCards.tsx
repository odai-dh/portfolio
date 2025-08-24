"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function ProjectContentCards({ contentHtml }: { contentHtml: string }) {
  const [sections, setSections] = useState<{title: string, content: string}[]>([]);
  
  useEffect(() => {
    if (!contentHtml) {
      setSections([]);
      return;
    }
    
    try {
      // Parse HTML into sections
      const parser = new DOMParser();
      const doc = parser.parseFromString(contentHtml, 'text/html');
      const headings = doc.querySelectorAll('h3');
      
      const parsedSections: {title: string, content: string}[] = [];
      
      // Handle case where there are no h3 headings
      if (headings.length === 0) {
        parsedSections.push({
          title: "Project Details",
          content: contentHtml
        });
      } else {
        // Process each heading and its content
        headings.forEach((heading, index) => {
          let content = '';
          let el = heading.nextElementSibling;
          
          // Collect all elements until the next heading or end
          while (el && el.tagName !== 'H3') {
            content += el.outerHTML;
            el = el.nextElementSibling;
          }
          
          // Clean and enhance content
          // For list items, add special styling
          content = content.replace(/<li>/g, '<li class="py-1">');
          // For strong/bold text, add primary color
          content = content.replace(/<strong>/g, '<strong class="text-primary">');
          
          parsedSections.push({
            title: heading.textContent?.trim() || `Section ${index + 1}`,
            content: content
          });
        });
      }
      
      setSections(parsedSections);
    } catch (error) {
      console.error("Error parsing HTML content:", error);
      // Fallback for parsing errors
      setSections([{
        title: "Project Details",
        content: contentHtml
      }]);
    }
  }, [contentHtml]);
  
  if (sections.length === 0) {
    return <div className="text-muted-foreground">No content available</div>;
  }
  
  return (
    <div className="grid grid-cols-1 gap-6">
      {sections.map((section, i) => (
        <Card key={i} className="overflow-hidden border border-border/50">
          <CardHeader className="bg-secondary/30 pb-3">
            <CardTitle className="text-xl text-primary">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-primary">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}