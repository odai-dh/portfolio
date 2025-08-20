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

export type Project = {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
};

export type Socials = {
  github: string;
  linkedin: string;
  twitter: string;
};

export type PortfolioData = {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  skills: Skill[];
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

  return {
    ...matterResult.data,
    aboutHtml,
  } as PortfolioData;
}
