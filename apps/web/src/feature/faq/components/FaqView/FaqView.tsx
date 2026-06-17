'use client';

import clsx from 'clsx';
import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

import * as styles from './FaqView.css';

import type { FaqItem } from '../../constants';

interface Props {
  faqs: FaqItem[];
}

export default function FaqView({ faqs }: Props) {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const keyword = query.trim().toLowerCase();
  const items =
    keyword === ''
      ? faqs
      : faqs.filter(
          (item) =>
            item.question.toLowerCase().includes(keyword) ||
            item.answer.toLowerCase().includes(keyword),
        );

  return (
    <div className={styles.page}>
      <div className={styles.label}>FAQ</div>
      <h1 className={styles.title}>무엇을 도와드릴까요?</h1>
      <p className={styles.subtitle}>자주 묻는 질문들을 모았어요</p>

      <div className={styles.searchBox}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="궁금한 내용을 검색해보세요"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <Search size={20} className={styles.searchIcon} aria-hidden />
      </div>

      <ul className={styles.list}>
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <li key={item.id} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                aria-expanded={isOpen}
                onClick={() => {
                  setOpenId(isOpen ? null : item.id);
                }}
              >
                <span className={styles.questionText}>{item.question}</span>
                <ChevronDown
                  size={20}
                  className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
                  aria-hidden
                />
              </button>
              {isOpen ? <p className={styles.answer}>{item.answer}</p> : null}
            </li>
          );
        })}
        {items.length === 0 ? (
          <li className={styles.empty}>검색 결과가 없습니다.</li>
        ) : null}
      </ul>
    </div>
  );
}
