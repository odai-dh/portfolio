// Upstash deletes free databases after 14 days without commands, and the rate limiter
// only talks to Redis when someone uses chat or the contact form. This weekly ping
// keeps the database active so the limits (lib/rate-limit.ts) don't silently switch off.
export default async () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn('redis-keepalive: Upstash env vars missing, skipping');
    return;
  }

  const res = await fetch(`${url}/set/keepalive/${Date.now()}/EX/1209600`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error(`redis-keepalive: Upstash responded ${res.status}`);
    return;
  }
  console.log('redis-keepalive: ok');
};

export const config = { schedule: '@weekly' };
