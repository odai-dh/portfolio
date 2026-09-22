import Image from 'next/image';
import Link from 'next/link';
import { CookingTopBar } from '@/components/cooking/CookingTopBar';
import { CookingFooter } from '@/components/cooking/CookingFooter';
import { EntryGrid } from '@/components/cooking/EntryGrid';
import { getAllCookingEntries } from '@/lib/cooking';

const LANDING_COUNT = 12;

export default function CookingLandingPage() {
  const entries = getAllCookingEntries().slice(0, LANDING_COUNT);

  return (
    <>
      <CookingTopBar aboutHref="#about" />

      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <section className="py-12 md:py-24">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[4px]">
            <Image
              src="/images/cooking/Hero.jpg"
              alt="Ramen with egg and beef slices in a bowl on a wooden table"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="mx-auto mt-10 max-w-xl text-center">
            <p className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#78716C]">
              A small, quiet cooking journal.
            </p>
            <p className="mt-2 font-[family-name:var(--font-manrope)] text-base text-[#78716C]">
              Stockholm, mostly weekends.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <EntryGrid entries={entries} />
          <div className="mt-16 text-center">
            <Link
              href="/cooking/archive"
              className="font-[family-name:var(--font-manrope)] text-sm text-[#1C1917] hover:text-[#B45309]"
            >
              See earlier →
            </Link>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-[560px] pb-24 text-center">
          <p className="font-[family-name:var(--font-fraunces)] text-[18px] leading-[1.7]">
            I write code most days, and somewhere along the way cooking became the thing that
            isn&apos;t that. No plan, no theme — some nights it&apos;s kafta and kabsa, some
            nights it&apos;s carbonara, whatever&apos;s around or whatever I&apos;m craving.
          </p>
          <p className="mt-6 font-[family-name:var(--font-fraunces)] text-[18px] leading-[1.7]">
            This page exists because I take a photo before every plate gets wrecked, and they
            were just sitting in my camera roll doing nothing. So — a small archive, mostly for me.
          </p>
        </section>
      </main>

      <CookingFooter />
    </>
  );
}
