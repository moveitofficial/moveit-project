'use client';

import { useEffect, useRef, useState } from 'react';

import type { InfiniteScrollPage } from '@/types/api';

export function useInfiniteScroll<T>(
  initialItems: T[],
  initialHasNext: boolean,
  fetchMore: (page: number) => Promise<InfiniteScrollPage<T>>,
) {
  const [items, setItems] = useState(initialItems);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [isLoading, setIsLoading] = useState(false);
  const [sentinelEl, setSentinelEl] = useState<Element | null>(null);
  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!sentinelEl) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);

      const nextPage = pageRef.current + 1;

      void fetchMore(nextPage)
        .then(({ items: newItems, hasNext: newHasNext }) => {
          setItems((prev) => [...prev, ...newItems]);
          setHasNext(newHasNext);
          pageRef.current = nextPage;
        })
        .catch((error: unknown) => {
          console.error('Failed to fetch more items:', error);
        })
        .finally(() => {
          isLoadingRef.current = false;
          setIsLoading(false);
        });
    });

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [sentinelEl, fetchMore]);

  const sentinelRef = (el: Element | null) => {
    setSentinelEl(el);
  };

  return { items, hasNext, isLoading, sentinelRef };
}
