'use client';

import { ApiError } from '@repo/fetcher';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { MyPostCard } from '../MyPostCard';
import { MyPostEditModal } from '../MyPostEditModal';

import * as styles from './MyPostsView.css';

import type { MyPostListItem } from '@/feature/user/my-posts/api';

import {
  MY_POST_CATEGORY_FILTERS,
  MY_POST_SORT_OPTIONS,
  type MyPostCategoryFilter,
  type MyPostSort,
} from '@/feature/user/my-posts/constants';
import {
  flattenMyPostPages,
  useDeleteMyPostMutation,
  useMyPostCategoryCounts,
  useMyPostsInfinite,
} from '@/feature/user/my-posts/queries';
import { useMyUserQuery } from '@/feature/user/queries';

export default function MyPostsView() {
  const [category, setCategory] = useState<MyPostCategoryFilter>('ALL');
  const [sort, setSort] = useState<MyPostSort>('latest');
  const [editingPost, setEditingPost] = useState<MyPostListItem | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: user } = useMyUserQuery();
  const categoryCounts = useMyPostCategoryCounts();
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyPostsInfinite(category, sort);
  const { mutate: deletePost, isPending: isDeleting, variables } =
    useDeleteMyPostMutation();

  const posts = flattenMyPostPages(data?.pages);
  const deletingPostId = isDeleting ? variables : null;

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

  const handleDelete = (postId: string) => {
    if (globalThis.confirm('게시글을 삭제하시겠습니까?')) {
      deletePost(postId);
    }
  };

  const getErrorMessage = (): string | null => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (isError) {
      return '게시글 목록을 불러오지 못했습니다.';
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  const handleEdit = (post: MyPostListItem) => {
    setEditingPost(post);
  };

  return (
    <section className={styles.container}>
      <MyPostEditModal
        isOpen={editingPost !== null}
        post={editingPost}
        onClose={() => {
          setEditingPost(null);
        }}
      />
      <h1 className={styles.pageTitle}>내가 쓴 게시글</h1>

      <div className={styles.toolbar}>
        <div className={styles.categoryTabs}>
          {MY_POST_CATEGORY_FILTERS.map((filter) => {
            const isActive = filter.id === category;
            const count = categoryCounts[filter.id];

            return (
              <button
                key={filter.id}
                type="button"
                className={clsx(
                  styles.categoryTab,
                  isActive && styles.categoryTabActive,
                )}
                onClick={() => {
                  setCategory(filter.id);
                }}
              >
                {filter.label}
                {count === undefined ? '' : ` ${String(count)}`}
              </button>
            );
          })}
        </div>

        <div className={styles.sortTabs}>
          {MY_POST_SORT_OPTIONS.map((option) => {
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
        <p className={styles.statusMessage}>게시글을 불러오는 중입니다.</p>
      ) : (
        <>
          {errorMessage === null ? null : (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          {errorMessage === null && posts.length === 0 ? (
            <p className={styles.statusMessage}>작성한 게시글이 없습니다.</p>
          ) : null}
          {errorMessage === null && posts.length > 0 ? (
            <div ref={listRef} className={styles.list}>
              {posts.map((post) => (
                <MyPostCard
                  key={post.id}
                  post={post}
                  profileImageUrl={user?.profileImageUrl ?? null}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingPostId === post.id}
                />
              ))}
              {hasNextPage ? (
                <div ref={sentinelRef} className={styles.sentinel} />
              ) : null}
              {isFetchingNextPage ? (
                <p className={styles.statusMessage}>
                  게시글을 더 불러오는 중입니다.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
