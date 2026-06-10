'use client';

import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

import * as styles from './FaqCard.css';

import type { FaqItem } from '@/features/faq/types';

interface Props {
  faq: FaqItem;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: (checked: boolean) => void;
}

export default function FaqCard({
  faq,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
}: Props) {
  return (
    <li className={styles.item}>
      <div className={styles.row}>
        <label className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            className={styles.srOnly}
            checked={isSelected}
            onChange={(e) => {
              onSelect(e.target.checked);
            }}
            aria-label={`${faq.title} 선택`}
          />
          {isSelected ? (
            <span className={styles.checkIconSelected} aria-hidden="true">
              <Check size={12} strokeWidth={2.5} />
            </span>
          ) : (
            <span className={styles.checkIcon} aria-hidden="true" />
          )}
        </label>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={`faq-answer-${faq.id}`}
        >
          <span className={clsx(typography.f16R, styles.question)}>
            {faq.title}
          </span>
          <ChevronDown
            className={clsx(styles.chevron, isExpanded && styles.chevronOpen)}
            aria-hidden="true"
          />
        </button>
      </div>
      <p
        id={`faq-answer-${faq.id}`}
        className={clsx(typography.f16R, styles.answer)}
        hidden={!isExpanded}
      >
        {faq.content}
      </p>
    </li>
  );
}
