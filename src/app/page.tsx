import { getPortfolioData } from '@/lib/markdown';
import { HeroWithGame } from '@/components/HeroWithGame';
import { HeroMode } from '@/components/HeroMode';
import { ChatWidget } from '@/components/ChatWidget';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { Footer } from '@/components/Footer';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { MainNav } from '@/components/MainNav';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ContactSection } from '@/components/ContactSection';
import { ScrollProgress } from '@/components/ScrollProgress';


export default async function Home() {
  const portfolioData = await getPortfolioData();

  return (
    <>
      <ScrollProgress />
      <SidebarProvider>
        {/* min-w-0 lets this flex item shrink below its content's min-width
            (nowrap rows like the experience tab bar otherwise force the page
            wider than the viewport on mobile) */}
        <div className="md:flex min-w-0 w-full">
          <Sidebar className="hidden md:block" collapsible="icon">
            <MainNav name={portfolioData.name} socials={portfolioData.socials} />
          </Sidebar>
          <SidebarInset className="min-w-0">
            <main className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-24">
              <div className="md:hidden mb-8 flex justify-between items-center">
                <div className="font-headline text-2xl font-bold">{portfolioData.name}</div>
                <SidebarTrigger />
              </div>
              <HeroMode>
                <HeroWithGame
                  name={portfolioData.name}
                  title={portfolioData.title}
                  subtitle={portfolioData.subtitle}
                  email={portfolioData.email}
                />
              </HeroMode>
              <AboutSection
                aboutHtml={portfolioData.aboutHtml}
                tiktokUrl={portfolioData.socials.tiktok}
              />
              <ExperienceSection experiences={portfolioData.experience} />
              <ProjectsSection projects={portfolioData.projects} />
              <SkillsSection skills={portfolioData.skills} />

              <ContactSection />
            </main>
            <Footer name={portfolioData.name} />
          </SidebarInset>
          <Sidebar className="block md:hidden" side="left">
            <MainNav name={portfolioData.name} socials={portfolioData.socials} />
          </Sidebar>
        </div>
      </SidebarProvider>
      <ChatWidget />
    </>
  );
}
