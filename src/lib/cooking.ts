import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { imageSize } from 'image-size';
import { z } from 'zod';

const cookingDirectory = path.join(process.cwd(), 'content/cooking');

export function getImageDimensions(publicPath: string): { width: number; height: number } {
  const filePath = path.join(process.cwd(), 'public', publicPath);
  const { width, height } = imageSize(fs.readFileSync(filePath));
  return { width, height };
}

const CookingFrontMatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD'),
  caption: z.string().min(1),
  heroPhoto: z.string().min(1),
  heroAspect: z.enum(['4:5', '16:9']),
  photos: z.array(z.string().min(1)).default([]),
});

export type CookingEntry = z.infer<typeof CookingFrontMatterSchema> & {
  content: string;
};

export function getAllCookingEntries(): CookingEntry[] {
  const files = fs.existsSync(cookingDirectory)
    ? fs.readdirSync(cookingDirectory).filter((file) => file.endsWith('.mdx'))
    : [];

  const entries = files.map((file) => {
    const fullPath = path.join(cookingDirectory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const parsed = CookingFrontMatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid front-matter in content/cooking/${file}:\n${parsed.error.issues
          .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
          .join('\n')}`
      );
    }

    return { ...parsed.data, content };
  });

  return entries.sort((a, b) => {
    if (a.date === b.date) return a.slug < b.slug ? -1 : 1;
    return a.date < b.date ? 1 : -1;
  });
}

export function getCookingEntryBySlug(slug: string): CookingEntry | undefined {
  return getAllCookingEntries().find((entry) => entry.slug === slug);
}

export function getAdjacentCookingEntries(slug: string): {
  prev: CookingEntry | null;
  next: CookingEntry | null;
} {
  const entries = getAllCookingEntries();
  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? entries[index - 1] : null,
    next: index < entries.length - 1 ? entries[index + 1] : null,
  };
}

// Entries are numbered in the order they were cooked: the oldest is No.1
export function toCookingTicket(entry: CookingEntry, index: number, total: number) {
  return {
    slug: entry.slug,
    number: total - index,
    title: entry.title,
    caption: entry.caption,
    date: entry.date,
    dateLabel: formatCookingDate(entry.date),
    heroPhoto: entry.heroPhoto,
  };
}

export function groupByMonth<T extends { date: string }>(items: T[]): { label: string; items: T[] }[] {
  const groups: { label: string; items: T[] }[] = [];
  for (const item of items) {
    const label = formatCookingDate(item.date, { month: 'long', year: 'numeric', day: undefined });
    const group = groups.at(-1);
    if (group?.label === label) group.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

export function formatCookingDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    ...options,
  });
}
