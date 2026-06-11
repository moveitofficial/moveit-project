'use client';

import { OrderCard } from '@repo/ui/OrderCard';
import { useState } from 'react';

import * as styles from './SettlementList.css';

import type {
  SettlementFilterParams,
  SettlementItem,
} from '@/features/settlements/types';
import type { NestedOrderModal } from '@/utils/constants';

import { OrderActionModal } from '@/components/common/modal/OrderActionModal';
import { fetchMoreSettlements } from '@/features/settlements/actions';
import {
  SETTLEMENT_STATUS_ACTIONS_CONFIG,
  SETTLEMENT_STATUS_BADGE_CONFIG,
} from '@/features/settlements/constants';
import { getNestedModalFromLabel } from '@/utils/constants';
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
  const { items, setItems, hasNext, isLoading, sentinelRef } =
    useInfiniteScroll(initialItems, initialHasNext, (page) =>
      fetchMoreSettlements(page, search, status),
    );
  const [nestedModal, setNestedModal] = useState<Exclude<
    NestedOrderModal,
    { type: 'refund' }
  > | null>(null);

  function handleActionClick(label: string, orderId: string) {
    const modal = getNestedModalFromLabel(label, orderId);
    if (modal !== null && modal.type !== 'refund') {
      setNestedModal(modal);
    }
  }

  return (
    <>
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
              actions={actions.map((action) => ({
                ...action,
                onClick: () => {
                  handleActionClick(action.label, item.id);
                },
              }))}
              // TODO: 주문 상세 페이지 URL 확정 후 item.id 연결
              onCardClick={() => {
                window.open('http://localhost:3000/', '_blank');
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
            : { type: nestedModal.type })}
        />
      )}
    </>
  );
}
