import { Pagination } from '@repo/ui/Pagination';
import { RoundChip } from '@repo/ui/RoundChip';
import clsx from 'clsx';
import { type Route } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { COMMUNITY_FILTERS, type CommunityFilter } from '../../constants';

import * as styles from './CommunityBoard.css';

import type { CommunityPost } from '@/mocks/types';

import { CommunityCard } from '@/components/common/CommunityCard';


interface Props {
  items: CommunityPost[];
  category: CommunityFilter['id'];
  page: number;
  totalPages: number;
  canWritePost: boolean;
}

function getFilterHref(filterId: CommunityFilter['id']): Route {
  if (filterId === 'ALL') {
    return '/community';
  }

  return `/community?category=${filterId}`;
}

export default function CommunityBoard({
  items,
  category,
  page,
  totalPages,
  canWritePost,
}: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.loungeLabel}>커뮤니티 라운지</div>
          <h1 className={styles.pageTitle}>자유게시판</h1>
          <div className={styles.description}>
            IT와 관련된 모든 이야기들을 나누는 공간
          </div>
        </div>
        {canWritePost ? (
          <button type="button" className={styles.writeButton}>
            게시글 작성
          </button>
        ) : null}
      </div>

      <div className={styles.filters}>
        {COMMUNITY_FILTERS.map((filter) => {
          const isActive = filter.id === category;

          return (
            <Link
              key={filter.id}
              href={getFilterHref(filter.id)}
              className={styles.filterChipButton}
            >
              <span
                className={clsx(
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                )}
              >
                <RoundChip
                  text={filter.label}
                  size="web"
                  color={isActive ? 'blue300' : 'white'}
                />
              </span>
            </Link>
          );
        })}
      </div>

      <div className={styles.list}>
        {items.map((post) => (
          <Link key={post.id} href={`/community/${post.id}` as Route}>
            <CommunityCard post={post} />
          </Link>
        ))}
      </div>

      <Suspense fallback={null}>
        <Pagination
          className={styles.pagination}
          currentPage={page}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}
