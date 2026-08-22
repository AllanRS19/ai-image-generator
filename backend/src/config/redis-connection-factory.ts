import { ConfigService } from '@nestjs/config';
import type { ConnectionOptions } from 'bullmq';

export function createRedisConnectionOptions(
  configService: ConfigService,
): ConnectionOptions {
  const redisUrl = configService.getOrThrow<string>('REDIS_URL');
  const url = new URL(redisUrl);

  return {
    host: url.hostname,
    port: Number(url.port) || 6379,
    username: url.username || undefined,
    password: url.password || undefined,
    // Upstash uses the "rediss:" scheme (double s) to signal TLS.
    tls: url.protocol === 'rediss:' ? {} : undefined,
    // Required by BullMQ's blocking connections (used internally by Workers).
    maxRetriesPerRequest: null,
  };
}
