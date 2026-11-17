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
  // Without these, cooking links inherited the homepage's developer preview
  openGraph: {
    type: 'website',
    siteName: 'Odai cooks',
    title: 'Odai cooks',
    description: 'Powered by carbs and bad decisions. Stockholm, mostly weekends.',
    // made by scripts/cooking-og.mjs before every build
    images: [{ url: '/og/cooking/index.jpg', width: 1200, height: 630, alt: 'Odai cooks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odai cooks',
    description: 'Powered by carbs and bad decisions. Stockholm, mostly weekends.',
    images: ['/og/cooking/index.jpg'],
  },
};

export default function CookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`cooking-grain ${fraunces.variable} ${manrope.variable} min-h-screen overflow-x-clip bg-[#FAF7F2] font-[family-name:var(--font-manrope)] text-[#1C1917]`}
    >
      {children}
    </div>
  );
}
