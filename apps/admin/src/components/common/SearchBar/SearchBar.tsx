'use client';

import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';

import * as styles from './SearchBar.css';

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value = '',
  onChange,
  placeholder,
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 500);
  };

  return (
    <div className={styles.wrapper}>
      <Search size={24} aria-hidden className={styles.icon} />
      <input
        className={clsx(typography.f16R, styles.input)}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="검색"
      />
    </div>
  );
}
