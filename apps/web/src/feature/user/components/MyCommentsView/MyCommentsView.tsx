'use client';

import { ApiError } from '@repo/fetcher';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { MyCommentCard } from '../MyCommentCard';

import * as styles from './MyCommentsView.css';

import {
  MY_COMMENT_SORT_OPTIONS,
  type MyCommentSort,
} from '@/feature/user/my-comments/constants';
import {
  flattenMyCommentPages,
  useDeleteMyCommentMutation,
  useMyCommentsInfinite,
} from '@/feature/user/my-comments/queries';

export default function MyCommentsView() {
  const [sort, setSort] = useState<MyCommentSort>('latest');
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyCommentsInfinite(sort);
  const { mutate: deleteComment, isPending: isDeleting, variables } =
    useDeleteMyCommentMutation();

  const comments = flattenMyCommentPages(data?.pages);
  const deletingCommentId = isDeleting ? variables.commentId : null;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = listRef.current;
    if (!sentinel || !root || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root: null, rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = (postId: string, commentId: string) => {
    if (globalThis.confirm('댓글을 삭제하시겠습니까?')) {
      deleteComment({ postId, commentId });
    }
  };

  const getErrorMessage = (): string | null => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (isError) {
      return '댓글 목록을 불러오지 못했습니다.';
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>내가 쓴 댓글</h1>
        <div className={styles.sortTabs}>
          {MY_COMMENT_SORT_OPTIONS.map((option) => {
            const isActive = option.id === sort;

            return (
              <button
                key={option.id}
                type="button"
                className={clsx(
                  styles.sortTab,
                  isActive && styles.sortTabActive,
                )}
                onClick={() => {
                  setSort(option.id);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {isPending ? (
        <p className={styles.statusMessage}>댓글을 불러오는 중입니다.</p>
      ) : (
        <>
          {errorMessage === null ? null : (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          {errorMessage === null && comments.length === 0 ? (
            <p className={styles.statusMessage}>작성한 댓글이 없습니다.</p>
          ) : null}
          {errorMessage === null && comments.length > 0 ? (
            <div ref={listRef} className={styles.list}>
              {comments.map((comment) => (
                <MyCommentCard
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDelete}
                  isDeleting={deletingCommentId === comment.id}
                />
              ))}
              {hasNextPage ? (
                <div ref={sentinelRef} className={styles.sentinel} />
              ) : null}
              {isFetchingNextPage ? (
                <p className={styles.statusMessage}>
                  댓글을 더 불러오는 중입니다.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
