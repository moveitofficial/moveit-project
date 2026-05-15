export function errorResponseExample(err: { message: string; status: number }) {
  return {
    success: false as const,
    message: err.message,
    error: { code: err.status },
  };
}
