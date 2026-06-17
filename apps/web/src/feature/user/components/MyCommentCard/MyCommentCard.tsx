import { vars } from '@repo/styles/tokens';
import { RectLabel, type RectLabelColor } from '@repo/ui/RectLabel';
import { formatDate } from '@repo/utils';
import { ThumbsUp } from 'lucide-react';
import { type Route } from 'next';
import Link from 'next/link';

import * as styles from './MyCommentCard.css';

import type { MyCommentListItem } from '@/feature/user/my-comments/api';
import type { CommunityCategory } from '@/mocks/types';

import * as cardStyles from '@/components/common/CommunityCard/CommunityCard.css';

const CATEGORY_LABEL: Record<CommunityCategory, string> = {
  QUESTION: '질문',
  TIP: 'Tip · 공유',
  REVIEW: '후기',
  STUDY_GROUP: '스터디모임',
  FREE: '자유',
};

const CATEGORY_COLOR: Record<CommunityCategory, RectLabelColor> = {
  QUESTION: 'blue50',
  TIP: 'yellow',
  REVIEW: 'blue400',
  STUDY_GROUP: 'yellow',
  FREE: 'blue100',
};

interface Props {
  comment: MyCommentListItem;
  onEdit: (comment: MyCommentListItem) => void;
  onDelete: (postId: string, commentId: string) => void;
  isDeleting: boolean;
}

export default function MyCommentCard({
  comment,
  onEdit,
  onDelete,
  isDeleting,
}: Props) {
  const postHref = `/community/${comment.post.id}` as Route;

  return (
    <div className={cardStyles.wrapper}>
      <div className={styles.topRow}>
        <div className={styles.postMeta}>
          <RectLabel
            text={CATEGORY_LABEL[comment.post.category]}
            color={CATEGORY_COLOR[comment.post.category]}
          />
          <Link href={postHref} className={styles.postTitle}>
            {comment.post.title}
          </Link>
        </div>
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              onEdit(comment);
            }}
          >
            수정
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={isDeleting}
            onClick={() => {
              onDelete(comment.post.id, comment.id);
            }}
          >
            삭제
          </button>
          <span className={styles.dateText}>
            {formatDate(comment.createdAt)}
          </span>
        </div>
      </div>
      <p className={styles.commentContent}>{comment.content}</p>
      <div className={styles.likeRow}>
        <ThumbsUp size={16} strokeWidth={3} color={vars.color.black300} />
        <span>{comment.post.likeCount}</span>
      </div>
    </div>
  );
}
