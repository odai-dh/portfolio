import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const portfolioDirectory = path.join(process.cwd(), 'src/content');

export type Skill = {
  name: string;
  proficiency: number;
};

export type Experience = {
  company: string;
  title: string;
  date: string;
  duties: string[];
  link?: string;
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  github?: string;
  slug: string;
  contentHtml: string;
};

export type Socials = {
  github: string;
  linkedin: string;
  instagram: string;
};

export type PortfolioData = {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  socials: Socials;
  aboutHtml: string;
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const fullPath = path.join(portfolioDirectory, 'portfolio.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const aboutHtml = processedContent.toString();

  const projects = await Promise.all(matterResult.data.projects.map(async (project: any) => {
    const processedContent = await remark()
      .use(html)
      .process(project.content || '');
    const contentHtml = processedContent.toString();
    return {
      ...project,
      slug: (project.title as string).toLowerCase().replace(/\s+/g, '-'),
      contentHtml,
    };
  }));

  return {
    ...matterResult.data,
    aboutHtml,
    projects,
  } as PortfolioData;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const portfolioData = await getPortfolioData();
  return portfolioData.projects.find(p => p.slug === slug);
}
