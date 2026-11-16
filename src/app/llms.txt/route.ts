import { getPortfolioData } from '@/lib/markdown';
import { getAllNotes } from '@/lib/notes';
import { buildLlmsTxt } from '@/lib/facts';

// /llms.txt, a resume for AI agents, generated from portfolio.md and the published notes at
// build time. It used to be a hand-written file in public/ that had to be kept in step by hand.
export const dynamic = 'force-static';

export async function GET() {
  const body = buildLlmsTxt(await getPortfolioData(), getAllNotes());
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
