import { vars } from '@repo/styles/tokens';
import { RectLabel, type RectLabelColor } from '@repo/ui/RectLabel';
import { formatDate } from '@repo/utils';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { type Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './MyPostCard.css';

import type { MyPostListItem } from '@/feature/user/my-posts/api';
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
  post: MyPostListItem;
  profileImageUrl: string | null;
  onEdit: (post: MyPostListItem) => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function MyPostCard({
  post,
  profileImageUrl,
  onEdit,
  onDelete,
  isDeleting,
}: Props) {
  const detailHref = `/community/${post.id}` as Route;

  return (
    <div className={cardStyles.wrapper}>
      <div className={cardStyles.infoContainer}>
        <RectLabel
          text={CATEGORY_LABEL[post.category]}
          color={CATEGORY_COLOR[post.category]}
        />
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              onEdit(post);
            }}
          >
            수정
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={isDeleting}
            onClick={onDelete}
          >
            삭제
          </button>
          <div className={cardStyles.dateText}>
            {formatDate(post.createdAt)}
          </div>
        </div>
      </div>
      <Link href={detailHref} className={styles.postLink}>
        <div className={cardStyles.titleText}>{post.title}</div>
        <div className={cardStyles.contentText}>{post.content}</div>
      </Link>
      <div className={cardStyles.communityInfoContainer({ flexRow: 'mypage' })}>
        <div className={cardStyles.userInfoContainer}>
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={post.authorDisplayName}
              width={16}
              height={16}
              className={cardStyles.ImageContents}
            />
          ) : (
            <div className={cardStyles.profileFallback} />
          )}
          <div className={cardStyles.userName}>{post.authorDisplayName}</div>
        </div>
        <div className={cardStyles.statsContainer}>
          <div className={cardStyles.statsItem}>
            <MessageCircle
              size={16}
              strokeWidth={3}
              color={vars.color.black300}
            />
            <div>{post.commentCount}</div>
          </div>
          <div className={cardStyles.statsItem}>
            <ThumbsUp size={16} strokeWidth={3} color={vars.color.black300} />
            <div>{post.likeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
