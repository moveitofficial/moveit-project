export function param(raw: string | string[] | undefined): string | undefined {
  const v = typeof raw === 'string' ? raw : undefined;
  return v === '' ? undefined : v;
}

export function parseTab(
  raw: string | string[] | undefined,
): 'CLIENT' | 'EXPERT' {
  return param(raw) === 'EXPERT' ? 'EXPERT' : 'CLIENT';
}

export function validated<T extends string>(
  v: string | undefined,
  guard: (s: string) => s is T,
): T | undefined {
  return v !== undefined && guard(v) ? v : undefined;
}
