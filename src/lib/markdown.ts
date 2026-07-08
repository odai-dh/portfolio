import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { z } from 'zod';

const portfolioDirectory = path.join(process.cwd(), 'src/content');

// ---------------------------------------------------------------------------
// Front-matter schemas — portfolio.md is validated at build time, so a typo in
// the content file fails the build instead of silently rendering broken pages.
// ---------------------------------------------------------------------------

const SkillSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['frontend', 'backend', 'tools']),
});

const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  duties: z.array(z.string().min(1)).min(1),
  link: z.string().url().optional(),
});

const RawProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD')
    .optional(),
  tags: z.array(z.string().min(1)).min(1),
  link: z.string(), // may be "", "#", or a URL
  github: z.string().optional(), // may be "#"
  figma: z.string().url().optional(),
  image: z.string().min(1),
  content: z.string().optional(),
});

const SocialsSchema = z.object({
  github: z.string().url(),
  linkedin: z.string().url(),
  instagram: z.string().url(),
  tiktok: z.string().url().optional(),
});

const FrontMatterSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  email: z.string().email(),
  socials: SocialsSchema,
  skills: z.array(SkillSchema).min(1),
  experience: z.array(ExperienceSchema).min(1),
  projects: z.array(RawProjectSchema).min(1),
});

export type Skill = z.infer<typeof SkillSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Socials = z.infer<typeof SocialsSchema>;
export type Project = z.infer<typeof RawProjectSchema> & {
  slug: string;
  contentHtml: string;
};
export type PortfolioData = Omit<z.infer<typeof FrontMatterSchema>, 'projects'> & {
  projects: Project[];
  aboutHtml: string;
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const fullPath = path.join(portfolioDirectory, 'portfolio.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const parsed = FrontMatterSchema.safeParse(matterResult.data);
  if (!parsed.success) {
    throw new Error(
      `Invalid portfolio.md front-matter:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`
    );
  }

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const aboutHtml = processedContent.toString();

  const projects: Project[] = await Promise.all(
    parsed.data.projects.map(async (project) => {
      const processed = await remark()
        .use(html)
        .process(project.content || '');
      return {
        ...project,
        slug: project.title.toLowerCase().replace(/\s+/g, '-'),
        contentHtml: processed.toString(),
      };
    })
  );

  return {
    ...parsed.data,
    aboutHtml,
    projects,
  };
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const portfolioData = await getPortfolioData();
  return portfolioData.projects.find(p => p.slug === slug);
}
