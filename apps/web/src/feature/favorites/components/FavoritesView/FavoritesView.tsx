'use client';

import { Card, type CardService } from '@repo/ui/Card';
import clsx from 'clsx';
import { useState } from 'react';

import { FAVORITES_TABS, type FavoritesTabId } from '../../constants';

import * as styles from './FavoritesView.css';

import type { ServiceListItem } from '@/mocks/types';

import { ExpertCard } from '@/components/common/ExpertCard';
import { mockFavoriteExperts, mockFavoriteServices } from '@/mocks/favorites';
import { getTechStackLabel } from '@/mocks/metadata';

const DEFAULT_TECH_STACK_LABELS = ['React', 'Next.js', 'TypeScript'];

const toCardService = (service: ServiceListItem): CardService => ({
  id: service.id,
  title: service.title,
  price: service.servicePrice,
  duration: service.workDuration,
  revisionCount: service.revisionCount,
  thumbnailUrl: service.thumbnailUrl,
  expert: {
    id: service.expert.id,
    name: service.expert.name,
    companyName: service.expert.companyName,
  },
  category: {
    type: service.categoryRef.group,
    detail: service.categoryRef.category,
  },
  rating: service.rating,
  reviewCount: service.reviewCount,
  isFavorite: service.isFavorite,
});

export default function FavoritesView() {
  const [activeTab, setActiveTab] = useState<FavoritesTabId>('service');

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
            ? mockFavoriteServices.map((service) => (
                <Card
                  key={service.id}
                  service={toCardService(service)}
                  expertTechStacks={DEFAULT_TECH_STACK_LABELS}
                />
              ))
            : mockFavoriteExperts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={{
                    name: expert.name,
                    description: expert.description,
                    profileImageUrl: expert.profileImageUrl,
                    techStacks: expert.techStacks.map((name) =>
                      getTechStackLabel(name),
                    ),
                    stats: expert.stats,
                  }}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
