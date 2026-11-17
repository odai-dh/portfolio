import { getPortfolioData } from '@/lib/markdown';
import { OG_SIZE, renderOgCard } from '@/lib/og-card';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Project by Odai Dahi';

export async function generateStaticParams() {
  const { projects } = await getPortfolioData();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { projects } = await getPortfolioData();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return new Response('Not found', { status: 404 });

  return renderOgCard({
    label: 'Project',
    title: project.title,
    description: project.description,
    meta: project.tags.slice(0, 4).join(' · '),
    screenshot: project.image,
  });
}
