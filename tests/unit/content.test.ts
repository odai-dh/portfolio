import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllCookingEntries } from '@/lib/cooking';
import { getPortfolioData } from '@/lib/markdown';
import { getAllNotes } from '@/lib/notes';

const root = process.cwd();
const inPublic = (file: string) => fs.existsSync(path.join(root, 'public', file));

describe('portfolio.md', async () => {
  const data = await getPortfolioData();

  it('gives every project a unique, clean web address', () => {
    const slugs = data.projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9][a-z0-9.-]*$/);
  });

  it('has an image file for every project', () => {
    for (const project of data.projects) {
      if (project.image.startsWith('/')) expect(inPublic(project.image), `${project.title}: ${project.image}`).toBe(true);
    }
  });

  it('lists projects newest first', () => {
    const dates = data.projects.map((project) => project.date).filter((date): date is string => !!date);
    const newestTwo = dates.slice(0, 2);
    expect([...newestTwo].sort().reverse()).toEqual(newestTwo);
  });

  it('has the CV files the hero links to', () => {
    expect(inPublic('OdaiDahi-CV-En.pdf')).toBe(true);
    expect(inPublic('OdaiDahi-CV-Sv.pdf')).toBe(true);
  });
});

describe('notes', () => {
  const notes = getAllNotes();

  it('have unique slugs that match their file names', () => {
    const slugs = notes.map((note) => note.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(fs.existsSync(path.join(root, 'content/notes', `${slug}.mdx`)), slug).toBe(true);
  });
});

describe('cooking entries', () => {
  const entries = getAllCookingEntries();

  it('have unique slugs and a photo that exists', () => {
    const slugs = entries.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const entry of entries) expect(inPublic(entry.heroPhoto), `${entry.slug}: ${entry.heroPhoto}`).toBe(true);
  });
});
