'use client';

import { OrderCard } from '@repo/ui/OrderCard';

import * as styles from './OrderCardList.css';

import type { OrderFilterParams, OrderItem } from '@/features/orders/types';

import { fetchMoreOrders } from '@/features/orders/actions';
import {
  ORDER_STATUS_ACTIONS_CONFIG,
  ORDER_STATUS_BADGE_CONFIG,
} from '@/utils/constants';
import { formatServiceCategory } from '@/utils/formatServiceCategory';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  initialItems: OrderItem[];
  initialHasNext: boolean;
  params: OrderFilterParams;
}

export default function OrderCardList({
  initialItems,
  initialHasNext,
  params,
}: Props) {
  const { tab, sort, search } = params;
  const { items, hasNext, isLoading, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    (page) => fetchMoreOrders(page, tab, sort, search),
  );

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const badge = ORDER_STATUS_BADGE_CONFIG[item.status];
        const actions = ORDER_STATUS_ACTIONS_CONFIG[item.status];
        const category = formatServiceCategory(item.service.categoryGroup, item.service.categoryName);
        return (
          <OrderCard
            key={item.id}
            variant="admin-orders"
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
      {isLoading && (
        <div className={styles.loadingRow}>불러오는 중...</div>
      )}
    </div>
  );
}
