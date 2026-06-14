'use client';

import { useEffect } from 'react';

import { usePageHeaderStore } from '@/stores/page-header-store';

interface Props {
  breadcrumb: string[];
  title: string;
}

export default function PageHeaderOverride({ breadcrumb, title }: Props) {
  useEffect(() => {
    usePageHeaderStore.getState().setOverride({ breadcrumb, title });
    return () => {
      usePageHeaderStore.getState().setOverride(null);
    };
  }, [breadcrumb, title]);

  return null;
}
