'use client';

import { useEffect, useRef } from 'react';

function measureScrollbarWidth(): number {
  return globalThis.window.innerWidth - document.documentElement.clientWidth;
}

export function useScrollbarCompensation(isActive: boolean) {
  const scrollbarWidthRef = useRef(measureScrollbarWidth());

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const width = scrollbarWidthRef.current;
    const previousPaddingRight = document.body.style.paddingRight;

    if (width > 0) {
      document.body.style.paddingRight = `${String(width)}px`;
    }

    return () => {
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isActive]);
}
