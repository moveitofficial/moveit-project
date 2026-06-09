import clsx from 'clsx';
import { Search } from 'lucide-react';
import { type FormEvent } from 'react';

import * as styles from './Search.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  searchIconClassName?: string;
  searchIconSize?: number;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = '검색어를 입력해주세요',
  className,
  inputClassName,
  searchIconClassName,
  searchIconSize = 40,
}: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={clsx(styles.wrapper, className)}>
      <input
        className={inputClassName ?? styles.inputContainer}
        placeholder={placeholder}
        aria-label="검색"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <button
        type="submit"
        className={searchIconClassName ?? styles.searchSubmitButton}
        aria-label="검색"
      >
        <Search size={searchIconSize} strokeWidth={2} aria-hidden />
      </button>
    </form>
  );
}
