import type {NextConfig} from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  {
    // Enforced since 2026-09-25, after a crawl of every route (incl. 3D mode, chat,
    // cooking) found zero violations. Cloudflare's email-decode script is same-origin.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // React's development build needs eval() for its debugging tools; production never does
      // static.cloudflareinsights.com: Cloudflare Web Analytics (cookie-free; approved by Odai 2026-11-17).
      // Cloudflare injects its beacon itself when Web Analytics is switched on for the site.
      `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "frame-src https:",
      "connect-src 'self' https://cloudflareinsights.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // The commit this build came from (Netlify sets COMMIT_REF), shown by /api/health so the live
  // check can wait until a push is actually deployed before testing it
  env: {
    DEPLOYED_COMMIT: (process.env.COMMIT_REF ?? 'local').slice(0, 7),
  },
  // Bundle next-mdx-remote into the server code. Next keeps it external by default and loads it
  // through a hashed alias in .next/node_modules, which the Netlify runtime doesn't ship: every
  // /notes/<slug> and /cooking/<slug> page then answered 500 in production while working locally.
  transpilePackages: ['next-mdx-remote'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
