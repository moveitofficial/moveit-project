'use client';

import { vars } from '@repo/styles/tokens';
import { ImagePlus } from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';

import { MAX_DETAIL_IMAGES } from './constants';
import * as styles from './DetailImageUpload.css';
import ImageThumb from './ImageThumb';
import UploadGuide from './UploadGuide';

interface Props {
  values: string[];
  onSelect: (file: File) => void;
  onRemove: (index: number) => void;
}

export default function DetailImageUpload({
  values,
  onSelect,
  onRemove,
}: Props) {
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

  const canAddMore = values.length < MAX_DETAIL_IMAGES;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {canAddMore && (
          <button
            type="button"
            onClick={handleClick}
            className={styles.placeholder}
          >
            <ImagePlus size={32} color={vars.color.gray400} />
            <p className={styles.placeholderText}>
              가로 600px 이상
              <br />
              세로 최대 3000px 이하
            </p>
          </button>
        )}
        {values.map((url, index) => (
          <ImageThumb
            key={url}
            src={url}
            onRemove={() => {
              onRemove(index);
            }}
          />
        ))}
      </div>
      <UploadGuide spec="상세 이미지: 가로 최소 600px이상 (세로 최대 3000px)" />
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
