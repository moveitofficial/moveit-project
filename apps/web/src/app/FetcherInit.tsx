'use client';

import { configureFetcher } from '@repo/fetcher';

// web만 access 토큰 만료 시 /auth/refresh로 갱신한다 (admin은 미설정).
configureFetcher({ refreshEndpoint: '/auth/refresh' });

export default function FetcherInit() {
  return null;
}
