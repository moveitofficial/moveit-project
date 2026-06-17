'use client';

import { Card, type CardService } from '@repo/ui/Card';
import clsx from 'clsx';
import { type Route } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import {
  type FavoriteExpertItem,
  type FavoriteServiceItem,
} from '../../api';
import { FAVORITES_TABS, type FavoritesTabId } from '../../constants';
import {
  useFavoriteExpertsQuery,
  useFavoriteServicesQuery,
} from '../../queries';

import * as styles from './FavoritesView.css';

import { ExpertCard } from '@/components/common/ExpertCard';
import { getService } from '@/feature/expertService/api';
import { buildServiceDetailHref } from '@/feature/serviceDetail/utils';
import { getTechStackLabel } from '@/mocks/metadata';

const toCardService = (service: FavoriteServiceItem): CardService => ({
  id: service.id,
  title: service.title,
  price: service.servicePrice,
  duration: service.workDuration,
  revisionCount: service.revisionCount,
  thumbnailUrl: service.thumbnailUrl,
  expert: {
    id: service.expert.id,
    name: '',
    companyName: service.expert.companyName,
  },
  // 목록 응답에 카테고리가 없고 카드에서 렌더하지도 않아 빈 값.
  category: { type: '', detail: '' },
  rating: service.rating,
  reviewCount: service.reviewCount,
  isFavorite: true,
});

const toExpertCardExpert = (expert: FavoriteExpertItem) => ({
  name: expert.companyName,
  description: '',
  profileImageUrl: expert.profileImageUrl,
  techStacks: expert.techStacks.map((name) => getTechStackLabel(name)),
  stats: { averageRating: expert.rating, totalReviews: expert.reviewCount },
});

export default function FavoritesView() {
  const [activeTab, setActiveTab] = useState<FavoritesTabId>('service');
  const [openingId, setOpeningId] = useState<string | null>(null);

  const { data: services = [] } = useFavoriteServicesQuery();
  const { data: experts = [] } = useFavoriteExpertsQuery();

  // 목록 응답에 group이 없어, 클릭 시 서비스를 조회해 그룹별 상세 경로로 새 탭에서 연다.
  // (조회가 비동기라 팝업 차단 방지로 빈 탭을 먼저 열고 이동)
  const handleOpenService = (serviceId: string) => {
    if (openingId !== null) {
      return;
    }
    const tab = globalThis.open('', '_blank');
    if (tab !== null) {
      tab.opener = null;
    }
    setOpeningId(serviceId);
    void (async () => {
      try {
        const detail = await getService(serviceId);
        const href = buildServiceDetailHref(
          serviceId,
          detail.data.categoryRef.group,
        );
        if (tab !== null) {
          tab.location.href = href;
        }
      } catch {
        tab?.close();
      } finally {
        setOpeningId(null);
      }
    })();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>나의 찜목록</h1>
      <hr className={styles.pageDivider} />

      <ul className={styles.tabList}>
        {FAVORITES_TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <li key={tab.id}>
              <button
                type="button"
                className={clsx(
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                )}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.content}>
        <div className={styles.cardGrid}>
          {activeTab === 'service'
            ? services.map((service) => (
                <Card
                  key={service.id}
                  service={toCardService(service)}
                  expertTechStacks={service.techStacks.map((name) =>
                    getTechStackLabel(name),
                  )}
                  onClick={() => {
                    handleOpenService(service.id);
                  }}
                />
              ))
            : experts.map((expert) => (
                <Link
                  key={expert.id}
                  href={`/experts/${expert.id}` as Route}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.cardLink}
                >
                  <ExpertCard expert={toExpertCardExpert(expert)} />
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
