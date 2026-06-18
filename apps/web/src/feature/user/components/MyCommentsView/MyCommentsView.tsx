'use client';

import { ApiError } from '@repo/fetcher';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { MyCommentCard } from '../MyCommentCard';
import { MyCommentEditModal } from '../MyCommentEditModal';
import { UserConfirmModal } from '../UserConfirmModal';

import * as styles from './MyCommentsView.css';

import type { MyCommentListItem } from '@/feature/user/my-comments/api';

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
  const [editingComment, setEditingComment] = useState<MyCommentListItem | null>(
    null,
  );
  const [deletingComment, setDeletingComment] = useState<MyCommentListItem | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
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

  const handleDelete = () => {
    if (deletingComment === null || isDeleting) {
      return;
    }

    deleteComment(
      { postId: deletingComment.post.id, commentId: deletingComment.id },
      {
        onSuccess: () => {
          setDeleteError(null);
          setDeletingComment(null);
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
          setDeleteError('댓글 삭제에 실패했습니다.');
        },
      },
    );
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

  const handleEdit = (comment: MyCommentListItem) => {
    setEditingComment(comment);
  };

  return (
    <section className={styles.container}>
      <MyCommentEditModal
        isOpen={editingComment !== null}
        comment={editingComment}
        onClose={() => {
          setEditingComment(null);
        }}
      />
      <UserConfirmModal
        isOpen={deletingComment !== null}
        onClose={() => {
          setDeleteError(null);
          setDeletingComment(null);
        }}
        title="댓글을 삭제할까요?"
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
              setDeletingComment(null);
            },
          },
        ]}
      />
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
                  onEdit={handleEdit}
                  onDelete={() => {
                    setDeleteError(null);
                    setDeletingComment(comment);
                  }}
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
