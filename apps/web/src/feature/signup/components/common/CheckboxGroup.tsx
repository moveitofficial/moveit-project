'use client';

import { RoundChip } from '@repo/ui/RoundChip';
import { Check } from 'lucide-react';

import * as styles from './CheckboxGroup.css';

interface Option {
  id: string;
  label: string;
}

interface Props {
  options: readonly Option[];
  selected: string[];
  onChange: (next: string[]) => void;
  max: number;
  showChips?: boolean;
  chipsAlign?: 'start' | 'end';
  maxHeight?: number;
}

export default function CheckboxGroup({
  options,
  selected,
  onChange,
  max,
  showChips,
  chipsAlign = 'start',
  maxHeight,
}: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
      return;
    }
    if (selected.length >= max) return;
    onChange([...selected, id]);
  };

  const remove = (id: string) => {
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <>
      <div
        className={maxHeight === undefined ? styles.box : styles.boxScrollable}
        style={maxHeight === undefined ? undefined : { maxHeight }}
      >
        {options.map(({ id, label }) => {
          const checked = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                toggle(id);
              }}
              className={styles.row}
            >
              <span
                className={checked ? styles.checkboxChecked : styles.checkbox}
              >
                {checked && <Check size={12} strokeWidth={3} color="white" />}
              </span>
              <span className={styles.label}>{label}</span>
            </button>
          );
        })}
      </div>
      <p className={styles.helperText}>최대 {max}개 까지 선택 가능합니다.</p>
      {showChips === true && selected.length > 0 && (
        <div
          className={
            chipsAlign === 'end' ? styles.chipsEnd : styles.chipsStart
          }
        >
          {selected.map((id) => {
            const option = options.find((o) => o.id === id);
            if (option === undefined) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  remove(id);
                }}
                className={styles.chipBtn}
              >
                <RoundChip
                  text={option.label}
                  size="web"
                  color="blue100"
                  close
                />
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
