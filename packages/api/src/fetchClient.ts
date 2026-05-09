const IS_SERVER = typeof document === 'undefined';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

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

  return baseFetch<T>(url, {
    ...options,
    credentials: 'include',
  });
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
