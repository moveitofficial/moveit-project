import { Card } from '@repo/ui/Card';
import { Pagination } from '@repo/ui/Pagination';
import { RoundChip } from '@repo/ui/RoundChip';
import clsx from 'clsx';
import Link from 'next/link';
import { Suspense } from 'react';

import { SERVICE_LIST_SORT_OPTIONS } from '../../constants';
import { getExpertTechStackLabels, toCardService } from '../../serviceCard';
import { buildServiceListHref } from '../../utils';
import { FilterSidebar } from '../FilterSidebar';
import { SearchBar } from '../SearchBar';

import * as styles from './ServiceList.css';

import type {
  ServiceListConfig,
  ServiceListFilterCounts,
  ServiceListSearchParams,
  ServiceListServiceItem,
} from '../../types';

interface Props {
  config: ServiceListConfig;
  featured: ServiceListServiceItem[];
  filterCounts: ServiceListFilterCounts;
  items: ServiceListServiceItem[];
  params: ServiceListSearchParams;
  page: number;
  totalPages: number;
}

export default function ServiceList({
  config,
  featured,
  filterCounts,
  items,
  params,
  page,
  totalPages,
}: Props) {
  const heroDescriptionWeight =
    config.heroDescriptionVariant === 'regular' ? 'regular' : 'bold';

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroTextGroup}>
          <div className={styles.heroEyebrow}>{config.hero.eyebrow}</div>
          <h1 className={styles.heroTitle}>{config.hero.title}</h1>
          <p
            className={styles.heroDescription({ weight: heroDescriptionWeight })}
          >
            {config.hero.descriptionPrefix} · 총{' '}
            {filterCounts.totalCount.toLocaleString()}건
          </p>
        </div>
        <div className={styles.heroControls}>
          <SearchBar config={config} params={params} />
          <div className={styles.categoryFilters}>
            {config.categoryOptions.map((option) => {
              const isActive = option.id === params.category;

              return (
                <Link
                  key={option.id}
                  href={buildServiceListHref(config, params, {
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

      <section className={styles.featuredBand}>
        <div className={styles.featuredSection}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.featuredTitle}>{config.featured.title}</h2>
            <p className={styles.featuredDescription}>
              {config.featured.description}
            </p>
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
        </div>
      </section>

      <section className={styles.listSection}>
        <FilterSidebar
          config={config}
          params={params}
          filterCounts={filterCounts}
        />

        <div className={styles.listContent}>
          <div className={styles.sortTabs}>
            {SERVICE_LIST_SORT_OPTIONS.map((option) => {
              const isActive = option.id === params.sort;

              return (
                <Link
                  key={option.id}
                  href={buildServiceListHref(config, params, {
                    sort: option.id,
                    page: 1,
                  })}
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
