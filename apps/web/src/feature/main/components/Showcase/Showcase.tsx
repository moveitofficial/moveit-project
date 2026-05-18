import { ChevronRight } from 'lucide-react';
import { type Route } from 'next';
import Link from 'next/link';

import * as styles from './Showcase.css';

import type { ReactNode } from 'react';

interface ShowcaseProps {
  title: string;
  description?: string;
  viewAllHref?: Route;
  spacing?: 'default' | 'none';
  children: ReactNode;
}

export default function Showcase({
  title,
  description,
  viewAllHref,
  spacing,
  children,
}: ShowcaseProps) {
  return (
    <section className={styles.wrapper({ spacing })}>
      <div className={styles.titleGroup({ hasDescription: !!description })}>
        <div>
          <div className={styles.title}>{title}</div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>

        {viewAllHref && (
          <Link href={viewAllHref} className={styles.linkGroup}>
            <div>전체보기</div>
            <ChevronRight size={16} strokeWidth={2} aria-hidden />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
