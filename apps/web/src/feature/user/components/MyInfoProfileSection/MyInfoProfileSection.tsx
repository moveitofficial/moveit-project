'use client';

import Image from 'next/image';
import { type ChangeEvent, useRef } from 'react';

import * as styles from './MyInfoProfileSection.css';

interface Props {
  profileImageUrl: string | null;
  onChange: (nextUrl: string) => void;
}

export default function MyInfoProfileSection({
  profileImageUrl,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file === undefined) return;

    const nextUrl = URL.createObjectURL(file);
    onChange(nextUrl);
    event.target.value = '';
  };

  return (
    <div className={styles.root}>
      <div className={styles.avatar}>
        {profileImageUrl === null ? (
          <div className={styles.avatarFallback} aria-hidden />
        ) : (
          <Image
            src={profileImageUrl}
            alt="프로필 이미지"
            width={120}
            height={120}
            className={styles.avatarImage}
            unoptimized
          />
        )}
      </div>

      <button
        type="button"
        className={styles.changeButton}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        프로필 변경
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
    </div>
  );
}
