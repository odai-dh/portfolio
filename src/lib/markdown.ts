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

const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  duties: z.array(z.string().min(1)).min(1),
  link: z.string().url().optional(),
  location: z.string().min(1).optional(),
  // Odai's own products rather than an employer: left out of the search data's work history
  ownProduct: z.boolean().optional(),
});

const SkillGroupSchema = z.object({
  group: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const EducationSchema = z.object({
  school: z.string().min(1),
  program: z.string().min(1),
  date: z.string().min(1),
  link: z.string().url().optional(),
  location: z.string().min(1).optional(),
  details: z.string().min(1).optional(),
});

const RecommendationSchema = z.object({
  quote: z.string().min(1),
  highlight: z.string().min(1), // the sentence shown under the hero; must be part of `quote`
  author: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
});

const ProofSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
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
  // a short silent loop shown on the featured card instead of the still image (public/videos/…)
  video: z.string().regex(/^\/videos\/[\w.-]+\.mp4$/, 'expected /videos/<name>.mp4').optional(),
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
  location: z.string().min(1),
  status: z.string().min(1),
  availability: z.string().min(1),
  summary: z.string().min(1),
  currently: z.array(z.string().min(1)).min(1),
  skills: z.array(SkillGroupSchema).min(1),
  education: z.array(EducationSchema).min(1),
  recommendation: RecommendationSchema,
  proof: z.array(ProofSchema).min(1),
  experience: z.array(ExperienceSchema).min(1),
  projects: z.array(RawProjectSchema).min(1),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type Socials = z.infer<typeof SocialsSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type Proof = z.infer<typeof ProofSchema>;
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
