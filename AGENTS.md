# odaidh.dev — rules for developers and AI agents

This file is the source of truth for how Odai Dahi's portfolio is built. Read it before changing
anything. It applies to people and to AI coding agents (Claude Code, Codex, Cursor, Copilot,
Gemini and others). If anything here conflicts with `README.md` or another document, **this file
wins**.

## Keeping this file up to date

This file should grow with the project. While you work, watch for things the next developer or
agent would need to know, for example:

- a new convention, component or pattern that others should reuse
- a decision Odai made (design, content, tooling) and the reason for it
- a gotcha that cost time (a tool quirk, a misleading error, a fragile area)
- a rule here that turned out to be wrong or outdated

When you find one, **propose it to Odai first**: say what you would add or change and why, in a
sentence or two. Only edit this file after he agrees. Keep additions short and in the right
section, and remove rules that no longer apply rather than piling up exceptions. Don't add things
that are obvious from the code, temporary, or only relevant to one task.

This file is public (the repo is public). Never write secrets, private infrastructure details or
known weak spots here.

## What this is

The personal portfolio of **Odai Dahi**, a Full Stack Developer in Stockholm, live at
**https://www.odaidh.dev**. Its job is to get Odai hired: recruiters and engineers should see real,
specific work quickly. Its personality comes from a playful Game Boy theme ("Skill·Boy", a Snake
game in the hero, a 3D mode, a Game Boy 404) and a hidden cooking journal. The tone of the copy is
plain, specific and friendly, never buzzword-heavy.

The site is also built to be read by search engines and AI agents (`public/llms.txt`, JSON-LD,
IndexNow).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS 3 with HSL colour tokens in `src/app/globals.css` · shadcn/ui on Radix
  (`src/components/ui/`) · `lucide-react` icons
- Content: Markdown + YAML (`gray-matter`, `remark`) for the main site, MDX
  (`next-mdx-remote/rsc`) for notes and cooking, all validated with Zod
- Contact form: server action with Zod and Resend · AI chat: Groq, rate-limited with Upstash Redis
- 3D: `three` + `@react-three/fiber` + `@react-three/drei`, lazy-loaded only
- Hosted on **Netlify** (`netlify.toml`, `@netlify/plugin-nextjs`), behind Cloudflare.
  `apphosting.yaml` is a leftover from the Firebase Studio prototype and unused.

## Commands

```bash
npm run dev         # http://localhost:3000
npm run typecheck   # must pass (Netlify runs it before every build)
npm run lint        # must pass with 0 errors (warnings are known, see eslint.config.mjs)
npm run build       # must pass before you commit
npm run indexnow    # after a deploy only: tells search engines about the live sitemap
```

`next build` alone does **not** fail on type errors (`ignoreBuildErrors` is on), which is why
typecheck is its own step. Run both.

## Project structure

```
src/content/portfolio.md   ★ the site's copy: front-matter (name, title, subtitle, email, socials,
                           experience[], projects[]) + the About text as the Markdown body
content/notes/*.mdx        /notes write-ups (front-matter: title, slug, date, summary, tags, draft)
content/cooking/*.mdx      /cooking journal entries (photos in public/images/cooking/)
src/app/                   routes: / , /projects/[slug] , /notes , /notes/[slug] ,
                           /cooking , /cooking/archive , /cooking/[slug] , /api/chat ,
                           sitemap.ts , robots.ts , not-found.tsx (the Game Boy 404)
src/components/            feature components; ui/ (shadcn), cooking/, three/World3D/ (3D mode)
src/lib/                   markdown.ts (portfolio.md loader + Zod schema), notes.ts, cooking.ts,
                           skillboy.ts (shared Snake data), rate-limit.ts, utils.ts
public/                    llms.txt, og-image.png, CVs, images/projects/ (1200×630 cards)
netlify/functions/         scheduled functions
scripts/indexnow.mjs       IndexNow submission
```

## Content rules (most important)

1. **Never invent facts.** No made-up projects, numbers, clients, dates, tools, quotes, degrees or
   credentials. If something is missing, ask Odai or leave it out.
2. **Copy lives in content files, not components.** Edit `src/content/portfolio.md` for the main
   site. Pages and components only lay content out. Known exceptions: the stats and quote in
   `ProofStrip.tsx` and the section headings.
3. **The same facts live in five places.** When a fact about Odai changes, check all of them in
   the same change:
   - `src/content/portfolio.md` (the source of truth)
   - the `SYSTEM_PROMPT` in `src/app/api/chat/route.ts` (third person, plain text)
   - `public/llms.txt`
   - the Person JSON-LD in `src/app/layout.tsx` (role changes and major skills only)
   - `src/components/ProofStrip.tsx` (if a stat or the quote changes)
