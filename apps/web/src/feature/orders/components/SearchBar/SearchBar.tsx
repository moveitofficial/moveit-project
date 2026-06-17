'use client';

import { useEffect, useRef, useState } from 'react';

import * as styles from './SearchBar.css';

import { SearchInput } from '@/components/common/SearchInput';

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

  const flush = (v: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onChange(v);
  };

  const handleChange = (v: string) => {
    setInputValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(v);
    }, 500);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <SearchInput
      className={styles.wrapper}
      inputClassName={styles.input}
      searchIconClassName={styles.icon}
      searchIconSize={20}
      value={inputValue}
      onChange={handleChange}
      onSubmit={() => {
        flush(inputValue);
      }}
      placeholder={placeholder}
    />
  );
}
