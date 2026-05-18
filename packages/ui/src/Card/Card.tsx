'use client';

import clsx from 'clsx';
import Image from 'next/image';

import RectLabel from '../RectLabel/RectLabel';

import * as styles from './Card.css';
import starFill from './starFill.svg';

import type { KeyboardEvent } from 'react';

export interface CardService {
  id: string;
  title: string;
  price: number;
  duration: number;
  revisionCount: number;
  thumbnailUrl: string;
  expert: {
    id: string;
    name: string;
    companyName: string;
  };
  category: {
    type: string;
    detail: string;
  };
  rating?: number;
  reviewCount?: number;
  isFavorite: boolean;
}

export interface CardProps {
  service: CardService;
  expertTechStacks: string[];
  onClick?: () => void;
  className?: string;
}

export default function Card({
  service,
  expertTechStacks,
  onClick,
  className,
}: CardProps) {
  const isClickable = Boolean(onClick);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  const imageSrc = service.thumbnailUrl;
  const imageAlt = service.title;
  const serviceTitle = service.title;
  const rating = service.rating ?? 0;
  const reviewCount = service.reviewCount ?? 0;
  const price = `${service.price.toLocaleString()}원`;
  const expertName = service.expert.name;

  return (
    <div
      className={clsx(styles.card, isClickable && styles.clickable, className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className={styles.thumbnailWrapper}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={276}
          height={176}
          className={styles.thumbnail}
        />
      </div>

      <div className={styles.content}>
        {expertTechStacks.length > 0 && (
          <div className={styles.techStackList}>
            {expertTechStacks.slice(0, 3).map((stack) => (
              <RectLabel key={stack} text={stack} color="blue50" />
            ))}
          </div>
        )}

        <h3 className={styles.title}>{serviceTitle}</h3>

        <div className={styles.ratingRow}>
          <Image src={starFill} alt="" className={styles.starIcon} />
          <span className={styles.rating}>{rating.toFixed(1)}</span>
          <span className={styles.reviewCount}>({reviewCount})</span>
        </div>

        <p className={styles.price}>{price}</p>
        <p className={styles.expertName}>{expertName}</p>
      </div>
    </div>
  );
}
