import { getPortfolioData } from '@/lib/markdown';
import { HeroSection } from '@/components/HeroSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { Footer } from '@/components/Footer';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { MainNav } from '@/components/MainNav';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { ScrollProgress } from '@/components/ScrollProgress';


export default async function Home() {
  const portfolioData = await getPortfolioData();

  return (
    <>
      <ScrollProgress />
      <SidebarProvider>
        <div className="md:flex">
          <Sidebar className="hidden md:block" collapsible="icon">
            <MainNav name={portfolioData.name} socials={portfolioData.socials} />
          </Sidebar>
          <SidebarInset>
            <main className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-24">
              <div className="md:hidden mb-8 flex justify-between items-center">
                <h1 className="font-headline text-2xl font-bold">{portfolioData.name}</h1>
                <SidebarTrigger />
              </div>
              <HeroSection
                name={portfolioData.name}
                title={portfolioData.title}
                subtitle={portfolioData.subtitle}
                email={portfolioData.email}
              />
              <AboutSection
                aboutHtml={portfolioData.aboutHtml}
                tiktokUrl={portfolioData.socials.tiktok}
              />
              <ExperienceSection experiences={portfolioData.experience} />
              <ProjectsSection projects={portfolioData.projects} />
              <ContactSection />
            </main>
            <Footer name={portfolioData.name} />
          </SidebarInset>
          <Sidebar className="block md:hidden" side="left">
            <MainNav name={portfolioData.name} socials={portfolioData.socials} />
          </Sidebar>
        </div>
      </SidebarProvider>
    </>
  );
}
