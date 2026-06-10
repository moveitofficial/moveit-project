'use client';

import { typography } from '@repo/styles/typography';
import { ConfirmModal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import * as styles from './FaqList.css';

import type { FaqItem } from '@/features/faq/types';

import { deleteFaqs, getFaqs } from '@/features/faq/api';
import { FaqCard } from '@/features/faq/FaqCard';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';

interface Props {
  initialItems: FaqItem[];
  hasNext: boolean;
}

export default function FaqList({
  initialItems,
  hasNext: initialHasNext,
}: Props) {
  const router = useRouter();
  const { items, setItems, isLoading, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    (page) =>
      getFaqs(page).then((res) => ({
        items: res.data.items,
        hasNext: res.data.pagination.hasNext,
      })),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleDeleteClick = () => {
    if (selectedIds.size === 0) return;
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFaqs([...selectedIds]);
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
      return;
    }
    setItems((prev) => prev.filter((faq) => !selectedIds.has(faq.id)));
    setSelectedIds(new Set());
    setExpandedId(null);
    setShowModal(false);
    router.refresh();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={typography.f16EB}>IT 코칭 대표서비스</span>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                router.push('/faqs/new');
              }}
            >
              <span className={typography.f16B}>등록</span>
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={handleDeleteClick}
              disabled={selectedIds.size === 0}
            >
              <span className={typography.f16B}>삭제</span>
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <p className={clsx(typography.f16R, styles.emptyState)}>
            등록된 FAQ가 없습니다.
          </p>
        ) : (
          <ul className={styles.list}>
            {items.map((faq) => (
              <FaqCard
                key={faq.id}
                faq={faq}
                isExpanded={expandedId === faq.id}
                isSelected={selectedIds.has(faq.id)}
                onToggle={() => {
                  handleToggle(faq.id);
                }}
                onSelect={(checked: boolean) => {
                  handleSelect(faq.id, checked);
                }}
              />
            ))}
            <li ref={sentinelRef} aria-hidden="true" />
          </ul>
        )}

        {isLoading && (
          <p className={clsx(typography.f16R, styles.emptyState)}>
            불러오는 중...
          </p>
        )}
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        title="FAQ 삭제"
        description="선택하신 FAQ를 삭제하시겠습니까? 삭제 시 FAQ 알림에서도 노출이 되지 않으며, 이 작업은 되돌릴 수 없습니다."
        actions={[
          {
            label: '예',
            variant: 'blue',
            onClick: () => {
              void handleConfirmDelete();
            },
          },
          {
            label: '아니오',
            variant: 'white',
            onClick: () => {
              setShowModal(false);
            },
          },
        ]}
      />
    </div>
  );
}
