'use client';

import starFill from '@public/Card/starFill.svg';
import reviewEmpty from '@public/serviceDetail/reviewEmpty.svg';
import { formatDate } from '@repo/utils';
import clsx from 'clsx';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { fetchServiceReviews } from '../../api';
import {
  SERVICE_DETAIL_REVIEW_PAGE_SIZE,
  SERVICE_DETAIL_REVIEW_SORT_OPTIONS,
} from '../../constants';
import { maskReviewerName } from '../../utils';
import * as sectionStyles from '../ServiceDetailView/ServiceDetailView.css';

import * as styles from './ServiceReviewSection.css';

import type { ServiceDetailReviewSort } from '../../types';
import type { Review } from '@/mocks/types';

interface Props {
  serviceId: string;
  initialReviews: Review[];
  initialTotalCount: number;
  initialAverageRating: number;
  initialHasMore: boolean;
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

function ReviewerAvatar({ name, profileImageUrl }: Review['reviewer']) {
  if (profileImageUrl) {
    return (
      <Image
        src={profileImageUrl}
        alt={`${name} 프로필`}
        width={40}
        height={40}
        className={styles.avatar}
      />
    );
  }

  return (
    <div className={styles.avatarFallback}>{getReviewerInitials(name)}</div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const filledCount = Math.round(rating);

  return (
    <span className={styles.starList} aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < filledCount;

        if (isFilled) {
          return (
            <Image
              key={index}
              src={starFill}
              alt=""
              width={16}
              height={16}
              className={styles.starIcon}
            />
          );
        }

        return <Star key={index} size={16} className={styles.starIconEmpty} />;
      })}
    </span>
  );
}

export default function ServiceReviewSection({
  serviceId,
  initialReviews,
  initialTotalCount,
  initialAverageRating,
  initialHasMore,
}: Props) {
  const [sort, setSort] = useState<ServiceDetailReviewSort>('latest');
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState(initialReviews);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const loadReviews = async (
    nextPage: number,
    nextSort: ServiceDetailReviewSort,
    append: boolean,
  ) => {
    setIsLoading(true);

    try {
      const result = await fetchServiceReviews(serviceId, {
        page: nextPage,
        pageSize: SERVICE_DETAIL_REVIEW_PAGE_SIZE,
        sort: nextSort,
      });

      setReviews((current) =>
        append ? [...current, ...result.items] : result.items,
      );
      setTotalCount(result.totalCount);
      setAverageRating(result.averageRating);
      setHasMore(result.hasMore);
      setPage(nextPage);
      setSort(nextSort);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = totalCount === 0;

  if (isEmpty) {
    return (
      <section id="reviews" className={sectionStyles.section}>
        <div className={styles.header}>
          <h2 className={sectionStyles.sectionTitle}>리뷰</h2>
        </div>

        <div className={styles.emptyBox}>
          <Image
            src={reviewEmpty}
            alt=""
            width={320}
            height={168}
            className={styles.emptyIllustration}
          />
          <p className={styles.emptyText}>
            새롭게 등록된 서비스로
            <br aria-hidden />
            아직 리뷰가 없어요
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className={sectionStyles.section}>
      <div className={styles.header}>
        <h2 className={sectionStyles.sectionTitle}>
          리뷰 {totalCount.toLocaleString()}
        </h2>
        <div className={styles.sortTabs}>
          {SERVICE_DETAIL_REVIEW_SORT_OPTIONS.map((option) => {
            const isActive = sort === option.id;

            return (
              <button
                key={option.id}
                type="button"
                className={clsx(
                  styles.sortButton,
                  isActive && styles.sortButtonActive,
                )}
                disabled={isLoading}
                onClick={() => {
                  void loadReviews(1, option.id, false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.summary}>
        <Image
          src={starFill}
          alt=""
          width={16}
          height={16}
          className={styles.summaryStarIcon}
        />
        {averageRating.toFixed(1)}
      </p>

      <div className={styles.list}>
        {reviews.map((review) => (
          <article key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <ReviewerAvatar {...review.reviewer} />
              <p className={styles.reviewerName}>
                {maskReviewerName(review.reviewer.name)}
              </p>
              <div className={styles.ratingRow}>
                <RatingStars rating={review.rating} />
                <span className={styles.ratingValue}>
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <p className={styles.content}>{review.content}</p>
            <p className={styles.date}>
              작성일 : {formatDate(review.createdAt)}
            </p>
          </article>
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          className={styles.moreButton}
          disabled={isLoading}
          onClick={() => {
            void loadReviews(page + 1, sort, true);
          }}
        >
          더보기
        </button>
      ) : null}
    </section>
  );
}
