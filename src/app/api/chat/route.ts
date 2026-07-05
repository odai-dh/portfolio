import Groq from 'groq-sdk';
import { getClientIp, incrementDailyCount } from '@/lib/rate-limit';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a friendly assistant on Odai Dahi's personal portfolio website. Your job is to answer questions about Odai — his background, skills, experience, and projects. Keep answers concise and conversational. If someone asks something completely unrelated to Odai, politely redirect them.

--- ABOUT ODAI ---
Name: Odai Dahi
Role: Full Stack Developer with a frontend focus
Status: Currently freelancing and open to new full-time opportunities
Email: odai@odaidh.dev
GitHub: https://github.com/odai-dh
LinkedIn: https://www.linkedin.com/in/odai-dahi/

--- SKILLS ---
Frontend: HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS, SwiftUI, Framer Motion
Backend: Node.js, Express, MongoDB, SQL, REST APIs
Tools: Firebase, Chart.js, Clerk, HubSpot API, Cloudflare R2, shadcn/ui, Zod, react-hook-form, Figma, Git
Also has UX/UI design experience and 3D/VR web development (Three.js, A-Frame, WebXR)

--- EXPERIENCE ---
1. Aeoflo (Frontend Developer Intern, Sep 2025 – Apr 2026)
   - Sole frontend developer at a venture-backed AI analytics startup
   - Built the entire company website from scratch (Next.js, TypeScript, Tailwind CSS) — 20,000+ lines of code with scroll animations, dark mode, HubSpot booking integration, and a blog system
   - Built a multi-client analytics dashboard used by real brands: Oatly, Stiga, Billhop, Norstedts, CRA-YON, X-peng
   - Refactored a ~4,000-line monolithic Shopify app into modular React components
   - Integrated HubSpot API, Cloudflare R2, Clerk auth
   - Recommendation from Antoine Abribat (Co-Founder & COO): "He grew from a talented intern into a dependable developer capable of shipping production-ready features independently."

2. Sportly (Frontend Developer Intern, Jun 2025 – Oct 2025)
   - Built frontend for a sports tech platform using React, TypeScript, Tailwind CSS
   - Built responsive UI components, collaborated in agile team with developers and designers

3. RAW Comedy Club (Event Assistant, Sep 2024 – Dec 2025)
   - Supporting event operations, assisting artists, coordinating logistics

4. Max Burgers (Assistant Restaurant Manager, Mar 2020 – Aug 2024)
   - Managed daily operations, supervised staff, recruited and trained team members
   - Financial reporting, inventory control, staff scheduling

5. Stockholm Stad (IT Support Assistant, 2018–2019)
   - Technical support for staff and students, hardware/software troubleshooting

--- PROJECTS ---
1. Aeoflo — Next.js dashboard platform for an AI analytics startup (real production work)
2. Death Calendar — iOS app (SwiftUI) that visualizes your entire life as a dot grid to encourage intentional living
3. BuzzyJeopardy — Real-time multiplayer Jeopardy game with AI-generated questions (Next.js, Firebase, Google Gemini)
4. Jeopardy AI — Earlier Jeopardy clone with Hugging Face AI question generation
5. E-commerce Platform — Full-stack shop with Next.js frontend and Node.js/Express/MongoDB backend
6. Litorina School Website — Collaborative team project built for a real school client (React, Tailwind, Vite)
7. StremVibe — Movie database app using TMDB API
8. SpaceToon 3D — VR solar system experience with Three.js, A-Frame, WebXR
9. myHealth ID — UX/UI Figma prototype for a digital healthcare app
10. HyperKart — Mario Kart–inspired tournament website (team hackathon)
11. Naiman — Upcoming startup project, details not yet public

--- EDUCATION ---
Hyper Island — Code & Collaborate program (where he studied before graduating)

--- PERSONALITY ---
Odai is creative, driven, and loves solving problems that mix logic and design. Outside of coding he enjoys cooking (🍋 is his signature). He's sociable, positive, and team-oriented — known for good energy in collaborative environments.`;

const MAX_QUESTIONS = 5;
const MAX_MESSAGE_LENGTH = 400;
const RATE_LIMIT_PER_DAY = 8; // slightly above MAX_QUESTIONS to allow for retries
const GLOBAL_LIMIT_PER_DAY = 300; // all visitors combined — circuit breaker for the Groq bill

export async function POST(req: Request) {
  let messages: { role: 'user' | 'assistant'; content: string }[];
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Validate structure
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('Bad request', { status: 400 });
  }

  // Server-side question limit — count how many user turns are in the history
  const userTurns = messages.filter(m => m.role === 'user').length;
  if (userTurns > MAX_QUESTIONS) {
    return new Response('Question limit exceeded.', { status: 429 });
  }

  // Reject oversized messages
  const oversized = messages.some(
    m => typeof m.content !== 'string' || m.content.length > MAX_MESSAGE_LENGTH
  );
  if (oversized) {
    return new Response('Message too long.', { status: 400 });
  }

  // Only allow known roles
  const invalidRole = messages.some(m => m.role !== 'user' && m.role !== 'assistant');
  if (invalidRole) {
    return new Response('Bad request', { status: 400 });
  }

  // Quotas come last so invalid requests never consume them
  const ip = getClientIp(req.headers);
  const ipCount = await incrementDailyCount('chat', ip);
  if (ipCount > RATE_LIMIT_PER_DAY) {
    return new Response('Daily limit reached.', { status: 429 });
  }

  const globalCount = await incrementDailyCount('chat-global', 'all');
  if (globalCount > GLOBAL_LIMIT_PER_DAY) {
    return new Response('Daily limit reached.', { status: 429 });
  }

  const trimmed = messages.slice(-MAX_QUESTIONS * 2);

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system' as const, content: SYSTEM_PROMPT }, ...trimmed],
    stream: true,
    max_tokens: 400,
    temperature: 0.7,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
