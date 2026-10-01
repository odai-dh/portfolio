import Link from 'next/link';
import { CookingTopBar } from '@/components/cooking/CookingTopBar';
import { CookingFooter } from '@/components/cooking/CookingFooter';
import { PlateHero } from '@/components/cooking/PlateHero';
import { DishTicker } from '@/components/cooking/DishTicker';
import { MenuList, type MenuGroup } from '@/components/cooking/MenuList';
import { KitchenReceipt } from '@/components/cooking/KitchenReceipt';
import { getAllCookingEntries, groupByMonth, toCookingTicket } from '@/lib/cooking';

const LANDING_COUNT = 12;

export default function CookingLandingPage() {
  const allEntries = getAllCookingEntries();
  const groups: MenuGroup[] = groupByMonth(
    allEntries
      .slice(0, LANDING_COUNT)
      .map((entry, index) => toCookingTicket(entry, index, allEntries.length))
  );

  return (
    <>
      <CookingTopBar aboutHref="#about" />

      <main>
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <PlateHero />
        </div>

        <DishTicker dishes={allEntries.map((entry) => entry.title.toLowerCase())} />

        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <MenuList groups={groups} />
          <div className="pb-24 text-center">
            <Link prefetch={false}
              href="/cooking/archive"
              className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#1C1917] underline decoration-[#B4532A] decoration-1 underline-offset-8 hover:text-[#B4532A]"
            >
              The full archive →
            </Link>
          </div>

          <section
            id="about"
            className="grid scroll-mt-24 items-center gap-16 border-t border-[#1C1917]/15 py-24 md:grid-cols-[1.2fr_1fr]"
          >
            <div className="max-w-[560px]">
              <p className="font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.3em] text-[#B4532A]">
                About the cook
              </p>
              <p className="mt-8 font-[family-name:var(--font-fraunces)] text-[20px] leading-[1.7] first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-fraunces)] first-letter:text-[88px] first-letter:italic first-letter:leading-[0.8] first-letter:text-[#B4532A]">
                Some days I write code. Other days I make kafta. The days I do both are the good ones.
              </p>
              <p className="mt-6 font-[family-name:var(--font-fraunces)] text-[20px] leading-[1.7]">
                There&apos;s no theme here. Kabsa on Monday, carbonara on Wednesday, whatever&apos;s
                in the fridge on Sunday. I take a photo before I eat because otherwise the plate gets
                wrecked in ninety seconds and I have nothing to show for it.
              </p>
              <p className="mt-6 font-[family-name:var(--font-fraunces)] text-[20px] italic leading-[1.7]">
                This is where the photos live now. Mostly for me. You can look.
              </p>
            </div>
            <KitchenReceipt entries={allEntries} />
          </section>
        </div>
      </main>

      <CookingFooter />
    </>
  );
}
