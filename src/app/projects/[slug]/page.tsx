import { getProjectBySlug, getPortfolioData } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { ProjectContentCards } from '@/components/ProjectContentCards';
import { WebsitePreview } from '@/components/WebsitePreview';

type ProjectPageParams = {
  params: {
    slug: string;
  };
};

export default async function ProjectPage({ params }: ProjectPageParams) {
  // Await the params object before using it
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  // Use the resolved slug
  const project = await getProjectBySlug(slug);
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
                {project.github && project.github !== '#' && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.figma && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.figma} target="_blank" rel="noopener noreferrer">
                      <ArrowUpRight className="mr-2" />
                      Figma Design
                    </a>
                  </Button>
                )}
                {project.link && project.link !== '#' && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ArrowUpRight className="mr-2" />
                      {project.figma ? 'Live Prototype' : 'Live Demo'}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* Replace the Image component with WebsitePreview */}
           {project.figma && project.link && project.link.includes('figma.com/proto') ? (
            <div className="mb-8">
              <div className="rounded-lg border bg-muted/50 p-6 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  Interactive Figma Prototype - Click to view and interact
                </p>
                <Button asChild size="lg">
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ArrowUpRight className="mr-2" />
                    Open Figma Prototype
                  </a>
                </Button>
              </div>
            </div>
          ) : project.link ? (
            <WebsitePreview 
              url={project.link} 
              title={project.title} 
              imageUrl={project.image || "https://placehold.co/1200x630.png"} 
            />
          ) : project.image ? (
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
          ) : null}
          <ProjectContentCards contentHtml={project.contentHtml} />
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

export async function generateMetadata({ params }: ProjectPageParams) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Odai Dahi`,
    description: project.description || `${project.title} - A project by Odai Dahi`,
    openGraph: {
      title: `${project.title} | Odai Dahi Portfolio`,
      description: project.description || `${project.title} - A project by Odai Dahi`,
      images: project.image ? [project.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Odai Dahi`,
      description: project.description || `${project.title} - A project by Odai Dahi`,
      images: project.image ? [project.image] : [],
    },
  };
}