import { describe, expect, it } from 'vitest';
import { buildChatFacts, buildLlmsTxt, buildPersonJsonLd, parseDateRange, plainText } from '@/lib/facts';
import { getPortfolioData } from '@/lib/markdown';
import { getAllNotes } from '@/lib/notes';

describe('parseDateRange', () => {
  it.each([
    ['Sep 2025 – Mar 2026', { start: '2025-09', end: '2026-03' }],
    ['Oct 2026 – Present', { start: '2026-10' }],
    ['2018 – 2019', { start: '2018', end: '2019' }],
    ['2026 – Present', { start: '2026' }],
    ['May 2025 - Sep 2025', { start: '2025-05', end: '2025-09' }],
  ])('reads %s', (input, expected) => {
    expect(parseDateRange(input)).toEqual(expected);
  });

  it.each(['soon', 'Smarch 2025 – Present', '2025', 'Present – 2026'])('rejects %s', (input) => {
    expect(parseDateRange(input)).toBeNull();
  });
});

describe('plainText', () => {
  it('turns Markdown links into text with the address', () => {
    expect(plainText('the website for [NIARR](https://niarr.eu), an NGO')).toBe('the website for NIARR (https://niarr.eu), an NGO');
  });
});

// These run against the real content, so a fact that is on the site can't go missing from what
// the chat assistant, /llms.txt or the search data say.
describe('outputs built from portfolio.md', async () => {
  const data = await getPortfolioData();
  const chat = buildChatFacts(data);
  const llms = buildLlmsTxt(data, getAllNotes());
  const jsonLd = buildPersonJsonLd(data);

  it('gives the chat assistant every job with its title and dates', () => {
    for (const job of data.experience) {
      expect(chat).toContain(`${job.company}`);
      expect(chat).toContain(`(${job.title}, ${job.date})`);
    }
  });

  it('gives the chat assistant every project, the education and the contact details', () => {
    for (const project of data.projects) expect(chat).toContain(`${project.title}: `);
    for (const item of data.education) expect(chat).toContain(`${item.school}`);
    expect(chat).toContain(data.email);
    expect(chat).toContain(data.status);
  });

  it('keeps the chat facts plain text', () => {
    expect(chat).not.toMatch(/\]\(https?:/); // no Markdown links
    expect(chat).not.toContain('**');
  });

  it('lists every job, project and published note in llms.txt', () => {
    for (const job of data.experience) expect(llms).toContain(`**${job.company}**`);
    for (const job of data.experience) expect(llms).toContain(`${job.title} (${job.date})`);
    for (const project of data.projects) expect(llms).toContain(`/projects/${project.slug})`);
    for (const note of getAllNotes()) expect(llms).toContain(`/notes/${note.slug})`);
    expect(llms).toContain(`mailto:${data.email}`);
    expect(llms).toContain(data.availability);
  });

  it('can turn every experience date into an ISO date for the search data', () => {
    for (const job of data.experience) expect(parseDateRange(job.date), job.company).not.toBeNull();
  });

  it('puts employers, but not his own products, in the search data', () => {
    const names = jsonLd.workExperience.map((role) => role.worksFor.name);
    for (const job of data.experience) {
      if (job.ownProduct) expect(names).not.toContain(job.company);
      else expect(names).toContain(job.company);
    }
    expect(jsonLd.jobTitle).toBe(data.title);
    expect(jsonLd.email).toBe(`mailto:${data.email}`);
    expect(jsonLd.alumniOf.name).toBe(data.education[0].school);
  });

  it('quotes the recommendation word for word under the hero', () => {
    expect(data.recommendation.quote).toContain(data.recommendation.highlight);
  });
});
