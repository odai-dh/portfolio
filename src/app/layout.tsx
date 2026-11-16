import type { Metadata, Viewport } from 'next';
import { Inter, Calistoga } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/ThemeProvider';
import { getPortfolioData } from '@/lib/markdown';
import { buildPersonJsonLd } from '@/lib/facts';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const calistoga = Calistoga({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-calistoga',
  display: 'swap',
});

// Runs before the first paint, so a visitor who chose light mode never sees a flash of dark.
// Dark stays the default for everyone else. (ThemeProvider reads the class this sets.)
const themeInitScript = `try{if(localStorage.getItem('theme')==='light'){var c=document.documentElement.classList;c.remove('dark');c.add('light')}}catch(e){}`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
};

export const metadata: Metadata = {
  title: 'Odai Dahi | Full Stack Developer',
  description: 'Full Stack Developer in Stockholm, building production apps with Next.js, TypeScript and AI integrations. Open to full-time roles.',
  keywords: [
    'full stack developer',
    'frontend developer',
    'React developer',
    'Next.js developer',
    'TypeScript',
    'Node.js',
    'AI integration',
    'web development',
    'portfolio',
    'Stockholm developer',
    'Odai Dahi',
  ],
  authors: [{ name: 'Odai Dahi' }],
  creator: 'Odai Dahi',
  publisher: 'Odai Dahi',
  robots: 'index, follow',
  metadataBase: new URL('https://www.odaidh.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.odaidh.dev',
    title: 'Odai Dahi | Full Stack Developer',
    description: 'Full Stack Developer in Stockholm. Next.js, TypeScript, Node.js and AI integrations. Open to full-time roles.',
    siteName: 'Odai Dahi Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Odai Dahi — Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odai Dahi | Full Stack Developer',
    description: 'Full Stack Developer in Stockholm. Next.js, TypeScript, Node.js and AI integrations.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0099ff',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = buildPersonJsonLd(await getPortfolioData());

  return (
    // suppressHydrationWarning: the inline script below may swap dark for light before React loads
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${calistoga.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <meta name="google-site-verification" content="eqIL5mctJjbAPj_179mB8g0QQvo0wCHZ6PLtqJ8MJFU" />
        <meta name="google-site-verification" content="7ZU2DkIjWAd_35wggYNZj9pZDrZI38mL21W2Ap8fmfY" />
        {/* Structured data for search engines, built from portfolio.md */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}