'use client';

import { OrderCard } from '@repo/ui/OrderCard';
import { RoundChip } from '@repo/ui/RoundChip';

import * as styles from './SettlementList.css';

import type { AdminSettlement } from '@/mocks';
import type { SettlementStatus } from '@/types/enums';

import { fetchMoreSettlements } from '@/features/settlements/actions';
import {
  SETTLEMENT_STATUS_ACTIONS_CONFIG,
  SETTLEMENT_STATUS_BADGE_CONFIG,
} from '@/features/settlements/constants';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  initialItems: AdminSettlement[];
  initialHasNext: boolean;
  search?: string;
  status?: SettlementStatus;
}

export default function SettlementList({
  initialItems,
  initialHasNext,
  search,
  status,
}: Props) {
  const { items, hasNext, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    (page) => fetchMoreSettlements(page, search, status),
  );

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const badge = SETTLEMENT_STATUS_BADGE_CONFIG[item.status];
        const actions = SETTLEMENT_STATUS_ACTIONS_CONFIG[item.status];

        return (
          <OrderCard
            key={item.id}
            variant="admin-settlement"
            thumbnailUrl={item.thumbnailUrl}
            badge={
              <RoundChip text={badge.text} color={badge.color} size="order" />
            }
            buyerName={item.clientName}
            sellerName={item.expertName}
            category={item.categoryName}
            title={item.serviceTitle}
            startDate={item.startDate}
            endDate={item.endDate}
            amount={item.amount}
            actions={actions}
          />
        );
      })}
      {hasNext && <div ref={sentinelRef} />}
    </div>
  );
}
