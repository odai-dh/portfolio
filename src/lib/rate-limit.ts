import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
let warnedNoConfig = false;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warnedNoConfig) {
      console.warn('rate-limit: Upstash env vars missing — rate limiting is DISABLED');
      warnedNoConfig = true;
    }
    return null;
  }
  redis ??= new Redis({ url, token });
  return redis;
}

type HeaderReader = { get(name: string): string | null };

/**
 * Client IP for rate limiting. www.odaidh.dev is proxied through Cloudflare
 * in front of Netlify, so cf-connecting-ip carries the real visitor IP;
 * x-nf-client-connection-ip would only see Cloudflare's edge (shared bucket).
 * x-forwarded-for is a fallback for local dev / other hosts. The global
 * daily cap is the spoof-proof backstop either way.
 */
export function getClientIp(headers: HeaderReader): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-nf-client-connection-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

/**
 * Increment a per-day counter and return the new count.
 * Fails open (returns 0) if Redis is unconfigured or unreachable, so an
 * outage disables limiting rather than the feature itself.
 */
export async function incrementDailyCount(scope: string, id: string): Promise<number> {
  const client = getRedis();
  if (!client) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const key = `${scope}:${id}:${today}`;
  try {
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, 86400);
    return count;
  } catch (err) {
    console.warn('rate-limit: Redis unavailable, failing open (no limits enforced)', err);
    return 0;
  }
}
