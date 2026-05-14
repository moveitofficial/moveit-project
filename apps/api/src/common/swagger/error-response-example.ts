export function errorResponseExample(err: { message: string; code: string }) {
  return {
    success: false as const,
    message: err.message,
    error: { code: err.code, details: {} as Record<string, unknown> },
  };
}
