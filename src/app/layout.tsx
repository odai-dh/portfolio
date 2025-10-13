import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/ThemeProvider';

// Add these separate exports
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.6,
  maximumScale: 5,
  userScalable: true,
};

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  { media: '(prefers-color-scheme: dark)', color: '#111111' }
];

export const metadata: Metadata = {
  title: 'Odai Dahi | Frontend Developer',
  description: 'Frontend developer specializing in React, TypeScript, and modern web technologies. View my portfolio and get in touch.',
  keywords: ['frontend developer', 'React', 'TypeScript', 'web development', 'portfolio'],
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
    title: 'Odai Dahi | Frontend Developer Portfolio',
    description: 'Frontend developer specializing in React, TypeScript, and modern web technologies.',
    siteName: 'Odai Dahi Portfolio',
    images: [
      {
        url: '/og-image.png', // Create this 1200x630 image in your public folder
        width: 1200,
        height: 630,
        alt: 'Odai Dahi - Frontend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odai Dahi | Frontend Developer',
    description: 'Frontend developer specializing in React, TypeScript, and modern web technologies.',
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
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="google-site-verification" content="eqIL5mctJjbAPj_179mB8g0QQvo0wCHZ6PLtqJ8MJFU" />
        <meta name="google-site-verification" content="7ZU2DkIjWAd_35wggYNZj9pZDrZI38mL21W2Ap8fmfY" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Calistoga&display=swap" rel="stylesheet" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Odai Dahi",
              "url": "https://www.odaidh.dev",
              "jobTitle": "Frontend Developer",
              "description": "Frontend developer specializing in React, TypeScript, and modern web technologies.",
              "image": "https://www.odaidh.dev/og-image.png",
              "sameAs": [
                "https://github.com/odai-dh",
                "https://www.linkedin.com/in/odai-dahi/",
                "https://www.instagram.com/odai.dh1"
              ],
              "knowsAbout": ["React", "TypeScript", "Next.js", "TailwindCSS", "Web Development"],
              "alumniOf": {
                "@type": "Organization",
                "name": "Hyper Island"
              }
            })
          }}
        />
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