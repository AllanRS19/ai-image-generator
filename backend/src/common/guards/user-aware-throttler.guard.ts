import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

interface RequestLike {
  user?: { id?: string };
  ip?: string;
}

@Injectable()
export class UserAwareThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const request = req as RequestLike;

    // Authenticated requests are tracked per-user, so one person can't
    // dodge the limit by switching networks. Unauthenticated requests
    // (e.g. public feed browsing) fall back to IP.
    if (request.user?.id) {
      return Promise.resolve(`user:${request.user.id}`);
    }

    return Promise.resolve(`ip:${request.ip ?? 'unknown'}`);
  }
}
