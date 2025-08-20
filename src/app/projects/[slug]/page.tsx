import { getProjectBySlug, getPortfolioData } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

type ProjectPageParams = {
  params: {
    slug: string;
  };
};

export default async function ProjectPage({ params }: ProjectPageParams) {
  const project = await getProjectBySlug(params.slug);
  const portfolioData = await getPortfolioData();

  if (!project) {
    notFound();
  }

  return (
    <>
      <main className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-24">
        <div className="mb-8">
          <Button variant="link" asChild className="pl-0">
            <Link href="/">
              <ArrowLeft className="mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </div>

        <article>
          <header className="mb-8">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-sm font-mono">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {project.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.link && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ArrowUpRight className="mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </header>

          {project.image && (
            <div className="mb-8 overflow-hidden rounded-lg border">
              <Image 
                src={project.image} 
                alt={project.title} 
                width={1200} 
                height={630}
                className="w-full object-cover"
                data-ai-hint="project screenshot"
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none text-muted-foreground prose-p:mb-4 prose-strong:text-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: project.contentHtml }}
          />

        </article>
      </main>
      <Footer name={portfolioData.name} />
    </>
  );
}

// This function is needed for Next.js to know which slugs are available at build time.
export async function generateStaticParams() {
  const portfolioData = await getPortfolioData();
 
  return portfolioData.projects.map((project) => ({
    slug: project.slug,
  }));
}
