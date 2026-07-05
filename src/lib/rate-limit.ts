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
 * Client IP for rate limiting. On Netlify, x-nf-client-connection-ip is set
 * by the platform and cannot be spoofed by the client; x-forwarded-for is
 * only a fallback for local dev / other hosts.
 */
export function getClientIp(headers: HeaderReader): string {
  return (
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
