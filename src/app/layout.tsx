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
  title: 'Odai Dahi | Full Stack Developer',
  description: 'Full Stack Developer with a frontend focus — building production apps with Next.js, TypeScript, Node.js, and AI integrations. Currently freelancing and open to new opportunities.',
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
    'freelance developer',
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
    description: 'Full Stack Developer with a frontend focus — Next.js, TypeScript, Node.js, and AI integrations. Freelancing & open to work.',
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
    description: 'Full Stack Developer with a frontend focus — Next.js, TypeScript, Node.js, and AI integrations.',
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
              "jobTitle": "Full Stack Developer",
              "description": "Full Stack Developer with a frontend focus, building production apps with Next.js, TypeScript, Node.js, and AI integrations.",
              "image": "https://www.odaidh.dev/og-image.png",
              "email": "mailto:odai@odaidh.dev",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Stockholm",
                "addressCountry": "SE"
              },
              "sameAs": [
                "https://github.com/odai-dh",
                "https://www.linkedin.com/in/odai-dahi/",
                "https://www.instagram.com/odai.dh1"
              ],
              "knowsAbout": [
                "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
                "Express", "MongoDB", "SQL", "REST APIs", "Tailwind CSS",
                "SwiftUI", "AI Integration", "Full Stack Development", "Web Development"
              ],
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Full Stack Developer",
                "occupationalCategory": "15-1254.00",
                "skills": "React, Next.js, TypeScript, Node.js, Express, MongoDB, SQL, Tailwind CSS, SwiftUI, AI integrations (Groq, Gemini, Hugging Face), REST APIs, full-stack feature development",
                "responsibilities": "Building production web applications, AI-powered features, dashboards, and frontend systems for startups and clients.",
                "occupationLocation": {
                  "@type": "City",
                  "name": "Stockholm"
                }
              },
              "seeks": {
                "@type": "Demand",
                "name": "Open to new opportunities",
                "description": "Open to full-time Full Stack or Frontend Developer roles (remote, hybrid, or Stockholm-based) and freelance web/mobile projects."
              },
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Hyper Island",
                "url": "https://www.hyperisland.com/",
                "description": "Code & Collaborate program — project-based education focused on collaborative product development."
              },
              "workExperience": [
                {
                  "@type": "OrganizationRole",
                  "roleName": "Frontend Developer Intern",
                  "startDate": "2025-09",
                  "endDate": "2026-04",
                  "worksFor": { "@type": "Organization", "name": "Aeoflo", "url": "https://aeoflo.com/" }
                },
                {
                  "@type": "OrganizationRole",
                  "roleName": "Frontend Developer Intern",
                  "startDate": "2025-06",
                  "endDate": "2025-10",
                  "worksFor": { "@type": "Organization", "name": "Sportly", "url": "https://sportly.se/" }
                },
                {
                  "@type": "OrganizationRole",
                  "roleName": "Assistant Restaurant Manager",
                  "startDate": "2020-03",
                  "endDate": "2024-08",
                  "worksFor": { "@type": "Organization", "name": "Max Burgers" }
                }
              ]
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