import { OG_SIZE, renderOgCard } from '@/lib/og-card';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Notes by Odai Dahi';

export default async function Image() {
  return renderOgCard({
    label: 'Notes',
    title: 'Notes',
    description: 'Short write-ups of problems I ran into while building, and how I solved them.',
  });
}
