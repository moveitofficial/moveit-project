import { typography } from '@repo/styles/typography';

import * as styles from './SalesStatsSummary.css';

import type { SalesSummary } from '@/features/statistics/types';

import { toManwon } from '@/utils/formatCurrency';

type CountColor = keyof typeof styles.countColor;

interface CardDef {
  label: string;
  color: CountColor;
  unit: string;
  getValue: (s: SalesSummary) => string;
}

const CARDS: CardDef[] = [
  {
    label: '총 거래액',
    color: 'blue300',
    unit: '원',
    getValue: (s) => toManwon(s.totalTransactionAmount),
  },
  {
    label: '거래 건수',
    color: 'red200',
    unit: '건',
    getValue: (s) => s.totalTransactionCount.toLocaleString(),
  },
  {
    label: '평균 거래액',
    color: 'yellow100',
    unit: '원',
    getValue: (s) => toManwon(s.averageTransactionAmount),
  },
  {
    label: '최고금액',
    color: 'blue300',
    unit: '원',
    getValue: (s) => toManwon(s.maxTransactionAmount),
  },
];

interface Props {
  summary: SalesSummary;
}

export default function SalesStatsSummary({ summary }: Props) {
  return (
    <div className={styles.grid}>
      {CARDS.map((card) => (
        <div key={card.label} className={styles.card}>
          <p className={`${typography.f14B} ${styles.label}`}>{card.label}</p>
          <p className={styles.countRow}>
            <span
              className={`${typography.f32EB} ${styles.countColor[card.color]}`}
            >
              {card.getValue(summary)}
            </span>
            <span className={`${typography.f12R} ${styles.unit}`}>
              {card.unit}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
