'use client';

import { useEffect } from 'react';

// 회원가입 후 정보 입력 단계에서 브라우저 뒤로가기 차단
export function useBlockBack(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    globalThis.history.pushState(null, '', globalThis.location.href);
    const handlePopState = () => {
      globalThis.history.pushState(null, '', globalThis.location.href);
    };
    globalThis.addEventListener('popstate', handlePopState);
    return () => {
      globalThis.removeEventListener('popstate', handlePopState);
    };
  }, [enabled]);
}
