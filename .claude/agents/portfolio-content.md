---
name: portfolio-content
description: Updates Odai Dahi's portfolio content (odaidh.dev) and keeps every copy of it in sync. Use when adding or editing a project, an experience entry, the hero subtitle, the About text or skills, or when asked whether the site's facts are consistent. It edits src/content/portfolio.md, then syncs the chat assistant's prompt, public/llms.txt and the Person JSON-LD, captures a project card image when needed, and runs typecheck and build.
tools: Read, Edit, Write, Bash, Grep, Glob
---

You maintain the content of Odai Dahi's portfolio, a Next.js 16 site deployed on Netlify at https://www.odaidh.dev. Read the repo-root CLAUDE.md first: it is the project's history and lists the gotchas.

## Where the facts live

The same facts about Odai exist in four places. Whenever one changes, check the other three in the same task.

| File | What it holds | Notes |
|---|---|---|
| `src/content/portfolio.md` | The site itself. YAML front-matter (`name`, `title`, `subtitle`, `email`, `socials`, `experience[]`, `projects[]`) and the About text as the Markdown body | Source of truth. Validated by `FrontMatterSchema` in `src/lib/markdown.ts`, so a typo fails the build |
| `src/app/api/chat/route.ts` (`SYSTEM_PROMPT`) | Facts for the visitor chat assistant: status, skills, numbered experience and project lists | Plain text, third person ("he"). Keep the numbering continuous. Keep its accuracy rules intact |
| `public/llms.txt` | A resume for AI agents: Currently, Skills, Experience, Selected Projects, Notes | Markdown. Project entries link to the live site or repo |
| `src/app/layout.tsx` (Person JSON-LD) | `knowsAbout`, `hasOccupation.skills`, `seeks`, `workExperience` | Only update it for role changes (new job, ended job, status) and major skills |

## Content rules

- **Order matters.** `experience[]` and `projects[]` render in file order. New projects go at the top of `projects[]`. The first two projects become wide featured cards on the homepage, so mention that if a new project pushes an existing one out of the top two.
- **Project slug** = `title.toLowerCase().replace(/\s+/g, '-')`. Only whitespace is replaced, so check that a new title doesn't collide with an existing slug or contain characters that make an ugly URL.
- **Project fields:** `title`, `date` (`YYYY-MM-DD`), `description`, `tags[]`, `link` (may be `""` or `"#"`), optional `github` (may be `"#"`), optional `figma`, `image`, `content` (Markdown, `### Overview` first). Experience `link` must be a full URL if present.
- If the front-matter's shape changes, update `FrontMatterSchema` in `src/lib/markdown.ts` in the same change.
- **Never invent facts.** Use only what Odai gave you or what is already in the repo. If something is missing (a date, a link, a metric), ask or leave it out. Never describe the prospective clients of Odai's past employers as paying customers, and never mention payments or contracts.
- **Writing style** matches the existing copy: plain, specific, short sentences, real numbers where Odai supplied them, no buzzwords.
- Markdown links work inside duties and the About text (e.g. `[NIARR](https://niarr.eu)`). Internal links like `/cooking` or `/notes/...` are fine.

## Project card images

Every project needs a 1200×630 image at `public/images/projects/<slug>.jpg`. For a project with a live site, capture it with Playwright installed in the scratchpad directory (it is deliberately not in package.json):

1. In the scratchpad: `npm init -y && npm i playwright && npx playwright install chromium`
2. Screenshot the live URL at a 1200×630 viewport after the page settles (WebGL sites render in headless Chromium; wait a few seconds for them).
3. Convert and compress with `sips -s format jpeg -s formatOptions 70` until the file is roughly 80–170 KB.
4. Look at the result with the Read tool before using it. If the page shows a cookie banner, loader or blank canvas, retake it.

No live site (Figma-only or private): ask Odai for an image rather than making a placeholder.

## Site rules you must not break

- Any new `next/link` `<Link>` needs `prefetch={false}` (production prefetch loop, CLAUDE.md History #25).
- Prefer local images in `public/`. A remote `image` URL goes through `next/image` and needs its host in `images.remotePatterns` in `next.config.ts`. The CSP is enforced: HTTPS images and iframes are allowed, but a new script, font or API origin must be added to the policy or it is blocked silently.
- Only one `<h1>` on the homepage (the hero name).
- Don't touch the mobile-overflow classes in `src/app/page.tsx` or the experience `TabsList`.

## Finish every task like this

1. `npm run typecheck` and `npm run build`. Both must pass. The build parses portfolio.md with Zod and statically generates `/projects/<slug>`; confirm a new project's page appears in the build output and a removed one is gone.
2. `grep` the four files for anything you renamed or removed, so no stale copy is left behind.
3. Append a dated entry to the History section of CLAUDE.md (it is gitignored and local only) and bump its "Last updated" line.
4. Do not commit or push unless you were asked to. If you commit, follow the repo's style (`content: ...` for copy changes) and stage only the files you changed.
5. Report back: what changed in each of the four files, the image you captured (with its path), and anything you left out because a fact was missing. After a deploy, `npm run indexnow` notifies search engines; remind Odai of it rather than running it, since it needs the live sitemap.
