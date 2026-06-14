'use client';

import { vars } from '@repo/styles/tokens';
import { ImagePlus } from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';

import ImageThumb from './ImageThumb';
import * as styles from './MainImageUpload.css';
import UploadGuide from './UploadGuide';

interface Props {
  value: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export default function MainImageUpload({ value, onSelect, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file !== undefined) {
      onSelect(file);
    }
    e.target.value = '';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.slot}>
        <button
          type="button"
          onClick={handleClick}
          className={styles.placeholder}
        >
          <ImagePlus size={32} color={vars.color.gray400} />
          <p className={styles.placeholderText}>
            가로 600px 이상
            <br />
            (1:1 비율)
          </p>
        </button>
        {value !== null && <ImageThumb src={value} onRemove={onRemove} />}
      </div>
      <UploadGuide spec="메인 이미지 : 가로 최소 600px이상 (1:1 비율)" />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className={styles.hiddenInput}
      />
    </div>
  );
}
