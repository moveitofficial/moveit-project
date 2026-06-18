'use client';

import { typography } from '@repo/styles/typography';
import { OrderCard } from '@repo/ui/OrderCard';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import * as styles from './OrderCardList.css';

import type { NestedOrderModal } from '@/feature/orders/constants';
import type { OrderFilterParams, OrderItem, OrderStatus } from '@/feature/orders/types';
import type { Role } from '@/types/enums';

import { fetchMoreOrders } from '@/feature/orders/actions';
import { NestedOrderModals } from '@/feature/orders/components/modal/NestedOrderModals';
import {
  getNestedModalFromLabel,
  ORDER_STATUS_ACTIONS_CONFIG,
  ORDER_STATUS_BADGE_CONFIG,
} from '@/feature/orders/constants';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  role: Role;
  initialItems: OrderItem[];
  initialHasNext: boolean;
  params: OrderFilterParams;
}

export default function OrderCardList({
  role,
  initialItems,
  initialHasNext,
  params,
}: Props) {
  const router = useRouter();
  const { tab, sort, search } = params;
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const handleScrollRef = useCallback((node: HTMLDivElement | null) => {
    setScrollRoot(node);
  }, []);
  const { items, setItems, hasNext, isLoading, sentinelRef } =
    useInfiniteScroll(
      initialItems,
      initialHasNext,
      (page) => fetchMoreOrders(page, role, tab, sort, search),
      scrollRoot,
    );
  const [nestedModal, setNestedModal] = useState<NestedOrderModal | null>(null);

  function handleStatusUpdate(orderId: string, newStatus: OrderStatus) {
    setItems((prev) =>
      prev.map((it) => (it.id === orderId ? { ...it, status: newStatus } : it)),
    );
  }

  function handleReviewIdUpdate(orderId: string, reviewId: string | null) {
    setItems((prev) =>
      prev.map((it) => (it.id === orderId ? { ...it, reviewId } : it)),
    );
  }

  function handleActionClick(label: string, item: OrderItem) {
    if (label === '채팅') {
      if (item.chatRoomId !== null) {
        router.push(`/service/message?roomId=${item.chatRoomId}`);
      }
      return;
    }
    if (label === '일정등록') {
      // TODO: 일정등록 모달 연결
      return;
    }
    if (label === '일정변경 요청') {
      // TODO: API 확인 후 연동(알림)
      return;
    }
    if (label === '구매확정 요청') {
      // TODO: API 확인 후 연동(알림)
      return;
    }
    if (label === '환불요청') {
      setNestedModal({ type: 'requestRefund', orderId: item.id });
      return;
    }
    if (label === '리뷰보기') {
      if (item.reviewId !== null) {
        setNestedModal({
          type: 'viewReview',
          orderId: item.id,
          reviewId: item.reviewId,
        });
      }
      return;
    }
    const modal = getNestedModalFromLabel(label, item.id);
    if (modal !== null) {
      setNestedModal(modal);
    }
  }

  function close() {
    setNestedModal(null);
  }

  return (
    <>
      <div ref={handleScrollRef} className={styles.scroll}>
        {items.length === 0 && !isLoading ? (
          <p className={`${typography.f16R} ${styles.empty}`}>
            주문 내역이 없습니다.
          </p>
        ) : (
          <div className={styles.list}>
            {items.map((item) => {
              const badge = ORDER_STATUS_BADGE_CONFIG[item.status];
              const hasReview = item.reviewId !== null;
              const cardActions = ORDER_STATUS_ACTIONS_CONFIG[role][
                item.status
              ].filter((action) => {
                if (action.label === '리뷰작성') {
                  return !hasReview;
                }
                if (action.label === '리뷰보기') {
                  return hasReview;
                }
                return true;
              });
              const thumbnailUrl = item.service.images.at(0)?.imgUrl ?? null;
              return (
                <OrderCard
                  key={item.id}
                  variant="web"
                  thumbnailUrl={thumbnailUrl}
                  badge={badge}
                  title={item.service.title}
                  startDate={item.startDate}
                  endDate={item.endDate ?? undefined}
                  amount={item.totalAmount}
                  actions={cardActions.map((action) => ({
                    ...action,
                    onClick: () => {
                      handleActionClick(action.label, item);
                    },
                  }))}
                  onCardClick={() => {
                    setNestedModal({ type: 'transaction', orderId: item.id });
                  }}
                />
              );
            })}
            {hasNext && <div ref={sentinelRef} />}
            {isLoading && (
              <div className={styles.loadingRow}>불러오는 중...</div>
            )}
          </div>
        )}
      </div>

      <NestedOrderModals
        nestedModal={nestedModal}
        role={role}
        onChangeModal={setNestedModal}
        onClose={close}
        onStatusUpdate={handleStatusUpdate}
        onReviewIdUpdate={handleReviewIdUpdate}
      />
    </>
  );
}
