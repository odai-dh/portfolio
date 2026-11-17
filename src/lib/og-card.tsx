import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

// Shared look for the link-preview images (Open Graph / Twitter cards) of project and note pages.
// It follows the site-wide og-image.png: deep blue gradient, faint grid, the pixel portrait, the
// headline in Calistoga. Rendered at build time by next/og, so no browser is involved.

export const OG_SIZE = { width: 1200, height: 630 };

// Paths are scoped to fixed folders so the bundler only traces those, not the whole project
const ogAsset = (name: string) => path.join(process.cwd(), 'assets', 'og', name);
const projectImage = (name: string) => path.join(process.cwd(), 'public', 'images', 'projects', name);
const toDataUrl = (data: Buffer, type: string) => `data:${type};base64,${data.toString('base64')}`;

// Calistoga for headlines and Inter for text, as on the site (both SIL OFL, licences beside them)
let fontsPromise: Promise<[Buffer, Buffer, Buffer]> | null = null;
const loadFonts = () =>
  (fontsPromise ??= Promise.all([
    readFile(ogAsset('Calistoga-Regular.ttf')),
    readFile(ogAsset('Inter-400.ttf')),
    readFile(ogAsset('Inter-600.ttf')),
  ]));

type CardOptions = {
  label: string; // "Project" / "Note"
  title: string;
  description: string;
  meta?: string; // a short line under the description, e.g. the date
  screenshot?: string; // a /images/projects/… path to a 1200×630 image shown on the right
};

// Cut long text at a word boundary so a card never ends mid-word
const clamp = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '')}…`;
};

export async function renderOgCard({ label, title, description, meta, screenshot }: CardOptions) {
  const portrait = toDataUrl(await readFile(ogAsset('pixel-portrait.png')), 'image/png');
  const shotName = screenshot?.match(/^\/images\/projects\/([\w.-]+\.(?:jpe?g|png))$/)?.[1];
  const shot = shotName
    ? await readFile(projectImage(shotName))
        .then((data) => toDataUrl(data, shotName.endsWith('.png') ? 'image/png' : 'image/jpeg'))
        .catch(() => null)
    : null;

  const textWidth = shot ? 600 : 1040;
  const titleSize = title.length > 40 ? 52 : title.length > 22 ? 62 : 76;

  const [calistoga, inter, interSemiBold] = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(135deg, #0b1f4d 0%, #12327c 55%, #0e2a66 100%)',
          color: '#ffffff',
          fontFamily: 'Inter',
        }}
      >
        {/* glow and grid, as on the site-wide preview image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'radial-gradient(circle at 78% 50%, rgba(27,79,184,0.95) 0%, rgba(27,79,184,0) 55%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            opacity: 0.07,
            backgroundImage: 'linear-gradient(#9cc4ff 1px, transparent 1px), linear-gradient(90deg, #9cc4ff 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', padding: '56px 0 52px 64px', width: textWidth + 64, height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img elements */}
            <img src={portrait} width={56} height={56} style={{ borderRadius: 8 }} alt="" />
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#7cc0ff',
              }}
            >
              {label}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 44,
              fontFamily: 'Calistoga',
              fontSize: titleSize,
              lineHeight: 1.08,
              letterSpacing: -0.5,
            }}
          >
            {clamp(title, 70)}
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 26, lineHeight: 1.45, color: '#c9d8f5' }}>
            {clamp(description, shot ? 150 : 210)}
          </div>
          {meta && <div style={{ display: 'flex', marginTop: 18, fontSize: 22, color: '#8fb0e8' }}>{meta}</div>}

          <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center', gap: 14, fontSize: 26 }}>
            <span style={{ fontFamily: 'Calistoga', color: '#ffffff' }}>Odai Dahi</span>
            <span style={{ color: '#7cc0ff' }}>·</span>
            <span style={{ color: '#a9c3f5' }}>odaidh.dev</span>
          </div>
        </div>

        {shot && (
          <div
            style={{
              position: 'absolute',
              left: 724,
              top: 150,
              width: 560,
              height: 420,
              display: 'flex',
              overflow: 'hidden',
              borderTop: '2px solid #3b82f6',
              borderLeft: '2px solid #3b82f6',
              borderBottom: '2px solid #3b82f6',
              borderRadius: '14px 0 0 14px',
              boxShadow: '0 0 60px rgba(59,130,246,0.55)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img elements */}
            <img src={shot} width={800} height={420} style={{ objectFit: 'cover', objectPosition: 'left top' }} alt="" />
          </div>
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Inter', data: inter, style: 'normal', weight: 400 },
        { name: 'Inter', data: interSemiBold, style: 'normal', weight: 600 },
        { name: 'Calistoga', data: calistoga, style: 'normal', weight: 400 },
      ],
    }
  );
}
