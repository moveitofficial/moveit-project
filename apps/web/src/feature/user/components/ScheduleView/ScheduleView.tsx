'use client';

import { ApiError } from '@repo/fetcher';
import { ConfirmModal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ScheduleCard } from '../ScheduleCard';

import * as styles from './ScheduleView.css';

import type {
  OrderScheduleItem,
  ScheduleOrderListItem,
  ScheduleSort,
} from '@/feature/user/my-schedule/api';

import {
  SCHEDULE_FILTERS,
  SCHEDULE_SORT_OPTIONS,
  type ScheduleFilter,
} from '@/feature/user/my-schedule/constants';
import {
  flattenSchedulePages,
  useRequestScheduleChangeMutation,
  useScheduleCounts,
  useSchedulesInfinite,
} from '@/feature/user/my-schedule/queries';
import { useMyUserQuery } from '@/feature/user/queries';

function toCardItem(item: ScheduleOrderListItem): OrderScheduleItem {
  return {
    id: item.id,
    title: item.service.title,
    status: item.status,
    amount: item.totalAmount,
    startDate: item.startDate,
    endDate: item.endDate ?? item.startDate,
    hasScheduleChangeRequest: item.hasScheduleChangeRequest,
  };
}

export default function ScheduleView() {
  const router = useRouter();
  const { data: user } = useMyUserQuery();
  const role = user?.role ?? 'CLIENT';
  const as = role === 'EXPERT' ? 'expert' : 'client';

  const [filter, setFilter] = useState<ScheduleFilter>('ALL');
  const [sort, setSort] = useState<ScheduleSort>('latest');
  const [requestTargetOrderId, setRequestTargetOrderId] = useState<
    string | null
  >(null);

  const statuses =
    SCHEDULE_FILTERS.find((option) => option.key === filter)?.statuses ?? [];

  const { data: counts } = useScheduleCounts(as);
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSchedulesInfinite(as, statuses, sort);
  const { mutate: requestScheduleChange } =
    useRequestScheduleChangeMutation();

  const orders = flattenSchedulePages(data?.pages);
  const sentinelRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const closeRequestModal = () => {
    setRequestTargetOrderId(null);
  };

  const handleConfirmRequest = () => {
    if (requestTargetOrderId === null) {
      return;
    }
    const target = orders.find((order) => order.id === requestTargetOrderId);
    requestScheduleChange({
      orderId: requestTargetOrderId,
      roomId: target?.chatRoomId ?? undefined,
    });
    closeRequestModal();
  };

  const errorMessage = isError
    ? error instanceof ApiError
      ? error.message
      : '일정 목록을 불러오지 못했습니다.'
    : null;

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.heading}>일정관리</h1>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {SCHEDULE_FILTERS.map(({ key, label, countKey }) => {
            const count = counts?.[countKey];
            const text = count === undefined ? label : `${label} ${count}`;
            return (
              <button
                key={key}
                type="button"
                data-label={text}
                className={clsx(
                  styles.filterButton,
                  filter === key && styles.filterButtonActive,
                )}
                onClick={() => {
                  setFilter(key);
                }}
              >
                {text}
              </button>
            );
          })}
        </div>

        <div className={styles.sorts}>
          {SCHEDULE_SORT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              data-label={label}
              className={clsx(
                styles.sortButton,
                sort === key && styles.sortButtonActive,
              )}
              onClick={() => {
                setSort(key);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <p className={styles.statusMessage}>일정을 불러오는 중입니다.</p>
      ) : (
        <>
          {errorMessage === null ? null : (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          {errorMessage === null && orders.length === 0 ? (
            <p className={styles.statusMessage}>해당하는 일정이 없습니다.</p>
          ) : null}
          {errorMessage === null && orders.length > 0 ? (
            <ul className={styles.list}>
              {orders.map((order) => (
                <li key={order.id}>
                  <ScheduleCard
                    order={toCardItem(order)}
                    role={role}
                    onChat={() => {
                      if (order.chatRoomId) {
                        router.push(
                          `/service/message?roomId=${order.chatRoomId}`,
                        );
                      }
                    }}
                    onRequestScheduleChange={() => {
                      setRequestTargetOrderId(order.id);
                    }}
                  />
                </li>
              ))}
              {hasNextPage ? (
                <li ref={sentinelRef} className={styles.sentinel} />
              ) : null}
              {isFetchingNextPage ? (
                <p className={styles.statusMessage}>
                  일정을 더 불러오는 중입니다.
                </p>
              ) : null}
            </ul>
          ) : null}
        </>
      )}

      <ConfirmModal
        isOpen={requestTargetOrderId !== null}
        onClose={closeRequestModal}
        title="일정 변경 요청"
        description={
          <>
            의뢰인에게 일정 변경 요청을
            <br />
            하시겠습니까?
          </>
        }
        actions={[
          { label: '예', variant: 'blue', onClick: handleConfirmRequest },
          { label: '아니오', variant: 'white', onClick: closeRequestModal },
        ]}
      />
    </section>
  );
}
