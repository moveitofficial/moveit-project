'use client';

import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import * as styles from './Pagination.css';

const DEFAULT_MAX_VISIBLE_PAGES = 5;

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
  ariaLabel?: string;
}

export function getTotalPages(totalCount: number, pageSize: number): number {
  if (totalCount <= 0) {
    return 1;
  }

  return Math.ceil(totalCount / pageSize);
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
): number[] {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage - half);
  let end = start + maxVisiblePages - 1;

  if (end > totalPages) {
    end = totalPages;
    start = end - maxVisiblePages + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = DEFAULT_MAX_VISIBLE_PAGES,
  className,
  ariaLabel = '페이지네이션',
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const visiblePages = getVisiblePages(
    safeCurrentPage,
    safeTotalPages,
    maxVisiblePages,
  );

  const isPrevDisabled = safeCurrentPage <= 1;
  const isNextDisabled = safeCurrentPage >= safeTotalPages;

  return (
    <nav className={clsx(styles.root, className)} aria-label={ariaLabel}>
      <button
        type="button"
        className={clsx(
          styles.navButton,
          isPrevDisabled && styles.navButtonDisabled,
        )}
        disabled={isPrevDisabled}
        aria-label="이전 페이지"
        onClick={() => {
          onPageChange(safeCurrentPage - 1);
        }}
      >
        <ChevronLeft size={12} strokeWidth={2.5} aria-hidden />
      </button>

      {visiblePages.map((page) => {
        const isActive = page === safeCurrentPage;

        return (
          <button
            key={page}
            type="button"
            className={clsx(
              styles.pageButton,
              isActive && styles.pageButtonActive,
            )}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${page}페이지`}
            onClick={() => {
              onPageChange(page);
            }}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className={clsx(
          styles.navButton,
          isNextDisabled && styles.navButtonDisabled,
        )}
        disabled={isNextDisabled}
        aria-label="다음 페이지"
        onClick={() => {
          onPageChange(safeCurrentPage + 1);
        }}
      >
        <ChevronRight size={12} strokeWidth={2.5} aria-hidden />
      </button>
    </nav>
  );
}
