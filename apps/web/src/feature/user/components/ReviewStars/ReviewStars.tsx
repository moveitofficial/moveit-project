import starFill from '@public/Card/starFill.svg';
import clsx from 'clsx';
import { Star } from 'lucide-react';
import Image from 'next/image';

import * as styles from './ReviewStars.css';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
}

export default function ReviewStars({ value, onChange, max = 5 }: Props) {
  return (
    <span className={styles.root} aria-hidden>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            className={clsx(
              styles.starButton,
              onChange === undefined && styles.starButtonReadonly,
            )}
            onClick={() => {
              onChange?.(starValue);
            }}
            disabled={onChange === undefined}
          >
            {isFilled ? (
              <Image src={starFill} alt="" width={16} height={16} className={styles.icon} />
            ) : (
              <Star size={16} className={clsx(styles.icon, styles.iconEmpty)} />
            )}
          </button>
        );
      })}
    </span>
  );
}
