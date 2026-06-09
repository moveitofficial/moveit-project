'use client';

import { OrderCard } from '@repo/ui/OrderCard';

import * as styles from './SettlementList.css';

import type {
  SettlementFilterParams,
  SettlementItem,
} from '@/features/settlements/types';

import { fetchMoreSettlements } from '@/features/settlements/actions';
import {
  SETTLEMENT_STATUS_ACTIONS_CONFIG,
  SETTLEMENT_STATUS_BADGE_CONFIG,
} from '@/features/settlements/constants';
import { formatServiceCategory } from '@/utils/formatServiceCategory';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  initialItems: SettlementItem[];
  initialHasNext: boolean;
  params: SettlementFilterParams;
}

export default function SettlementList({
  initialItems,
  initialHasNext,
  params,
}: Props) {
  const { search, status } = params;
  const { items, hasNext, isLoading, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    (page) => fetchMoreSettlements(page, search, status),
  );

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const badge = SETTLEMENT_STATUS_BADGE_CONFIG[item.status];
        const actions = SETTLEMENT_STATUS_ACTIONS_CONFIG[item.status];
        const category = formatServiceCategory(
          item.service.categoryGroup,
          item.service.categoryName,
        );
        return (
          <OrderCard
            key={item.id}
            variant="admin-settlement"
            thumbnailUrl={item.service.thumbnailUrl}
            badge={badge}
            buyerName={item.client.name ?? ''}
            sellerName={item.expert.businessName ?? ''}
            category={category}
            title={item.service.title}
            startDate={item.startDate}
            endDate={item.endDate ?? undefined}
            amount={item.totalAmount}
            actions={actions}
          />
        );
      })}
      {hasNext && <div ref={sentinelRef} />}
      {isLoading && <div className={styles.loadingRow}>불러오는 중...</div>}
    </div>
  );
}
