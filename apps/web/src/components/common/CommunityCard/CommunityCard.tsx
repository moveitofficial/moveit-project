import { vars } from '@repo/styles/tokens';
import { RectLabel, type RectLabelColor } from '@repo/ui/RectLabel';
import { formatDate } from '@repo/utils';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

import * as styles from './CommunityCard.css';

import type { CommunityCategory, CommunityPost } from '@/mocks/types';

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
  post: CommunityPost;
  flexRow?: 'main' | 'mypage';
}

export default function CommunityCard({ post, flexRow }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.infoContainer}>
        <RectLabel
          text={CATEGORY_LABEL[post.category]}
          color={CATEGORY_COLOR[post.category]}
        />
        <div className={styles.dateText}>{formatDate(post.createdAt)}</div>
      </div>
      <div className={styles.titleText}>{post.title}</div>
      <div className={styles.contentText}>{post.content}</div>
      <div className={styles.communityInfoContainer({ flexRow })}>
        <div className={styles.userInfoContainer}>
          {post.author.profileImageUrl ? (
            <Image
              src={post.author.profileImageUrl}
              alt={post.author.name}
              width={16}
              height={16}
              className={styles.ImageContents}
            />
          ) : (
            <div className={styles.profileFallback} />
          )}
          <div className={styles.userName}>{post.author.name}</div>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statsItem}>
            <MessageCircle
              size={16}
              strokeWidth={3}
              color={vars.color.black300}
            />
            <div>{post.commentCount}</div>
          </div>
          <div className={styles.statsItem}>
            <ThumbsUp size={16} strokeWidth={3} color={vars.color.black300} />
            <div>{post.likeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