4. **Order matters.** `experience[]` and `projects[]` render in file order, newest first. The
   first two projects become wide featured cards on the homepage.
5. **Project slugs** are `title.toLowerCase().replace(/\s+/g, '-')`: only whitespace is replaced.
   Check a new title gives a clean, unique slug. Every project needs a 1200×630 image in
   `public/images/projects/`.
6. **Never present the prospective clients of Odai's employers as paying customers**, and never
   mention payments or contracts. Describe what he built.
7. Changing the shape of the front-matter means updating its Zod schema (`markdown.ts`,
   `notes.ts` or `cooking.ts`) in the same change. A content typo fails the build on purpose.
8. Links inside duties and the About text are written as Markdown (`[NIARR](https://niarr.eu)`).

## Design rules

- **Ask Odai before large design changes** (new sections, layout changes, new visual concepts).
  For visual work, show rendered screenshots of a small real slice before building the rest:
  descriptions and ASCII mock-ups have not been enough to judge.
- **Playful touches need an obvious purpose.** The Game Boy theme is the site's personality, but
  a gimmick visitors don't understand gets cut (the Skills "cartridges" section was removed for
  that reason).
- **Theme:** dark by default (`<html class="dark">`), light mode via the toggle. Both must look
  right; check both.
- **Colours:** use the tokens through Tailwind (`bg-background`, `bg-card`, `text-foreground`,
  `text-muted-foreground`, `text-primary`, `border-border`…), never raw hex in components. To
  change a colour, change the token in `globals.css` for both `:root` and `.dark`. One accent:
  the electric blue `primary` (`#0099ff`). Exceptions: the game canvases (`SnakeGame`,
  `three/World3D`) and `/cooking`.
- **Type:** Inter for body (`font-body`), Calistoga for headings (`font-headline`), monospace for
  labels and section numbers (`font-mono`). Fonts load through `next/font` only, never from a
  CDN. Don't add fonts to the main site.
- **Sections** on the homepage are numbered (`01.` in `font-mono text-primary` before a Calistoga
  heading). The numbers are hardcoded in each section component and in `MainNav`'s `navLinks`:
  renumber both together.
- **Cards:** reuse the existing card look (`rounded-lg border border-border/50 bg-card`, lift and
  blue glow on hover) from `ProjectCard`. Don't invent new card styles.
- **Motion:** content fades in once as it scrolls into view (`FadeIn`). No scroll-jacking, no
  autoplaying sound, no looping attention-grabbers. A global `prefers-reduced-motion` rule in
  `globals.css` collapses animations; keep it, and make sure new motion still makes sense with
  it.
- **3D mode** loads only when the visitor turns it on. Only one Snake game runs at a time (the 3D
  board unmounts the 2D one). Don't use drei `<Text>` (it fetches a font from a CDN, which the CSP
  blocks); use canvas labels or self-hosted fonts.
- **`/cooking` is its own world:** cream background, Fraunces + Manrope (scoped to
  `app/cooking/layout.tsx`), no dark mode, `noindex`, not in the sitemap, reached only through
  the pot icon in the sidebar and the About text. Keep its styles in `cooking.css` and
  `components/cooking/`, and keep the main site's styles out of it.
- **Don't add:** analytics or tracking, cookie banners, popups, stock photos, a second UI or icon
  library next to shadcn/ui and lucide.

## Components

| Component | Use it for |
|---|---|
| `SectionWrapper` | Every homepage section (`id` for the nav anchor, standard spacing) |
| `FadeIn` | Scroll-in reveal, once per element |
| `ProjectCard` / `FeaturedProjectCard` | Project cards: regular, and the two wide featured ones |
| `ProjectContentCards` | A project page's `content`, split into cards by its `###` headings |
| `WebsitePreview` | Live iframe preview on a project page (sandbox rules in its comments) |
| `ProofStrip` | Stats and recommendation under the hero |
| `HeroMode` / `HeroWithGame` / `SnakeGame` | The hero, its 2D ↔ 3D switch and the Skill·Boy game |
| `three/World3D` | 3D mode (lazy-loaded) |
| `ExperienceSection` | Experience tabs (Markdown links in duties become links) |
| `ContactSection` | Contact form + links (honeypot field included) |
| `ChatWidget` | The visitor chat assistant |
| `MainNav` | Sidebar nav, section numbers, social icons, the hidden cooking link |
| `ThemeProvider` / `ThemeToggle` | Dark/light theme (hand-rolled, not `next-themes`) |
| `NotesTopBar` / `DraftBadge` | Notes pages (in `NotesChrome.tsx`) |
| `components/cooking/*` | Everything on `/cooking` |
| `components/ui/*` | shadcn primitives. Use them; don't restyle them for one page |

