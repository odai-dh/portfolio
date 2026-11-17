import Groq from 'groq-sdk';
import { getClientIp, incrementDailyCount } from '@/lib/rate-limit';
import { getPortfolioData } from '@/lib/markdown';
import { buildChatFacts } from '@/lib/facts';
import { CHAT_MODEL } from '@/lib/chat-model';
import { validateChatRequest } from '@/lib/chat-request';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// The rules are written here; the facts are built from portfolio.md (src/lib/facts.ts), so the
// assistant can never fall out of step with the site. Built once per server start.
let systemPrompt: Promise<string> | null = null;

function getSystemPrompt(): Promise<string> {
  systemPrompt ??= getPortfolioData()
    .then((data) => {
      const first = data.name.split(' ')[0];
      return `You are a friendly assistant on ${data.name}'s personal portfolio website. Your job is to answer questions about ${first}: his background, skills, experience, and projects. Keep answers concise and conversational. If someone asks something completely unrelated to ${first}, politely redirect them. Reply in plain text only: no Markdown, no asterisks or bold, no headings, no bullet or numbered lists. Write short sentences or short paragraphs, and use commas to list things.

Rules for accuracy:
- You are an assistant, not ${first}. Always talk about him in the third person ("${first} built...", "he works with..."), never "I" or "my". The facts below are written as notes; rephrase them in the third person.
- Use only the facts below. Do not invent details, numbers, clients, responsibilities, tools, dates or credentials. If the facts below don't answer the question, say you don't have that information and suggest emailing ${data.email}.
- Never claim ${first} does or does not have a degree, certification or skill unless it is stated below. For education, only say what is listed under EDUCATION.
- Never say who paid for, used or bought ${first}'s work, and never mention payments or contracts. Brands named as prospective clients were not customers. Describe what he built, not who the customers were.

${buildChatFacts(data)}

--- PERSONALITY ---
${first} is creative, driven, and loves solving problems that mix logic and design. Outside of coding he enjoys cooking (🍋 is his signature). He's sociable, positive, and team-oriented, known for good energy in collaborative environments.`;
    })
    .catch((err) => {
      systemPrompt = null; // try again on the next request instead of caching the failure
      throw err;
    });
  return systemPrompt;
}

const RATE_LIMIT_PER_DAY = 8; // slightly above MAX_QUESTIONS to allow for retries
const GLOBAL_LIMIT_PER_DAY = 300; // all visitors combined — circuit breaker for the Groq bill

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Validation first (src/lib/chat-request.ts), so invalid requests never consume a quota
  const request = validateChatRequest(body);
  if (!request.ok) return new Response(request.error, { status: request.status });

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

  const trimmed = request.messages;

  let stream;
  try {
    stream = await groq.chat.completions.create({
      model: CHAT_MODEL,
      messages: [{ role: 'system' as const, content: await getSystemPrompt() }, ...trimmed],
      stream: true,
      max_tokens: 500,
      temperature: 0.5,
      reasoning_effort: 'none', // plain answers, no hidden thinking tokens
    });
  } catch (err) {
    console.error('Chat request failed:', err);
    return new Response('Chat is unavailable right now.', { status: 502 });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        console.error('Groq stream failed:', err);
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
