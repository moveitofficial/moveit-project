'use client';

import { vars } from '@repo/styles/tokens';
import { formatDate } from '@repo/utils';
import clsx from 'clsx';
import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import * as styles from './CommunityPostDetail.css';

import type { CommunityCategory, CommunityComment, CommunityPost } from '@/mocks/types';

const COMMENT_TEXTAREA_MIN_HEIGHT = 40;

const CATEGORY_LABEL: Record<CommunityCategory, string> = {
  QUESTION: '질문',
  TIP: 'Tip · 공유',
  REVIEW: '후기',
  STUDY_GROUP: '스터디모임',
  FREE: '자유',
};

interface Props {
  post: CommunityPost;
  comments: CommunityComment[];
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
}: {
  comment: CommunityComment;
  isMine: boolean;
  isEditing: boolean;
  editDraft: string;
  onEditDraftChange: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
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
        {comment.author.profileImageUrl ? (
          <Image
            src={comment.author.profileImageUrl}
            alt={comment.author.name}
            width={20}
            height={20}
            className={styles.commentAvatar}
          />
        ) : (
          <div className={styles.commentAvatarFallback} />
        )}
        <div className={styles.commentMeta}>
          <div className={styles.commentAuthorName}>{comment.author.name}</div>
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
                <button type="button" className={styles.commentHeaderAction}>
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
              disabled={!canSubmitEdit}
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

function getTotalCommentCount(items: CommunityComment[]): number {
  return items.reduce((acc, item) => {
    const replyCount = item.replies?.length ?? 0;
    return acc + 1 + replyCount;
  }, 0);
}

function splitContent(raw: string): { paragraphs: string[]; code?: string } {
  const re = /```[\s\S]*?```/u;
  const match = re.exec(raw);
  if (!match) {
    const paragraphs = raw
      .split(/\n{2,}/u)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    return { paragraphs };
  }

  const codeBlock = match[0];
  const matchIndex = match.index;
  const before = raw.slice(0, matchIndex);
  const after = raw.slice(matchIndex + codeBlock.length);

  const paragraphs = `${before}\n\n${after}`
    .split(/\n{2,}/u)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const code = codeBlock
    .replace(/^```/u, '')
    .replace(/```$/u, '')
    .trim();

  return { paragraphs, code };
}

export default function CommunityPostDetail({
  post,
  comments,
  currentUserId,
}: Props) {
  const { paragraphs, code } = splitContent(post.content);
  const totalCommentCount = getTotalCommentCount(comments);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const canSubmitComment = commentDraft.trim().length > 0;
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultilineComment, setIsMultilineComment] = useState(false);

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

  const handleStartEdit = (comment: CommunityComment) => {
    setEditingCommentId(comment.id);
    setEditDraft(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditDraft('');
  };

  return (
    <div className={styles.page}>
      <section className={styles.postSection}>
        <div className={styles.postCategory}>{CATEGORY_LABEL[post.category]}</div>
        <div className={styles.postTitle}>{post.title}</div>

        <div className={styles.postMetaRow}>
          <div className={styles.postAuthorGroup}>
            {post.author.profileImageUrl ? (
              <Image
                src={post.author.profileImageUrl}
                alt={post.author.name}
                width={24}
                height={24}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback} />
            )}
            <div className={styles.postAuthorName}>{post.author.name}</div>
            <div className={styles.postDate}>{formatDate(post.createdAt)}</div>
          </div>

          <div className={styles.postLike}>
            <ThumbsUp size={16} strokeWidth={3} color={vars.color.black300} />
            <div className={styles.postLikeCount}>{post.likeCount}</div>
          </div>
        </div>

        <div className={styles.postContent}>
          {paragraphs.map((p) => (
            <p key={p} className={styles.postParagraph}>
              {p}
            </p>
          ))}
          {code ? <pre className={styles.codeBlock}>{code}</pre> : null}
        </div>
      </section>

      <section className={styles.commentSection}>
        <div className={styles.commentTitle}>댓글 {totalCommentCount}</div>

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
            disabled={!canSubmitComment}
          >
            등록
          </button>
        </div>

        <div className={styles.commentList}>
          {comments.map((comment) => (
            <article key={comment.id} className={styles.commentItem}>
              <CommentItem
                comment={comment}
                isMine={currentUserId !== null && comment.author.id === currentUserId}
                isEditing={editingCommentId === comment.id}
                editDraft={editDraft}
                onEditDraftChange={setEditDraft}
                onStartEdit={() => {
                  handleStartEdit(comment);
                }}
                onCancelEdit={handleCancelEdit}
              />
              {comment.replies && comment.replies.length > 0 ? (
                <>
                  <div className={styles.commentReplyDivider} />
                  {comment.replies.map((reply, replyIndex) => (
                    <div key={reply.id}>
                      {replyIndex > 0 ? (
                        <div className={styles.commentReplyDivider} />
                      ) : null}
                      <div className={styles.commentReplyItem}>
                        <CommentItem
                          comment={reply}
                          isMine={currentUserId !== null && reply.author.id === currentUserId}
                          isEditing={editingCommentId === reply.id}
                          editDraft={editDraft}
                          onEditDraftChange={setEditDraft}
                          onStartEdit={() => {
                            handleStartEdit(reply);
                          }}
                          onCancelEdit={handleCancelEdit}
                        />
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

