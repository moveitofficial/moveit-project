const IS_SERVER = typeof document === 'undefined';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(
  /\/$/,
  '',
);

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function baseFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(
      response.status,
      error.message ?? '요청 중 오류가 발생했습니다.'
    );
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

// refresh는 쓰는 앱만 주입한다. 미설정(예: admin)이면 refresh를 시도하지 않는다.
let refreshEndpoint: string | null = null;

export function configureFetcher(options: { refreshEndpoint?: string }): void {
  refreshEndpoint = options.refreshEndpoint ?? null;
}

// 동시 401 요청이 refresh를 한 번만 호출하도록 공유
let refreshPromise: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  if (refreshEndpoint === null) return Promise.resolve(false);

  const endpoint = refreshEndpoint;
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(BASE_URL + endpoint, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function authFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  if (IS_SERVER) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
    return baseFetch<T>(url, {
      ...options,
      headers: {
        Cookie: cookieHeader,
        ...(options.headers as Record<string, string> | undefined),
      },
    });
  }

  try {
    return await baseFetch<T>(url, { ...options, credentials: 'include' });
  } catch (error) {
    // access 토큰 만료(401) → refresh 후 1회 재시도. 인증 엔드포인트는 제외.
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      !url.startsWith('/auth/')
    ) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return baseFetch<T>(url, { ...options, credentials: 'include' });
      }
    }
    throw error;
  }
}

async function publicFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  return baseFetch<T>(url, options);
}

export const api = {
  get: <T>(url: string) => authFetch<T>(url, { method: 'GET' }),
  post: <T>(url: string, data: unknown) =>
    authFetch<T>(url, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(url: string, data: unknown) =>
    authFetch<T>(url, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(url: string, data?: unknown) =>
    authFetch<T>(url, {
      method: 'DELETE',
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
};

export const publicApi = {
  get: <T>(url: string) => publicFetch<T>(url, { method: 'GET' }),
  post: <T>(url: string, data: unknown) =>
    publicFetch<T>(url, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(url: string, data: unknown) =>
    publicFetch<T>(url, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(url: string, data?: unknown) =>
    publicFetch<T>(url, {
      method: 'DELETE',
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
};
