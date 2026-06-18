'use client';

import { vars } from '@repo/styles/tokens';
import { formatDate } from '@repo/utils';
import clsx from 'clsx';
import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  createCommunityComment,
  deleteCommunityComment,
  deleteCommunityPost,
  toggleCommunityPostLike,
  updateCommunityComment,
} from '../../api';

import * as styles from './CommunityPostDetail.css';

import type {
  CommunityCategory,
  CommunityCommentItem,
  CommunityPostDetailItem,
} from '../../types';

const COMMENT_TEXTAREA_MIN_HEIGHT = 40;

const CATEGORY_LABEL: Record<CommunityCategory, string> = {
  QUESTION: '질문',
  TIP: 'Tip · 공유',
  REVIEW: '후기',
  STUDY_GROUP: '스터디모임',
  FREE: '자유',
};

interface Props {
  post: CommunityPostDetailItem;
  comments: CommunityCommentItem[];
  currentUserId: string | null;
}

function CommentItem({
  comment,
  isMine,
  isEditing,
  editDraft,
  onEditDraftChange,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  pending,
}: {
  comment: CommunityCommentItem;
  isMine: boolean;
  isEditing: boolean;
  editDraft: string;
  onEditDraftChange: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const canSubmitEdit = editDraft.trim().length > 0;
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultilineEdit, setIsMultilineEdit] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setIsMultilineEdit(false);
      return;
    }
    const el = editTextareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = '0px';
    const contentHeight = el.scrollHeight;
    const nextHeight = Math.max(COMMENT_TEXTAREA_MIN_HEIGHT, contentHeight);
    el.style.height = `${String(nextHeight)}px`;
    setIsMultilineEdit(contentHeight > COMMENT_TEXTAREA_MIN_HEIGHT);
  }, [isEditing, editDraft]);

  return (
    <div className={styles.commentBlock}>
      <div className={styles.commentHeader}>
        {comment.authorProfileImageUrl ? (
          <Image
            src={comment.authorProfileImageUrl}
            alt={comment.authorDisplayName}
            width={20}
            height={20}
            className={styles.commentAvatar}
          />
        ) : (
          <div className={styles.commentAvatarFallback} />
        )}
        <div className={styles.commentMeta}>
          <div className={styles.commentAuthorName}>
            {comment.authorDisplayName}
          </div>
          <div className={styles.commentDate}>{formatDate(comment.createdAt)}</div>
        </div>
        {isEditing || isMine ? (
          <div className={styles.commentHeaderActions}>
            {isEditing ? (
              <button
                type="button"
                className={styles.commentHeaderAction}
                onClick={onCancelEdit}
              >
                취소
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.commentHeaderAction}
                  onClick={onStartEdit}
                >
                  수정
                </button>
                <button
                  type="button"
                  className={styles.commentHeaderAction}
                  onClick={onDelete}
                  disabled={pending}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
      <div className={styles.commentBody}>
        {isEditing ? (
          <div
            className={clsx(
              styles.commentComposer,
              isMultilineEdit && styles.commentComposerEditingMultiline,
            )}
          >
            <textarea
              ref={editTextareaRef}
              className={clsx(
                styles.commentTextarea,
                !isMultilineEdit && styles.commentTextareaSingleLine,
              )}
              placeholder="따뜻한 댓글을 남겨주세요."
              rows={1}
              value={editDraft}
              onChange={(e) => {
                onEditDraftChange(e.target.value);
              }}
            />
            <button
              type="button"
              className={styles.commentEditSubmitButton}
              disabled={!canSubmitEdit || pending}
              onClick={onSubmitEdit}
            >
              수정
            </button>
          </div>
        ) : (
          <div className={styles.commentContent}>{comment.content}</div>
        )}
      </div>
    </div>
  );
}

function getTotalCommentCount(items: CommunityCommentItem[]): number {
  return items.length;
}

export default function CommunityPostDetail({
  post,
  comments,
  currentUserId,
}: Props) {
  const totalCommentCount = getTotalCommentCount(comments);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const canSubmitComment = commentDraft.trim().length > 0;
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultilineComment, setIsMultilineComment] = useState(false);

  const router = useRouter();
  const isLoggedIn = currentUserId !== null;
  // 본인 글에는 좋아요 불가.
  const isOwnPost = currentUserId !== null && currentUserId === post.userId;
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const el = commentTextareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = '0px';
    const contentHeight = el.scrollHeight;
    const nextHeight = Math.max(COMMENT_TEXTAREA_MIN_HEIGHT, contentHeight);
    el.style.height = `${String(nextHeight)}px`;
    setIsMultilineComment(contentHeight > COMMENT_TEXTAREA_MIN_HEIGHT);
  }, [commentDraft]);

  const handleStartEdit = (comment: CommunityCommentItem) => {
    setEditingCommentId(comment.id);
    setEditDraft(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditDraft('');
  };

  // 좋아요 토글 — 낙관적 갱신 후 서버 응답으로 동기화(실패 시 되돌림).
  const handleToggleLike = () => {
    if (!isLoggedIn || isOwnPost || pending) {
      return;
    }
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount((count) => count + (next ? 1 : -1));
    void toggleCommunityPostLike(post.id)
      .then((res) => {
        setIsLiked(res.data.isLiked);
        router.refresh();
      })
      .catch(() => {
        setIsLiked(!next);
        setLikeCount((count) => count + (next ? -1 : 1));
      });
  };

  const handleSubmitComment = () => {
    if (!canSubmitComment || pending) {
      return;
    }
    setPending(true);
    void createCommunityComment(post.id, commentDraft.trim())
      .then(() => {
        setCommentDraft('');
        router.refresh();
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleSubmitEdit = () => {
    if (editingCommentId === null || editDraft.trim() === '' || pending) {
      return;
    }
    setPending(true);
    void updateCommunityComment(post.id, editingCommentId, editDraft.trim())
      .then(() => {
        handleCancelEdit();
        router.refresh();
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleDeleteComment = (commentId: string) => {
    if (pending) {
      return;
    }
    setPending(true);
    void deleteCommunityComment(post.id, commentId)
      .then(() => {
        router.refresh();
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleDeletePost = () => {
    if (pending) {
      return;
    }
    if (!globalThis.confirm('게시글을 삭제하시겠습니까?')) {
      return;
    }
    setPending(true);
    void deleteCommunityPost(post.id)
      .then(() => {
        router.push('/community');
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <div className={styles.page}>
      <section className={styles.postSection}>
        <div className={styles.postCategory}>{CATEGORY_LABEL[post.category]}</div>
        <div className={styles.postTitle}>{post.title}</div>

        <div className={styles.postMetaRow}>
          <div className={styles.postAuthorGroup}>
            <div className={styles.avatarFallback} />
            <div className={styles.postAuthorName}>
              {post.authorDisplayName}
            </div>
            <div className={styles.postDate}>{formatDate(post.createdAt)}</div>
          </div>

          <div className={styles.postMetaRight}>
            {isOwnPost ? (
              <>
                <Link
                  href={`/community/write?id=${post.id}`}
                  className={styles.postEdit}
                >
                  수정
                </Link>
                <button
                  type="button"
                  className={styles.postEdit}
                  onClick={handleDeletePost}
                  disabled={pending}
                >
                  삭제
                </button>
              </>
            ) : null}
            <button
              type="button"
              className={styles.postLike}
              onClick={handleToggleLike}
              disabled={!isLoggedIn || isOwnPost}
              aria-pressed={isLiked}
              aria-label="좋아요"
            >
              <ThumbsUp
                size={16}
                strokeWidth={3}
                color={isLiked ? vars.color.blue300 : vars.color.black300}
                fill={isLiked ? vars.color.blue300 : 'none'}
              />
              <div className={styles.postLikeCount}>{likeCount}</div>
            </button>
          </div>
        </div>

        {/* 본문은 에디터로 작성된 HTML이라 그대로 렌더한다. */}
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      <section className={styles.commentSection}>
        <div className={styles.commentTitle}>댓글 {totalCommentCount}</div>

        {isLoggedIn ? (
          <div
            className={clsx(
              styles.commentComposer,
              styles.commentComposerAtSection,
              isMultilineComment && styles.commentComposerEditingMultiline,
            )}
          >
            <textarea
              ref={commentTextareaRef}
              className={clsx(
                styles.commentTextarea,
                !isMultilineComment && styles.commentTextareaSingleLine,
              )}
              placeholder="따뜻한 댓글을 남겨주세요."
              rows={1}
              value={commentDraft}
              onChange={(e) => {
                setCommentDraft(e.target.value);
              }}
            />
            <button
              type="button"
              className={styles.commentSubmitButton}
              disabled={!canSubmitComment || pending}
              onClick={handleSubmitComment}
            >
              등록
            </button>
          </div>
        ) : null}

        <div className={styles.commentList}>
          {comments.map((comment) => (
            <article key={comment.id} className={styles.commentItem}>
              <CommentItem
                comment={comment}
                isMine={currentUserId !== null && comment.userId === currentUserId}
                isEditing={editingCommentId === comment.id}
                editDraft={editDraft}
                onEditDraftChange={setEditDraft}
                onStartEdit={() => {
                  handleStartEdit(comment);
                }}
                onCancelEdit={handleCancelEdit}
                onSubmitEdit={handleSubmitEdit}
                onDelete={() => {
                  handleDeleteComment(comment.id);
                }}
                pending={pending}
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

