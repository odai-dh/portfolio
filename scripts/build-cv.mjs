// Builds the CV PDFs in public/ from docs/cv/cv.<lang>.json.
//
//   node scripts/build-cv.mjs            both languages
//   node scripts/build-cv.mjs en         one language
//
// It writes an HTML page per language to docs/cv/.build/ and prints it to PDF with a
// Chromium-based browser (Google Chrome by default; set CHROME_PATH to use another one).
// To change the CV, edit the JSON files, run this, and look at the PDFs before committing.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'docs/cv/.build');

const chrome =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) {
  console.error('No Chrome found. Set CHROME_PATH to a Chromium-based browser.');
  process.exit(1);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const list = (items) => (items?.length ? `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '');
const sep = '<span class="sep">·</span>';

function entry({ heading, date, meta, bullets, quote, tech }) {
  return `<div class="entry">
  <div class="row"><div class="heading">${heading}</div><div class="date">${esc(date)}</div></div>
  ${meta ? `<div class="meta">${esc(meta)}</div>` : ''}
  ${list(bullets)}
  ${quote ? `<p class="quote">${esc(quote)}</p>` : ''}
  ${tech ? `<p class="tech">${esc(tech)}</p>` : ''}
</div>`;
}

const css = `
@page { size: A4; margin: 14mm 17mm 12mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 9pt; line-height: 1.4; color: #1a1a1a; }
header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.2pt solid #111; padding-bottom: 9pt; }
h1 { font-size: 25pt; line-height: 1.1; font-weight: 700; letter-spacing: -0.3pt; color: #111; }
.title { font-size: 10.5pt; color: #555; margin-top: 3pt; }
.contact { text-align: right; font-size: 8.4pt; line-height: 1.55; color: #444; }
.summary { margin-top: 10pt; font-size: 9.3pt; line-height: 1.48; }
h2 { display: flex; align-items: center; gap: 9pt; margin: 10pt 0 5pt; font-size: 8.6pt; font-weight: 700; letter-spacing: 1.6pt; text-transform: uppercase; color: #111; break-after: avoid; }
h2::after { content: ''; flex: 1; border-top: 0.6pt solid #cfcfcf; }
.entry { margin-bottom: 6.5pt; break-inside: avoid; }
.row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
.heading { font-size: 9.9pt; font-weight: 700; color: #111; }
.heading a { color: inherit; }
.sep { color: #999; font-weight: 400; margin: 0 4pt; }
.date { font-size: 8.4pt; color: #555; white-space: nowrap; }
.meta { font-size: 8.2pt; color: #666; margin-top: 0.5pt; }
ul { list-style: none; margin-top: 2.5pt; }
li { position: relative; padding-left: 12pt; margin-bottom: 1.2pt; }
li::before { content: '•'; position: absolute; left: 4pt; }
.quote { font-size: 8.2pt; font-style: italic; color: #333; padding-left: 12pt; margin-top: 1.5pt; }
.tech { font-family: Menlo, 'SF Mono', Consolas, monospace; font-size: 7.3pt; color: #777; margin-top: 2.5pt; }
.skills { display: grid; grid-template-columns: 82pt 1fr; row-gap: 2.2pt; font-size: 8.6pt; }
.skills dt { font-weight: 700; color: #111; }
.skills dd { color: #333; }
.languages { font-size: 9pt; }
.languages span { margin-right: 14pt; }
.languages b { margin-right: 5pt; }
`;

function render(cv) {
  const experience = cv.experience
    .map((e) => entry({ ...e, heading: `${esc(e.role)}${sep}${esc(e.org)}` }))
    .join('\n');
  const projects = cv.projects
    .map((p) => {
      const sub = p.link ? `<a href="${esc(p.link)}">${esc(p.sub)}</a>` : esc(p.sub);
      return entry({ ...p, heading: `${esc(p.name)}${sep}${sub}` });
    })
    .join('\n');
  const education = cv.education
    .map((e) => entry({ ...e, heading: `${esc(e.title)}${sep}${esc(e.org)}` }))
    .join('\n');
  const skills = cv.skills.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
  const languages = cv.languages.map(([k, v]) => `<span><b>${esc(k)}</b>${esc(v)}</span>`).join('');

  return `<!doctype html>
<html lang="${cv.lang}">
<head><meta charset="utf-8"><title>${esc(cv.name)} · CV</title><style>${css}</style></head>
<body>
<header>
  <div><h1>${esc(cv.name)}</h1><div class="title">${esc(cv.title)}</div></div>
  <div class="contact">${cv.contact.map(esc).join('<br>')}</div>
</header>
<p class="summary">${esc(cv.summary)}</p>
<h2>${esc(cv.labels.experience)}</h2>
${experience}
<h2>${esc(cv.labels.projects)}</h2>
${projects}
<h2>${esc(cv.labels.education)}</h2>
${education}
<h2>${esc(cv.labels.skills)}</h2>
<dl class="skills">${skills}</dl>
<h2>${esc(cv.labels.languages)}</h2>
<p class="languages">${languages}</p>
</body>
</html>`;
}

mkdirSync(buildDir, { recursive: true });
const only = process.argv[2];
for (const lang of ['en', 'sv']) {
  if (only && only !== lang) continue;
  const cv = JSON.parse(readFileSync(join(root, `docs/cv/cv.${lang}.json`), 'utf8'));
  const htmlPath = join(buildDir, `cv-${lang}.html`);
  writeFileSync(htmlPath, render(cv));
  // CV_OUT_DIR writes the PDFs somewhere else, to review them before replacing the live files
  const out = process.env.CV_OUT_DIR
    ? resolve(process.env.CV_OUT_DIR, cv.output.split('/').pop())
    : join(root, cv.output);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${out}`, `file://${htmlPath}`], { stdio: 'ignore' });
  console.log(`${lang}: ${out}`);
}
