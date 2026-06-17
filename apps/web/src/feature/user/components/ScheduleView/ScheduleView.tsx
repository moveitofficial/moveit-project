'use client';

import { ConfirmModal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { useState } from 'react';

import { ScheduleCard } from '../ScheduleCard';

import * as styles from './ScheduleView.css';

import type { OrderScheduleItem, ScheduleStatus } from '@/feature/user/api';
import type { Role } from '@/types/enums';

type ScheduleFilter = 'ALL' | ScheduleStatus;
type ScheduleSort = 'LATEST' | 'DEADLINE';

const FILTERS: { key: ScheduleFilter; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'IN_PROGRESS', label: '작업중' },
  { key: 'WORK_COMPLETED', label: '완료' },
  { key: 'DEADLINE_IMMINENT', label: '마감 임박' },
  { key: 'EXPIRED', label: '기한만료' },
];

const SORTS: { key: ScheduleSort; label: string }[] = [
  { key: 'LATEST', label: '최신순' },
  { key: 'DEADLINE', label: '마감일 순' },
];

interface Props {
  orders: OrderScheduleItem[];
  role: Role;
}

export default function ScheduleView({ orders, role }: Props) {
  const [filter, setFilter] = useState<ScheduleFilter>('ALL');
  const [sort, setSort] = useState<ScheduleSort>('LATEST');

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  // 일정 변경 요청을 보낼 대상 주문 id (다음 PR의 API 호출에 사용)
  const [requestTargetOrderId, setRequestTargetOrderId] = useState<
    string | null
  >(null);

  const openRequestModal = (orderId: string) => {
    setRequestTargetOrderId(orderId);
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setRequestTargetOrderId(null);
  };

  const handleConfirmRequest = () => {
    if (requestTargetOrderId === null) return;
    // TODO: POST /orders/{requestTargetOrderId}/schedule-change-request 연결 (다음 PR)
    closeRequestModal();
  };

  // TODO: 탭 카운트는 카운트 API로 교체 (다음 PR). 현재는 받은 목록 기준 계산.
  const countOf = (key: ScheduleFilter) =>
    key === 'ALL'
      ? orders.length
      : orders.filter((order) => order.status === key).length;

  const filtered =
    filter === 'ALL'
      ? orders
      : orders.filter((order) => order.status === filter);

  const sorted = [...filtered].sort((a, b) =>
    sort === 'LATEST'
      ? b.startDate.localeCompare(a.startDate)
      : a.endDate.localeCompare(b.endDate),
  );

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.heading}>일정관리</h1>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {FILTERS.map(({ key, label }) => {
            const text = `${label} ${countOf(key)}`;
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
          {SORTS.map(({ key, label }) => (
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

      <ul className={styles.list}>
        {sorted.map((order) => (
          <li key={order.id}>
            <ScheduleCard
              order={order}
              role={role}
              onRequestScheduleChange={() => {
                openRequestModal(order.id);
              }}
            />
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={isRequestModalOpen}
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
