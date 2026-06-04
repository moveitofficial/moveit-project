import { Card } from '@repo/ui/Card';
import { Pagination } from '@repo/ui/Pagination';
import { RoundChip } from '@repo/ui/RoundChip';
import clsx from 'clsx';
import Link from 'next/link';
import { Suspense } from 'react';

import {
  IT_COACHING_CATEGORY_OPTIONS,
  IT_COACHING_SORT_OPTIONS,
} from '../../constants';
import { getExpertTechStackLabels, toCardService } from '../../serviceCard';
import { buildItCoachingHref, type ItCoachingSearchParams } from '../../utils';
import { ItCoachingFilterSidebar } from '../ItCoachingFilterSidebar';
import { ItCoachingSearchBar } from '../ItCoachingSearchBar';

import * as styles from './ItCoachingListing.css';

import type { ItCoachingFilterCounts, ItCoachingServiceItem } from '../../types';

interface Props {
  featured: ItCoachingServiceItem[];
  filterCounts: ItCoachingFilterCounts;
  items: ItCoachingServiceItem[];
  params: ItCoachingSearchParams;
  page: number;
  totalPages: number;
}

export default function ItCoachingListing({
  featured,
  filterCounts,
  items,
  params,
  page,
  totalPages,
}: Props) {
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroTextGroup}>
          <div className={styles.heroEyebrow}>LEVEL UP</div>
          <h1 className={styles.heroTitle}>IT코칭</h1>
          <p className={styles.heroDescription}>
            현업 시니어와 1:1 실무 코칭 · 총{' '}
            {filterCounts.totalCount.toLocaleString()}건
          </p>
        </div>
        <div className={styles.heroControls}>
          <ItCoachingSearchBar params={params} />
          <div className={styles.categoryFilters}>
            {IT_COACHING_CATEGORY_OPTIONS.map((option) => {
              const isActive = option.id === params.category;

              return (
                <Link
                  key={option.id}
                  href={buildItCoachingHref(params, {
                    category: option.id,
                    page: 1,
                  })}
                  className={styles.categoryChipButton}
                >
                  <span
                    className={clsx(
                      styles.categoryChip,
                      isActive && styles.categoryChipActive,
                    )}
                  >
                    <RoundChip
                      text={`${option.label} ${filterCounts.categoryCounts[option.id].toLocaleString()}`}
                      size="web"
                      color={isActive ? 'blue300' : 'white'}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.featuredHeader}>
          <h2 className={styles.featuredTitle}>IT코칭 대표 서비스</h2>
          <p className={styles.featuredDescription}>판매량·평점 기준 추천</p>
        </div>
        <div className={styles.featuredCardList}>
          {featured.map((service) => (
            <Card
              key={service.id}
              service={toCardService(service)}
              expertTechStacks={getExpertTechStackLabels(service.expert.id)}
            />
          ))}
        </div>
      </section>

      <section className={styles.listSection}>
        <ItCoachingFilterSidebar params={params} filterCounts={filterCounts} />

        <div className={styles.listContent}>
          <div className={styles.sortTabs}>
            {IT_COACHING_SORT_OPTIONS.map((option) => {
              const isActive = option.id === params.sort;

              return (
                <Link
                  key={option.id}
                  href={buildItCoachingHref(params, { sort: option.id, page: 1 })}
                  scroll={false}
                  className={clsx(
                    styles.sortTab,
                    isActive && styles.sortTabActive,
                  )}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          <div className={styles.cardGrid}>
            {items.map((service) => (
              <Card
                key={service.id}
                service={toCardService(service)}
                expertTechStacks={getExpertTechStackLabels(service.expert.id)}
              />
            ))}
          </div>

          <Suspense fallback={null}>
            <Pagination
              className={styles.pagination}
              currentPage={page}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
