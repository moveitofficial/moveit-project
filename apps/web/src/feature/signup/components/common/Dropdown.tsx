'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import * as styles from './Dropdown.css';

interface Option {
  id: string;
  label: string;
}

const getOptionClassName = (
  id: string,
  selectedId: string,
  disabled: boolean,
): string => {
  if (disabled) return styles.dropdownOptionDisabled;
  if (id === selectedId) return styles.dropdownOptionSelected;
  return styles.dropdownOption;
};

interface Props {
  options: readonly Option[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  disabledIds?: readonly string[];
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  disabledIds,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.id === value)?.label ?? null;

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current !== null &&
        e.target instanceof Node &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={styles.dropdownWrapper}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
        }}
        className={
          disabled
            ? styles.dropdownTriggerDisabled
            : selectedLabel === null
              ? styles.dropdownTriggerEmpty
              : styles.dropdownTrigger
        }
      >
        <span>{selectedLabel ?? placeholder}</span>
        {!disabled && (
          <ChevronDown size={24} className={styles.dropdownChevron} />
        )}
      </button>
      {open && !disabled && (
        <ul className={styles.dropdownMenu}>
          {options.map(({ id, label }) => {
            const disabled = disabledIds?.includes(id) ?? false;
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(id);
                    setOpen(false);
                  }}
                  className={getOptionClassName(id, value, disabled)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
