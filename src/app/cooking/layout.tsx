import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Odai cooks',
  description: 'A small, quiet cooking journal. Stockholm, mostly weekends.',
};

export default function CookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${manrope.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-manrope)] text-[#1C1917]`}
    >
      {children}
    </div>
  );
}
