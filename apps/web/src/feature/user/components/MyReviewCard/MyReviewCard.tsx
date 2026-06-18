import { formatDate } from '@repo/utils';
import Image from 'next/image';

import { ReviewStars } from '../ReviewStars';

import * as styles from './MyReviewCard.css';

import type { MyReviewListItem } from '@/feature/user/my-reviews/api';

interface Props {
  review: MyReviewListItem;
  onEdit: (review: MyReviewListItem) => void;
  onDelete: (review: MyReviewListItem) => void;
}

function getReviewerInitials(name: string): string {
  const compact = name.replaceAll(/\s/g, '');
  if (compact.length === 0) {
    return '?';
  }
  const firstChar = compact[0] ?? '';
  if (/[가-힣]/.test(firstChar)) {
    return firstChar;
  }
  return compact.slice(0, 2).toUpperCase();
}

export default function MyReviewCard({ review, onEdit, onDelete }: Props) {
  return (
    <article className={styles.wrapper}>
      <div className={styles.topRow}>
        <div className={styles.serviceGroup}>
          {review.expert.profileImageUrl ? (
            <Image
              src={review.expert.profileImageUrl}
              alt={`${review.expert.name} 프로필`}
              width={40}
              height={40}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarFallback}>
              {getReviewerInitials(review.expert.companyName)}
            </div>
          )}
          <div className={styles.titleArea}>
            <h3 className={styles.serviceTitle}>{review.serviceTitle}</h3>
            <p className={styles.metaText}>
              판매자: {review.expert.companyName} · {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              onEdit(review);
            }}
          >
            수정
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              onDelete(review);
            }}
          >
            삭제
          </button>
          <div className={styles.ratingRow}>
            <ReviewStars value={review.rating} />
            <p className={styles.ratingValue}>{review.rating.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <p className={styles.content}>{review.content}</p>
    </article>
  );
}
