import { typography } from '@repo/styles/typography';

import * as styles from './OrderSummary.css';

import type { SummaryCardColor } from '@/feature/orders/constants';
import type { Role } from '@/types/enums';

import { getOrderSummary } from '@/feature/orders/api';
import {
  CLIENT_SUMMARY_CARDS,
  EXPERT_SUMMARY_CARDS,
} from '@/feature/orders/constants';

interface Props {
  role: Role;
}

interface SummaryCardData {
  label: string;
  colorKey: SummaryCardColor;
  value: number;
}

function renderCards(cards: SummaryCardData[]) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.label} className={styles.card}>
          <p className={`${typography.f12B} ${styles.label}`}>{card.label}</p>
          <p className={styles.countRow}>
            <span
              className={`${typography.f20EB} ${styles.count[card.colorKey]}`}
            >
              {card.value}
            </span>
            <span className={`${typography.f14B} ${styles.countUnit}`}>건</span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default async function OrderSummary({ role }: Props) {
  const { data: counts } = await getOrderSummary(role);
  const cards = role === 'CLIENT' ? CLIENT_SUMMARY_CARDS : EXPERT_SUMMARY_CARDS;

  return renderCards(
    cards.map((card) => ({
      label: card.label,
      colorKey: card.colorKey,
      value: counts[card.countKey] ?? 0,
    })),
  );
}