## Recipes

**Add a project:** add it at the top of `projects[]` in `portfolio.md`, capture a 1200×630 card
image into `public/images/projects/`, sync the other four places (see Content rule 3), run the
checklist, and check `/projects/<slug>` and the homepage card.

**Add a note:** add `content/notes/<slug>.mdx` (set `draft: true` until it's ready; drafts show
in development only), add it to the Notes section of `llms.txt` when published, link it from the
relevant project if there is one.

**Add a cooking entry:** add `content/cooking/<slug>.mdx` and its photos in
`public/images/cooking/`. It is picked up automatically.

## Site rules you must not break

- **Every `next/link` `<Link>` has `prefetch={false}`.** Prefetching loops endlessly in
  production on this host. Re-test before removing it after a Next.js or Netlify plugin upgrade.
- **One `<h1>` per page.** On the homepage it's the hero name; the mobile header name is a `<div>`
  on purpose.
- **Mobile overflow fix:** `min-w-0 w-full` on the sidebar wrapper in `src/app/page.tsx`,
  `min-w-0` on `SidebarInset`, and `overflow-x-auto` on the experience `TabsList` together stop
  the page from scrolling sideways on phones. Don't remove any of them.
- The markdown loader is imported **dynamically** by its consumers (a `gray-matter` bundling
  fix). Don't turn those into static imports.
- Next.js 16 differs from older versions. Check the bundled docs in `node_modules/next/dist/docs/`
  before using an API you are unsure of (see the block at the end of this file).

## Accessibility

- Text contrast at least 4.5:1, in dark and light mode.
- One `h1` per page; headings nest without skipping levels.
- Visible focus on every interactive element; never remove focus styles.
- Decorative elements get `aria-hidden` or empty `alt`. Real images get real `alt` text.
- Every animation respects `prefers-reduced-motion`.
- Touch targets at least 44 px; everything works with a keyboard.

## Security and privacy

- The Content-Security-Policy in `next.config.ts` is **enforced**. A new script, font, style or
  API origin must be added to it narrowly, with the reason in the commit message, or it is
  blocked silently. `'unsafe-eval'` is allowed in development only.
- Never commit secrets. `.env*` files are git-ignored.
- Contact form: keep the Zod validation, the honeypot and the rate limits. It must never say a
  message was sent when it wasn't.
- Chat: keep the question and length limits, the rate limits and the accuracy rules in the
  system prompt.
- No analytics, tracking or cookies without Odai's approval.

## SEO

- Pages export `metadata` (or `generateMetadata`) with a unique title, description and
  canonical URL.
- New public routes go in `src/app/sitemap.ts`; `/cooking` stays out and stays `noindex`.
- Keep the JSON-LD in `layout.tsx` and `llms.txt` in step with `portfolio.md`.

## Code style

- TypeScript strict, no `any`. Server components by default; `"use client"` only for browser
  state or effects.
- Match the surrounding code: Tailwind classes, `cn()` for conditional classes, small components,
  short comments that explain *why*.
- Don't add dependencies without a clear need.

## Git

- **AI agents never push.** No `git push` in any form. Pushing is done by Odai.
- Agents may stage, commit, branch, stash, diff and use other local git commands as part of their
  work, but only commit when asked.
- **Recommend a push when it makes sense:** when work is finished, committed and passes the
  checklist. Say what would be pushed and leave it to Odai.
- Never rewrite pushed history (no rebase, amend or reset of commits on `origin`), and never
  delete remote branches.
- **One commit per kind of change**, never mixed, each one building on its own. Start the message
  with the category:
  - `feat:` a new feature or a visible change to one
  - `fix:` a bug fix
  - `content:` copy, projects, experience, notes, images
  - `perf:` performance
  - `refactor:` restructuring without changing behaviour
  - `chore:` clean-up, config, tooling, dependencies
  - `docs:` `AGENTS.md`, `README.md` and other documentation
- First line: category and a short summary. Then what changed and why.

## Before you commit

- [ ] `npm run typecheck && npm run lint && npm run build` pass
- [ ] Changed pages checked at 390 px and 1440 px wide, in dark and light mode, with no sideways
      scrolling on phones
- [ ] No invented content; the five places from Content rule 3 agree
- [ ] Every new `<Link>` has `prefetch={false}`
- [ ] No new external origins (or they're in the CSP with a reason), secrets or tracking

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
