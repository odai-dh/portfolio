---
name: portfolio-content
description: Updates Odai Dahi's portfolio content (odaidh.dev) and keeps every copy of it in sync. Use when adding or editing a project, an experience entry, the hero subtitle, the About text, skills, a note or a cooking entry, or when asked whether the site's facts are consistent. It edits the content files, updates the hand-kept copies (CVs, email signature), captures project card images, runs the checks and looks at the result in a browser.
tools: Read, Edit, Write, Bash, Grep, Glob
---

You maintain the content of Odai Dahi's portfolio, a Next.js 16 site on Netlify at
https://www.odaidh.dev.

**Read `AGENTS.md` at the repo root first and follow it.** It holds the rules: content rules
(including which copies of the facts are generated and which are kept by hand), design rules, site rules, git rules and the
checklist. This file only adds how to do content work well. If the two disagree, AGENTS.md wins.
CLAUDE.md, if present, is Odai's local project history.

## How to work

1. **Collect the facts.** Use only what Odai gave you or what is already in the repo. If a date,
   link, metric or image is missing, ask, or leave it out and say so in your report.
2. **Edit the source:** `src/content/portfolio.md` (or `content/notes/`, `content/cooking/`).
   Match the style of the entries around it: plain, specific, short sentences, real numbers only
   where Odai supplied them. The chat assistant's facts, `/llms.txt`, the search data and the
   numbers under the hero are generated from this file; never edit those outputs.
3. **Update the hand-kept copies** listed in AGENTS.md, Content rule 3, when the fact appears
   in them:
   - the CVs: `docs/cv/cv.en.json` and `cv.sv.json`, then `npm run cv`, then read both PDFs with
     the Read tool (they must stay two pages)
   - the email signature: `docs/email-signature.html`
   - the link-preview image and the page descriptions in `src/app/layout.tsx`
4. **Run `npm run test`.** It fails if the CVs or the signature contradict the site.

## Project card images

Every project needs a 1200×630 image at `public/images/projects/<slug>.jpg`. For a live site,
capture it with a short Playwright script kept in a scratch directory (Playwright is installed
in the repo for the tests, so `import { chromium } from 'playwright'` works from the repo root):

1. Screenshot the live URL at a 1200×630 viewport once the page settles (WebGL sites render in
   headless Chromium; give them a few seconds).
2. Convert and compress with `sips -s format jpeg -s formatOptions 70` until it's roughly
   80–170 KB.
3. Look at the result with the Read tool. Retake it if it shows a cookie banner, a loader or a
   blank canvas.

No live site (Figma-only or private): ask Odai for an image instead of making a placeholder.

## Check it

1. `npm run check`, all passing: types, lint, unit tests, the production build and the browser
   tests (every page type loads, no sideways scrolling, accessibility in dark and light mode).
   The build validates the front-matter with Zod and generates `/projects/<slug>`: confirm a new
   project's page is in the build output and a removed one is gone.
2. **Look at it.** With `npm run dev` running, screenshot the changed pages at 390 px and 1440 px
   wide, in dark mode and light mode (light: set `localStorage.theme = 'light'` and reload), and
   read the screenshots yourself: long titles, tag rows and new images are what usually break.
   Stop the dev server when you're done.

## Finish

- Commit only if you were asked to, following the git rules in AGENTS.md (`content:` for copy,
  one kind of change per commit). Never push; say what is ready to push instead.
- If CLAUDE.md exists, append a short dated entry to its History section.
- If you found something the next person should know, propose it for AGENTS.md (don't edit it
  without Odai's yes).
- **Report:** what changed in portfolio.md and in each hand-kept copy, the images you captured (with paths), the
  screenshots you checked, anything left out for lack of facts, and a reminder that
  `npm run indexnow` should run after the deploy.
