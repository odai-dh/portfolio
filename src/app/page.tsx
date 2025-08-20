import { getPortfolioData } from '@/lib/markdown';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default async function Home() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header name={portfolioData.name} />
      <main className="flex-grow">
        <HeroSection 
          name={portfolioData.name}
          title={portfolioData.title}
          subtitle={portfolioData.subtitle}
          aboutHtml={portfolioData.aboutHtml}
        />
        <SkillsSection skills={portfolioData.skills} />
        <ProjectsSection projects={portfolioData.projects} />
        <ContactSection email={portfolioData.email} socials={portfolioData.socials} />
      </main>
      <Footer name={portfolioData.name} />
    </div>
  );
}
