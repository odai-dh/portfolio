import Groq from 'groq-sdk';
import { CHAT_MODEL } from '@/lib/chat-model';
import { pingRedis } from '@/lib/rate-limit';

// GET /api/health: are the chat's outside services working? Used by the daily live check
// (.github/workflows/live-check.yml). It answers only with which checks passed, never with
// details. Results are reused for ten minutes, so calling it often costs nothing.
// - chatModel: Groq still lists the chat's model (listing models costs no tokens). The list is
//   used because retrieving one model 404s for ids with a slash, such as qwen/qwen3.8-27b.
// - rateLimit: Upstash Redis answers (without it the chat and contact limits switch off)
export const dynamic = 'force-dynamic';

type Checks = { chatModel: boolean; rateLimit: boolean };
let cached: { at: number; checks: Checks } | null = null;
const TEN_MINUTES = 10 * 60 * 1000;

async function chatModelAvailable(): Promise<boolean> {
  if (!process.env.GROQ_API_KEY) return false;
  try {
    const { data } = await new Groq({ apiKey: process.env.GROQ_API_KEY }).models.list({ timeout: 8000 });
    return data.some((model) => model.id === CHAT_MODEL);
  } catch {
    return false;
  }
}

export async function GET() {
  if (!cached || Date.now() - cached.at > TEN_MINUTES) {
    const [chatModel, rateLimit] = await Promise.all([chatModelAvailable(), pingRedis()]);
    cached = { at: Date.now(), checks: { chatModel, rateLimit } };
  }
  const ok = Object.values(cached.checks).every(Boolean);
  return Response.json(
    { ok, checks: cached.checks },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
