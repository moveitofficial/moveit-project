'use client';

import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useState } from 'react';

import { addFavoriteService, removeFavoriteService } from '../../api';

import * as styles from './ServiceDetailHero.css';


interface Props {
  serviceId: string;
  initialFavorite: boolean;
  favoriteCount: number;
}

export default function ServiceDetailFavoriteButton({
  serviceId,
  initialFavorite,
  favoriteCount,
}: Props) {
  const [isLiked, setIsLiked] = useState(initialFavorite);
  const [pending, setPending] = useState(false);

  // 서버 카운트에 내 토글만 반영한다.
  const delta = isLiked === initialFavorite ? 0 : isLiked ? 1 : -1;
  const displayCount = favoriteCount + delta;

  // 낙관적 토글 후 API 호출, 실패 시 되돌린다.
  const handleClick = () => {
    if (pending) {
      return;
    }
    const nextFavorite = !isLiked;
    setIsLiked(nextFavorite);
    setPending(true);
    void (async () => {
      try {
        await (nextFavorite
          ? addFavoriteService(serviceId)
          : removeFavoriteService(serviceId));
      } catch {
        setIsLiked(!nextFavorite);
      } finally {
        setPending(false);
      }
    })();
  };

  return (
    <button
      type="button"
      className={clsx(
        styles.favoriteButton,
        isLiked && styles.favoriteButtonActive,
      )}
      onClick={handleClick}
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
