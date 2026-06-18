'use client';

import { ApiError } from '@repo/fetcher';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { MyReviewCard } from '../MyReviewCard';
import { MyReviewEditModal } from '../MyReviewEditModal';
import { UserConfirmModal } from '../UserConfirmModal';

import * as styles from './MyReviewsView.css';

import type { MyReviewListItem } from '@/feature/user/my-reviews/api';

import {
  MY_REVIEW_SORT_OPTIONS,
  type MyReviewSort,
} from '@/feature/user/my-reviews/constants';
import {
  flattenMyReviewPages,
  useDeleteMyReviewMutation,
  useMyReviewsInfinite,
} from '@/feature/user/my-reviews/queries';

export default function MyReviewsView() {
  const [sort, setSort] = useState<MyReviewSort>('latest');
  const [editingReview, setEditingReview] = useState<MyReviewListItem | null>(null);
  const [deletingReview, setDeletingReview] = useState<MyReviewListItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, error, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyReviewsInfinite(sort);
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteMyReviewMutation();

  const reviews = flattenMyReviewPages(data?.pages);

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleDelete = () => {
    if (deletingReview === null || isDeleting) {
      return;
    }
    deleteReview(
      { orderId: deletingReview.orderId, reviewId: deletingReview.id },
      {
        onSuccess: () => {
          setDeleteError(null);
          setDeletingReview(null);
        },
        onError: (mutationError) => {
          if (mutationError instanceof ApiError) {
            setDeleteError(mutationError.message);
            return;
          }
          if (mutationError instanceof Error) {
            setDeleteError(mutationError.message);
            return;
          }
          setDeleteError('리뷰 삭제에 실패했습니다.');
        },
      },
    );
  };

  const getErrorMessage = (): string | null => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (isError) {
      return '리뷰 목록을 불러오지 못했습니다.';
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <section className={styles.container}>
      <MyReviewEditModal
        isOpen={editingReview !== null}
        review={editingReview}
        onClose={() => {
          setEditingReview(null);
        }}
      />
      <UserConfirmModal
        isOpen={deletingReview !== null}
        onClose={() => {
          setDeleteError(null);
          setDeletingReview(null);
        }}
        title="리뷰를 삭제할까요?"
        description={deleteError ?? '삭제 후에는 복구할 수 없습니다.'}
        actions={[
          {
            label: '삭제',
            variant: 'red',
            onClick: handleDelete,
          },
          {
            label: '취소',
            variant: 'white',
            onClick: () => {
              setDeleteError(null);
              setDeletingReview(null);
            },
          },
        ]}
      />

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>내가 쓴 리뷰</h1>
        <div className={styles.sortTabs}>
          {MY_REVIEW_SORT_OPTIONS.map((option) => {
            const isActive = option.id === sort;
            return (
              <button
                key={option.id}
                type="button"
                className={clsx(styles.sortTab, isActive && styles.sortTabActive)}
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
        <p className={styles.statusMessage}>리뷰를 불러오는 중입니다.</p>
      ) : (
        <>
          {errorMessage === null ? null : (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          {errorMessage === null && reviews.length === 0 ? (
            <p className={styles.statusMessage}>작성한 리뷰가 없습니다.</p>
          ) : null}
          {errorMessage === null && reviews.length > 0 ? (
            <div ref={listRef} className={styles.list}>
              {reviews.map((review) => (
                <MyReviewCard
                  key={review.id}
                  review={review}
                  onEdit={(targetReview) => {
                    setEditingReview(targetReview);
                  }}
                  onDelete={(targetReview) => {
                    setDeleteError(null);
                    setDeletingReview(targetReview);
                  }}
                />
              ))}
              {hasNextPage ? <div ref={sentinelRef} className={styles.sentinel} /> : null}
              {isFetchingNextPage ? (
                <p className={styles.statusMessage}>리뷰를 더 불러오는 중입니다.</p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
