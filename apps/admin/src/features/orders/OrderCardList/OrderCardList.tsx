'use client';

import { OrderCard } from '@repo/ui/OrderCard';
import { useState } from 'react';

import * as styles from './OrderCardList.css';

import type { OrderFilterParams, OrderItem } from '@/features/orders/types';
import type { NestedOrderModal } from '@/utils/constants';

import { OrderActionModal } from '@/components/common/modal/OrderActionModal';
import { fetchMoreOrders } from '@/features/orders/actions';
import {
  getNestedModalFromLabel,
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
  const { items, setItems, hasNext, isLoading, sentinelRef } =
    useInfiniteScroll(initialItems, initialHasNext, (page) =>
      fetchMoreOrders(page, tab, sort, search),
    );
  const [nestedModal, setNestedModal] = useState<NestedOrderModal | null>(null);

  function handleActionClick(label: string, orderId: string) {
    const modal = getNestedModalFromLabel(label, orderId);
    if (modal !== null) {
      setNestedModal(modal);
    }
  }

  return (
    <>
      <div className={styles.list}>
        {items.map((item) => {
          const badge = ORDER_STATUS_BADGE_CONFIG[item.status];
          const actions = ORDER_STATUS_ACTIONS_CONFIG[item.status];
          const category = formatServiceCategory(
            item.service.categoryGroup,
            item.service.categoryName,
          );
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
              actions={actions.map((action) => ({
                ...action,
                onClick: () => {
                  handleActionClick(action.label, item.id);
                },
              }))}
              onCardClick={() => {
                const base =
                  process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:3000';
                const path =
                  item.service.categoryGroup === 'IT_COACHING'
                    ? `/it-coaching/service-detail/${item.service.id}`
                    : `/project-request/service-detail/${item.service.id}`;
                window.open(`${base}${path}`, '_blank');
              }}
            />
          );
        })}
        {hasNext && <div ref={sentinelRef} />}
        {isLoading && <div className={styles.loadingRow}>불러오는 중...</div>}
      </div>

      {nestedModal !== null && (
        <OrderActionModal
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={() => {
            setNestedModal(null);
          }}
          {...(nestedModal.type === 'settlementApprove'
            ? {
                type: 'settlementApprove',
                onCompleted: () => {
                  setItems((prev) =>
                    prev.map((item) =>
                      item.id === nestedModal.orderId
                        ? { ...item, status: 'SETTLEMENT_COMPLETED' as const }
                        : item,
                    ),
                  );
                },
              }
            : nestedModal.type === 'refund'
              ? { type: 'refund', refundStatus: nestedModal.refundStatus }
              : { type: nestedModal.type })}
        />
      )}
    </>
  );
}
