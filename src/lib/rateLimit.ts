import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { IS_DEV } from './constants';

type Unit = 'ms' | 's' | 'm' | 'h' | 'd';
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export function createRateLimiter(requests: number, duration: Duration) {
  if (IS_DEV) {
    return {
      limit: () => ({
        success: true,
        pending: Promise.resolve(),
        limit: requests,
        remaining: requests,
        reset: Date.now() + 1000,
      }),
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, duration),
    analytics: true,
    prefix: `@infiniteink/ratelimit`,
  });
}

export const emailLimiter = createRateLimiter(3, '1h');

export async function getIP() {
  const headersList = await headers();
  return headersList.get('x-forwarded-for') ?? '127.0.0.1';
}
