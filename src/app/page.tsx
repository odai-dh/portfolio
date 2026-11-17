import { getPortfolioData } from '@/lib/markdown';
import { HeroWithGame } from '@/components/HeroWithGame';
import { HeroMode } from '@/components/HeroMode';
import { ChatWidget } from '@/components/ChatWidget';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { Footer } from '@/components/Footer';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { MainNav } from '@/components/MainNav';
import { ProofStrip } from '@/components/ProofStrip';
import { AboutSection } from '@/components/AboutSection';
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
          {/* One sidebar: shadcn's Sidebar is a fixed panel from 768 px and a slide-in sheet below.
              A second "mobile" copy used to sit after the content: hidden on wide screens but still
              reserving an empty 256 px column, and opening as a second sheet on phones. */}
          <Sidebar collapsible="icon">
            <MainNav name={portfolioData.name} socials={portfolioData.socials} />
          </Sidebar>
          {/* xl:pr-64 keeps the desktop look Odai prefers: the content sits close to the sidebar
              instead of drifting right into the middle of a wide window. (The old second sidebar
              made this space by accident, but at every width, which squeezed tablets.) */}
          <SidebarInset className="min-w-0 xl:pr-64">
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
              <ProofStrip proof={portfolioData.proof} recommendation={portfolioData.recommendation} />
              <AboutSection
                aboutHtml={portfolioData.aboutHtml}
                tiktokUrl={portfolioData.socials.tiktok}
              />
              <ExperienceSection experiences={portfolioData.experience} />
              <ProjectsSection projects={portfolioData.projects} />

              <ContactSection
                socials={portfolioData.socials}
                location={portfolioData.location}
                availability={portfolioData.availability}
              />
            </main>
            <Footer name={portfolioData.name} />
          </SidebarInset>
        </div>
      </SidebarProvider>
      <ChatWidget />
    </>
  );
}
