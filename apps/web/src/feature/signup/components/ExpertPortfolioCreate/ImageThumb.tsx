'use client';

import { vars } from '@repo/styles/tokens';
import { X } from 'lucide-react';
import Image from 'next/image';

import * as styles from './ImageThumb.css';

interface Props {
  src: string;
  onRemove: () => void;
}

export default function ImageThumb({ src, onRemove }: Props) {
  return (
    <div className={styles.thumb}>
      <Image
        src={src}
        alt=""
        width={176}
        height={176}
        unoptimized
        className={styles.image}
      />
      <button type="button" onClick={onRemove} className={styles.removeBtn}>
        <X size={16} color={vars.color.blue300} />
      </button>
    </div>
  );
}
