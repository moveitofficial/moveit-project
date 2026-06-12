'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { SERVICE_DESCRIPTION_COLLAPSED_MAX_HEIGHT } from '../../constants';

import * as styles from './ServiceDescriptionSection.css';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ServiceDescriptionExpandable({ children }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = contentRef.current;

    if (element === null) {
      return;
    }

    const update = () => {
      setNeedsCollapse(
        element.scrollHeight > SERVICE_DESCRIPTION_COLLAPSED_MAX_HEIGHT,
      );
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const isCollapsed = needsCollapse && !expanded;

  return (
    <div className={styles.expandableRoot}>
      <div
        ref={contentRef}
        className={styles.expandableContent({ collapsed: isCollapsed })}
      >
        {children}
        {isCollapsed ? <div className={styles.expandableFade} aria-hidden /> : null}
      </div>

      {needsCollapse ? (
        <button
          type="button"
          className={styles.expandableButton}
          onClick={() => {
            setExpanded((value) => !value);
          }}
        >
          {expanded ? '접기' : '더보기'}
          {expanded ? (
            <ChevronUp size={16} strokeWidth={2.5} aria-hidden />
          ) : (
            <ChevronDown size={16} strokeWidth={2.5} aria-hidden />
          )}
        </button>
      ) : null}
    </div>
  );
}
