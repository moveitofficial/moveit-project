'use client';

import { typography } from '@repo/styles/typography';
import { Modal } from '@repo/ui/Modal';
import { OrderCard } from '@repo/ui/OrderCard';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { getServiceOrderCounts, getServiceOrders } from './api';
import {
  SERVICE_ORDER_SORT_OPTIONS,
  SERVICE_ORDER_TABS,
} from './serviceOrderConstants';
import * as styles from './ServiceOrdersModal.css';

import type {
  ServiceOrderCounts,
  ServiceOrderItem,
  ServiceOrderSort,
  ServiceOrderTab,
} from './types';
import type { InfiniteScrollPage } from '@/types/api';
import type { OrderStatus } from '@/types/enums';

import { OrderActionModal } from '@/components/common/modal/OrderActionModal';
import { SearchBar } from '@/components/common/SearchBar';
import {
  type NestedOrderModal,
  getNestedModalFromLabel,
  ORDER_STATUS_ACTIONS_CONFIG,
  ORDER_STATUS_BADGE_CONFIG,
} from '@/utils/constants';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  serviceId: string;
  isOpen: boolean;
  onClose: () => void;
}


interface ListProps {
  serviceId: string;
  tab: ServiceOrderTab;
  sort: ServiceOrderSort;
  search: string;
  initialItems: ServiceOrderItem[];
  initialHasNext: boolean;
  onActionClick: (actionLabel: string, orderId: string) => void;
}

function formatCategory(groupName: string, categoryName: string) {
  return `${groupName} > ${categoryName}`;
}

function renderNestedOrderModal(
  nested: NestedOrderModal,
  onClose: () => void,
  onSettlementCompleted: () => void,
) {
  const common = { orderId: nested.orderId, isOpen: true, onClose };

  switch (nested.type) {
    case 'transaction': {
      return <OrderActionModal {...common} type="transaction" />;
    }
    case 'settlement': {
      return <OrderActionModal {...common} type="settlement" />;
    }
    case 'settlementApprove': {
      return (
        <OrderActionModal
          {...common}
          type="settlementApprove"
          onCompleted={onSettlementCompleted}
        />
      );
    }
    case 'refund': {
      return (
        <OrderActionModal
          {...common}
          type="refund"
          refundStatus={nested.refundStatus}
        />
      );
    }
  }
}

function ServiceOrderList({
  serviceId,
  tab,
  sort,
  search,
  initialItems,
  initialHasNext,
  onActionClick,
}: ListProps) {
  async function fetchMore(
    page: number,
  ): Promise<InfiniteScrollPage<ServiceOrderItem>> {
    const { data } = await getServiceOrders(serviceId, {
      tab,
      sort,
      search: search === '' ? undefined : search,
      page,
    });
    return { items: data.items, hasNext: data.hasNext };
  }

  const { items, hasNext, isLoading, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    fetchMore,
  );

  if (items.length === 0) {
    return (
      <p className={`${typography.f16R} ${styles.emptyText}`}>
        주문 내역이 없습니다.
      </p>
    );
  }

  return (
    <>
      {items.map((item) => {
        const status = item.status as OrderStatus;
        const badge = ORDER_STATUS_BADGE_CONFIG[status];
        const actions = ORDER_STATUS_ACTIONS_CONFIG[status];

        return (
          <OrderCard
            key={item.id}
            variant="admin-seller-service"
            thumbnailUrl={item.service.thumbnailUrl}
            badge={badge}
            buyerName={item.client.name ?? '-'}
            category={formatCategory(
              item.service.serviceGroupName,
              item.service.serviceCategoryName,
            )}
            title={item.service.title}
            startDate={item.startDate}
            endDate={item.endDate ?? undefined}
            amount={item.totalAmount}
            actions={actions.map((action) => ({
              ...action,
              onClick: () => {
                onActionClick(action.label, item.id);
              },
            }))}
          />
        );
      })}
      {hasNext && <div ref={sentinelRef} />}
      {isLoading && <div className={styles.loadingRow}>불러오는 중...</div>}
    </>
  );
}

