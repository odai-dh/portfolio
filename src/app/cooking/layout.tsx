import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './cooking.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
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
  description: 'Powered by carbs and bad decisions. Stockholm, mostly weekends.',
  robots: { index: false, follow: false },
};

export default function CookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`cooking-grain ${fraunces.variable} ${manrope.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-manrope)] text-[#1C1917]`}
    >
      {children}
    </div>
  );
}
