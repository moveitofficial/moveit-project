import starFill from '@public/Card/starFill.svg';
import { RectLabel } from '@repo/ui/RectLabel';
import Image, { type StaticImageData } from 'next/image';

import * as styles from './ExpertCard.css';

export interface ExpertCardExpert {
  name: string;
  description: string;
  profileImageUrl: string;
  techStacks: string[];
  stats: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface ExpertCardProps {
  expert: ExpertCardExpert;
  avatarImage: StaticImageData;
  className?: string;
}

export default function ExpertCard({
  expert,
  avatarImage,
  className,
}: ExpertCardProps) {
  const name = expert.name;
  const tags = expert.techStacks;
  const rating = expert.stats.averageRating;
  const reviewCount = expert.stats.totalReviews;
  const subtitle = expert.description;
  const avatarAlt = `${expert.name} 프로필 이미지`;

  return (
    <article
      className={[styles.root, className ?? ''].filter(Boolean).join(' ')}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Image src={avatarImage} alt={avatarAlt} className={styles.avatarImage} />
        </div>

        <div className={styles.headerText}>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      {tags.length > 0 ? (
        <div className={styles.tagList}>
          {tags.slice(0, 3).map((stack) => (
            <RectLabel key={stack} text={stack} color="blue50" />
          ))}
        </div>
      ) : null}

      <div className={styles.footer}>
        <Image src={starFill} alt="" className={styles.starIcon} />
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
        <span className={styles.reviewLabel}>
          리뷰 {reviewCount.toLocaleString()}
        </span>
      </div>
    </article>
  );
}
