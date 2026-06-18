'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import * as styles from './ServiceFaqSection.css';

import type { ServiceFaq } from '@/mocks/types';

interface Props {
  faqs: ServiceFaq[];
}

export default function ServiceFaqList({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className={styles.list}>
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div key={faq.id} className={styles.item}>
            <button
              type="button"
              className={styles.questionButton}
              aria-expanded={isOpen}
              onClick={() => {
                setOpenId(isOpen ? null : faq.id);
              }}
            >
              <span>{faq.question}</span>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen ? <p className={styles.answer}>{faq.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