export default function ServiceOrdersModal({
  serviceId,
  isOpen,
  onClose,
}: Props) {
  const [tab, setTab] = useState<ServiceOrderTab>('all');
  const [sort, setSort] = useState<ServiceOrderSort>('latest');
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState<ServiceOrderCounts | null>(null);
  const [listState, setListState] = useState<{
    items: ServiceOrderItem[];
    hasNext: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nestedModal, setNestedOrderModal] = useState<NestedOrderModal | null>(null);
  const [listVersion, setListVersion] = useState(0);
  const nestedModalRef = useRef<NestedOrderModal | null>(null);
  const countsCancelledRef = useRef(false);
  const listCancelledRef = useRef(false);

  nestedModalRef.current = nestedModal;

  useEffect(() => {
    if (!isOpen) {
      setTab('all');
      setSort('latest');
      setSearch('');
      setCounts(null);
      setListState(null);
      setNestedOrderModal(null);
      return;
    }

    countsCancelledRef.current = false;

    void (async () => {
      try {
        const { data } = await getServiceOrderCounts(serviceId);
        if (countsCancelledRef.current) return;
        setCounts(data);
      } catch {
        alert(
          '주문 통계를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
        onClose();
      }
    })();

    return () => {
      countsCancelledRef.current = true;
    };
  }, [isOpen, serviceId, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    listCancelledRef.current = false;
    setIsLoading(true);
    setListState(null);

    void (async () => {
      try {
        const { data } = await getServiceOrders(serviceId, {
          tab,
          sort,
          search: search === '' ? undefined : search,
          page: 1,
        });
        if (listCancelledRef.current) return;
        setListState({ items: data.items, hasNext: data.hasNext });
      } catch {
        alert(
          '주문 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
      } finally {
        if (!listCancelledRef.current) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      listCancelledRef.current = true;
    };
  }, [isOpen, serviceId, tab, sort, search]);

  async function refreshOrders() {
    try {
      const [ordersRes, countsRes] = await Promise.all([
        getServiceOrders(serviceId, {
          tab,
          sort,
          search: search === '' ? undefined : search,
          page: 1,
        }),
        getServiceOrderCounts(serviceId),
      ]);
      setListState({
        items: ordersRes.data.items,
        hasNext: ordersRes.data.hasNext,
      });
      setCounts(countsRes.data);
      setListVersion((prev) => prev + 1);
    } catch {
      alert(
        '주문 목록을 새로고침하는 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  }

  function handleActionClick(actionLabel: string, orderId: string) {
    const modal = getNestedModalFromLabel(actionLabel, orderId);
    if (modal !== null) {
      setNestedOrderModal(modal);
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (nestedModalRef.current !== null) {
            setNestedOrderModal(null);
            return;
          }
          onClose();
        }}
        maxWidth={876}
        closeOnBackdrop={nestedModal === null}
      >
        <div className={styles.modal}>
          <div className={styles.topRow}>
            <div className={styles.tabs}>
              {SERVICE_ORDER_TABS.map((tabItem) => {
                const count = counts?.[tabItem.key] ?? 0;
                const isActive = tab === tabItem.key;
                return (
                  <button
                    key={tabItem.key}
                    type="button"
                    className={clsx(styles.tab, isActive && styles.tabActive)}
                    onClick={() => {
                      setTab(tabItem.key);
                    }}
                  >
                    {tabItem.label} {count}
                  </button>
                );
              })}
            </div>

            <div className={styles.sortGroup}>
              {SERVICE_ORDER_SORT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={clsx(
                    styles.sortTab,
                    sort === option.key && styles.sortTabActive,
                  )}
                  onClick={() => {
                    setSort(option.key);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.searchWrapper}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="구매자 검색"
            />
          </div>

          <div className={styles.list}>
            {isLoading || listState === null ? (
              <p className={`${typography.f16R} ${styles.emptyText}`}>
                불러오는 중...
              </p>
            ) : (
              <ServiceOrderList
                key={`${tab}-${sort}-${search}-${listVersion}`}
                serviceId={serviceId}
                tab={tab}
                sort={sort}
                search={search}
                initialItems={listState.items}
                initialHasNext={listState.hasNext}
                onActionClick={handleActionClick}
              />
            )}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={onClose}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>

      {nestedModal !== null &&
        renderNestedOrderModal(
          nestedModal,
          () => {
            setNestedOrderModal(null);
          },
          () => {
            void refreshOrders();
          },
        )}
    </>
  );
}
