import { Search } from 'lucide-react';
import { type FormEvent } from 'react';

import * as styles from './Search.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function SearchInput({ value, onChange, onSubmit }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <input
        className={styles.inputContainer}
        placeholder="검색어를 입력해주세요"
        aria-label="검색"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <Search
        size={40}
        strokeWidth={2}
        aria-hidden
        className={styles.searchIcon}
      />
    </form>
  );
}
