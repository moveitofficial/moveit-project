'use client';

import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useState } from 'react';

import * as styles from './ServiceDetailHero.css';

interface Props {
  initialFavorite: boolean;
  favoriteCount: number;
}

export default function ServiceDetailFavoriteButton({
  initialFavorite,
  favoriteCount,
}: Props) {
  const [isLiked, setIsLiked] = useState(initialFavorite);

  // 서버 카운트에 내 토글만 반영한다.
  const delta = isLiked === initialFavorite ? 0 : isLiked ? 1 : -1;
  const displayCount = favoriteCount + delta;

  return (
    <button
      type="button"
      className={clsx(
        styles.favoriteButton,
        isLiked && styles.favoriteButtonActive,
      )}
      onClick={() => {
        setIsLiked((prev) => !prev);
      }}
      aria-pressed={isLiked}
      aria-label="찜하기"
    >
      <Heart
        size={24}
        strokeWidth={2.5}
        fill={isLiked ? 'currentColor' : 'none'}
      />
      {displayCount > 0 ? (
        <span className={styles.favoriteCount}>
          {displayCount.toLocaleString()}
        </span>
      ) : null}
    </button>
  );
}
