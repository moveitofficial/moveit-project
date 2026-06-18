'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useUpdateParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams.toString());

    if (value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    router.push(`?${next.toString()}`);
  };
}
