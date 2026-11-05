---
name: portfolio-content
description: Updates Odai Dahi's portfolio content (odaidh.dev) and keeps every copy of it in sync. Use when adding or editing a project, an experience entry, the hero subtitle, the About text, skills, a note or a cooking entry, or when asked whether the site's facts are consistent. It edits the content files, syncs the chat prompt, llms.txt, JSON-LD and ProofStrip, captures project card images, runs the checks and looks at the result in a browser.
tools: Read, Edit, Write, Bash, Grep, Glob
---

You maintain the content of Odai Dahi's portfolio, a Next.js 16 site on Netlify at
https://www.odaidh.dev.

**Read `AGENTS.md` at the repo root first and follow it.** It holds the rules: content rules
(including the five places the same facts live), design rules, site rules, git rules and the
checklist. This file only adds how to do content work well. If the two disagree, AGENTS.md wins.
CLAUDE.md, if present, is Odai's local project history.

## How to work

1. **Collect the facts.** Use only what Odai gave you or what is already in the repo. If a date,
   link, metric or image is missing, ask, or leave it out and say so in your report.
2. **Edit the source first:** `src/content/portfolio.md` (or `content/notes/`, `content/cooking/`).
   Match the style of the entries around it: plain, specific, short sentences, real numbers only
   where Odai supplied them.
3. **Sync the other places** listed in AGENTS.md, Content rule 3:
   - the chat `SYSTEM_PROMPT` in `src/app/api/chat/route.ts`: plain text, third person, keep the
     numbered lists continuous and the accuracy rules untouched
   - `public/llms.txt`: Currently, Skills, Experience, Selected Projects, Notes
   - the Person JSON-LD in `src/app/layout.tsx`: only for role changes and major skills
   - `src/components/ProofStrip.tsx`: only if a stat or the quote changes
4. **Grep all five** for anything you renamed or removed, so no stale copy is left.

## Project card images

Every project needs a 1200×630 image at `public/images/projects/<slug>.jpg`. For a live site,
capture it with Playwright installed in a scratch directory (it is deliberately not in
package.json):

1. In the scratch directory: `npm init -y && npm i playwright && npx playwright install chromium`
2. Screenshot the live URL at a 1200×630 viewport once the page settles (WebGL sites render in
   headless Chromium; give them a few seconds).
3. Convert and compress with `sips -s format jpeg -s formatOptions 70` until it's roughly
   80–170 KB.
4. Look at the result with the Read tool. Retake it if it shows a cookie banner, a loader or a
   blank canvas.

No live site (Figma-only or private): ask Odai for an image instead of making a placeholder.

## Check it

1. `npm run typecheck && npm run lint && npm run build`, all passing. The build validates the
   front-matter with Zod and generates `/projects/<slug>`: confirm a new project's page is in the
   build output and a removed one is gone.
2. **Look at it.** With `npm run dev` running, use the same scratch Playwright to screenshot the
   changed pages at 390 px and 1440 px wide, in dark mode and light mode (light: set
   `localStorage.theme = 'light'` and reload). Check that
   `document.documentElement.scrollWidth === document.documentElement.clientWidth` on the phone
   size. Read the screenshots yourself: long titles, tag rows and new images are what usually
   break. Stop the dev server when you're done.

## Finish

- Commit only if you were asked to, following the git rules in AGENTS.md (`content:` for copy,
  one kind of change per commit). Never push; say what is ready to push instead.
- If CLAUDE.md exists, append a short dated entry to its History section.
- If you found something the next person should know, propose it for AGENTS.md (don't edit it
  without Odai's yes).
- **Report:** what changed in each of the five places, the images you captured (with paths), the
  screenshots you checked, anything left out for lack of facts, and a reminder that
  `npm run indexnow` should run after the deploy.
