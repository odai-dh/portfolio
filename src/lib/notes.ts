import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const notesDirectory = path.join(process.cwd(), 'content/notes');

const NoteFrontMatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD'),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  // Drafts render in development only, so a post can sit in the repo until it's ready
  draft: z.boolean().default(false),
});

export type Note = z.infer<typeof NoteFrontMatterSchema> & {
  content: string;
  readingMinutes: number;
};

export function getAllNotes(): Note[] {
  const files = fs.existsSync(notesDirectory)
    ? fs.readdirSync(notesDirectory).filter((file) => file.endsWith('.mdx'))
    : [];

  const notes = files.map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(notesDirectory, file), 'utf8'));

    const parsed = NoteFrontMatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid front-matter in content/notes/${file}:\n${parsed.error.issues
          .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
          .join('\n')}`
      );
    }

    const words = content.split(/\s+/).filter(Boolean).length;
    return { ...parsed.data, content, readingMinutes: Math.max(1, Math.round(words / 220)) };
  });

  return notes
    .filter((note) => !note.draft || process.env.NODE_ENV === 'development')
    .sort((a, b) => (a.date === b.date ? (a.slug < b.slug ? -1 : 1) : a.date < b.date ? 1 : -1));
}

export function getNoteBySlug(slug: string): Note | undefined {
  return getAllNotes().find((note) => note.slug === slug);
}

export function formatNoteDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
