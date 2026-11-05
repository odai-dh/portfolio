// Some project sites refuse to be shown in an iframe on other domains (X-Frame-Options or a CSP
// frame-ancestors rule). The browser then shows an empty frame, and the iframe still fires
// onLoad, so WebsitePreview can't tell. Checking the headers when the page is built lets the
// project page show the screenshot instead. Runs once per build (the page is prerendered).
export async function canEmbed(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(5000) });

    const xfo = res.headers.get('x-frame-options')?.toLowerCase();
    if (xfo && (xfo.includes('deny') || xfo.includes('sameorigin'))) return false;

    const csp = res.headers.get('content-security-policy')?.toLowerCase() ?? '';
    const ancestors = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('frame-ancestors'));
    if (ancestors) {
      const sources = ancestors.split(/\s+/).slice(1);
      const allowed = sources.some((s) => s === '*' || s.includes('odaidh.dev'));
      if (!allowed) return false;
    }

    return true;
  } catch {
    // Unreachable or slow at build time: keep the live preview, which has its own fallback
    return true;
  }
}
