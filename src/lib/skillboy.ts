// Shared by both Skill·Boy games: the 2D canvas Snake and the 3D mode.

export type Category = 'frontend' | 'backend';
export type SkillItem = { name: string; category: Category; color: string };

// Ordered exactly as a developer grows — from absolute basics to advanced
export const SKILLS: SkillItem[] = [
  { name: 'HTML',       category: 'frontend', color: '#E34F26' },  // 1 — where everyone starts
  { name: 'CSS',        category: 'frontend', color: '#1572B6' },  // 2
  { name: 'JavaScript', category: 'frontend', color: '#F7DF1E' },  // 3
  { name: 'SQL',        category: 'backend',  color: '#F59E0B' },  // 4 — first backend concept
  { name: 'TypeScript', category: 'frontend', color: '#60A5FA' },  // 5
  { name: 'Node.js',    category: 'backend',  color: '#4ADE80' },  // 6
  { name: 'React',      category: 'frontend', color: '#61DAFB' },  // 7
  { name: 'Express',    category: 'backend',  color: '#94A3B8' },  // 8
  { name: 'Tailwind',   category: 'frontend', color: '#38BDF8' },  // 9
  { name: 'REST API',   category: 'backend',  color: '#EC4899' },  // 10
  { name: 'MongoDB',    category: 'backend',  color: '#86EFAC' },  // 11
  { name: 'Next.js',    category: 'frontend', color: '#e2e8f0' },  // 12
  { name: 'SwiftUI',    category: 'frontend', color: '#F97316' },  // 13 — top tier
];

export function getTitle(fe: number, be: number): string {
  const total = fe + be;
  if (total >= 13)              return 'God-Tier Engineer 👑';
  if (total >= 10)              return 'Senior Developer 🔥';
  if (fe >= 5 && be >= 4)       return 'Full Stack Architect';
  if (fe >= 3 && be >= 3)       return 'Full Stack Developer';
  if (fe >= 5)                  return 'Frontend Expert';
  if (be >= 4)                  return 'Backend Expert';
  if (fe >= 2 && be >= 2)       return 'Full Stack Developer';
  if (fe >= 3)                  return 'Frontend Developer';
  if (be >= 3)                  return 'Backend Developer';
  if (fe >= 2)                  return 'Junior Frontend Dev';
  if (be >= 2)                  return 'Junior Backend Dev';
  if (total === 1)              return 'Intern 👀';
  return 'Developer';
}

export const GAME_OVER_MSGS = [
  'ok but hire me tho',
  'you lost. i didn\'t.',
  'skill issue. hire me.',
  'the snake died. my career didn\'t.',
  'git commit -m "L"',
  'even the snake has a portfolio',
  '404: win not found',
  'have you tried hiring me?',
  'console.log("hire odai")',
  'the snake is gone. i\'m still here.',
];

export function randomMsg(): string {
  return GAME_OVER_MSGS[Math.floor(Math.random() * GAME_OVER_MSGS.length)];
}
