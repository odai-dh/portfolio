import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPortfolioData } from '@/lib/markdown';
import { getClientIp } from '@/lib/rate-limit';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

type CvEntry = { org: string; site?: string; date: string };
type Cv = { title: string; contact: string[]; experience: CvEntry[]; projects: { name: string }[] };

// Swedish CV dates use Swedish month names; everything else about a date must match the site
const toEnglishDate = (date: string) =>
  date
    .replace(/\bnu\b/, 'Present')
    .replace(/\bmaj\b/, 'May')
    .replace(/\bokt\b/, 'Oct')
    .replace(/\b([a-z])([a-z]{2})\b/g, (_, first: string, rest: string) => first.toUpperCase() + rest);

// The CV is written separately from the site (it is tailored and shorter), so these tests are
// what keeps the two from contradicting each other. A wrong date on one of them is how the
// Sportly mismatch went unnoticed for months.
describe('the CVs agree with the site', async () => {
  const data = await getPortfolioData();
  const siteDates = new Map(data.experience.map((job) => [job.company, job.date]));

  for (const lang of ['en', 'sv'] as const) {
    const cv = JSON.parse(read(`docs/cv/cv.${lang}.json`)) as Cv;

    it(`${lang}: every job is on the site with the same dates`, () => {
      for (const entry of cv.experience) {
        const company = entry.site ?? entry.org;
        expect(siteDates.has(company), `${entry.org} is not a company in portfolio.md`).toBe(true);
        expect(toEnglishDate(entry.date), entry.org).toBe(siteDates.get(company));
      }
    });

    it(`${lang}: every project is on the site`, () => {
      const titles = data.projects.map((project) => project.title);
      for (const project of cv.projects) expect(titles).toContain(project.name);
    });

    it(`${lang}: shows the site's email address`, () => {
      expect(cv.contact.join(' ')).toContain(data.email);
    });
  }

  it('en: uses the same title as the site', () => {
    expect((JSON.parse(read('docs/cv/cv.en.json')) as Cv).title).toBe(data.title);
  });
});

describe('the email signature agrees with the site', async () => {
  const data = await getPortfolioData();
  const signature = read('docs/email-signature.html');

  it('shows the same name, title, email and links', () => {
    expect(signature).toContain(data.name);
    expect(signature).toContain(data.title);
    expect(signature).toContain(`mailto:${data.email}`);
    expect(signature).toContain(data.socials.github);
    expect(signature).toContain(data.socials.linkedin);
  });

  it('only points at image files that exist', () => {
    const images = [...signature.matchAll(/src="https:\/\/www\.odaidh\.dev(\/email\/[^"]+)"/g)].map((match) => match[1]);
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) expect(fs.existsSync(path.join(root, 'public', image)), image).toBe(true);
  });
});

// Site rules from AGENTS.md that are easy to break without noticing
describe('site rules', () => {
  const sources = fs
    .readdirSync(path.join(root, 'src'), { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => path.join('src', file));

  it('every next/link has prefetch={false} (prefetching loops in production)', () => {
    for (const file of sources) {
      const source = read(file);
      const name = source.match(/import (\w+) from ['"]next\/link['"]/)?.[1];
      if (!name) continue;
      const tags = source.match(new RegExp(`<${name}\\b[^>]*>`, 'g')) ?? [];
      for (const tag of tags) expect(tag, file).toContain('prefetch={false}');
    }
  });

  it('no facts about Odai are hard-coded in the chat route', () => {
    const route = read('src/app/api/chat/route.ts');
    expect(route).not.toMatch(/Art25|Aeoflo|Sportly|Hyper Island/);
  });
});

describe('getClientIp', () => {
  const headers = (values: Record<string, string>) => ({ get: (name: string) => values[name] ?? null });

  it('prefers the real visitor address from Cloudflare', () => {
    expect(getClientIp(headers({ 'cf-connecting-ip': '1.1.1.1', 'x-nf-client-connection-ip': '2.2.2.2', 'x-forwarded-for': '3.3.3.3' }))).toBe('1.1.1.1');
  });

  it('falls back to Netlify, then the first forwarded address, then "unknown"', () => {
    expect(getClientIp(headers({ 'x-nf-client-connection-ip': '2.2.2.2', 'x-forwarded-for': '3.3.3.3' }))).toBe('2.2.2.2');
    expect(getClientIp(headers({ 'x-forwarded-for': '3.3.3.3, 4.4.4.4' }))).toBe('3.3.3.3');
    expect(getClientIp(headers({}))).toBe('unknown');
  });
});
