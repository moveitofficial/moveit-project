'use client';

import { typography } from '@repo/styles/typography';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import * as styles from './FilterDropdown.css';

interface Option {
  value: string | undefined;
  label: string;
}

interface Props {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  hasReset?: boolean;
}

const RESET_OPTION: Option = { value: undefined, label: '전체' };

export default function FilterDropdown({
  options,
  value,
  onChange,
  placeholder,
  hasReset = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const allOptions: Option[] = hasReset ? [RESET_OPTION, ...options] : options;
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={`${typography.f16R} ${styles.trigger}`}
        data-active={value !== undefined}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <span>{selectedLabel ?? placeholder}</span>
        <ChevronDown size={24} className={styles.arrow} aria-hidden />
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {allOptions.map((option) => (
            <li key={option.value ?? 'all'}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`${typography.f16R} ${styles.option}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
