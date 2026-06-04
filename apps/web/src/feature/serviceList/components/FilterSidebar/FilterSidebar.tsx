'use client';

import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  SERVICE_LIST_PRICE_FILTERS,
  SERVICE_LIST_REGION_FILTERS,
  SERVICE_LIST_REGION_VISIBLE_COUNT,
  SERVICE_LIST_TECH_STACK_FILTERS,
  SERVICE_LIST_TECH_STACK_VISIBLE_COUNT,
} from '../../constants';
import { buildServiceListHref } from '../../utils';

import * as styles from './FilterSidebar.css';

import type {
  ServiceListConfig,
  ServiceListFilterCounts,
  ServiceListSearchParams,
} from '../../types';
import type { Region, TechStackName } from '@/mocks/types';

interface Props {
  config: ServiceListConfig;
  params: ServiceListSearchParams;
  filterCounts: ServiceListFilterCounts;
}

function toggleCsvValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

interface ListToggleButtonProps {
  expanded: boolean;
  onClick: () => void;
}

function ListToggleButton({ expanded, onClick }: ListToggleButtonProps) {
  return (
    <button
      type="button"
      className={
        expanded ? styles.listToggleButtonCollapse : styles.listToggleButtonExpand
      }
      onClick={onClick}
    >
      {expanded ? '접기' : '더보기'}
      {expanded ? (
        <ChevronUp size={16} strokeWidth={2.5} aria-hidden />
      ) : (
        <ChevronDown size={16} strokeWidth={2.5} aria-hidden />
      )}
    </button>
  );
}

function SectionChevron({ expanded }: { expanded: boolean }) {
  return expanded ? (
    <ChevronUp size={20} strokeWidth={2} className={styles.sectionChevronIcon} aria-hidden />
  ) : (
    <ChevronDown size={20} strokeWidth={2} className={styles.sectionChevronIcon} aria-hidden />
  );
}

export default function FilterSidebar({ config, params, filterCounts }: Props) {
  const router = useRouter();

  const [techExpanded, setTechExpanded] = useState(false);
  const [techListExpanded, setTechListExpanded] = useState(false);
  const [regionExpanded, setRegionExpanded] = useState(false);
  const [regionListExpanded, setRegionListExpanded] = useState(false);
  const [priceExpanded, setPriceExpanded] = useState(false);

  const navigate = (nextParams: ServiceListSearchParams) => {
    const href = buildServiceListHref(config, nextParams);
    router.push(href, { scroll: false });
  };

  const pushParams = (updates: Partial<ServiceListSearchParams>) => {
    navigate({
      ...params,
      ...updates,
      page: 1,
    });
  };

  const handleReset = () => {
    navigate({
      ...params,
      techStacks: [],
      regions: [],
      price: null,
      page: 1,
    });
  };

  const handleTechStackToggle = (stack: TechStackName) => {
    pushParams({
      techStacks: toggleCsvValue(params.techStacks, stack),
    });
  };

  const handleRegionToggle = (region: Region) => {
    pushParams({
      regions: toggleCsvValue(params.regions, region),
    });
  };

  const handlePriceToggle = (priceId: string) => {
    pushParams({
      price: params.price === priceId ? null : priceId,
    });
  };

  const removeTechStack = (stack: TechStackName) => {
    pushParams({
      techStacks: params.techStacks.filter((item) => item !== stack),
    });
  };

  const removeRegion = (region: Region) => {
    pushParams({
      regions: params.regions.filter((item) => item !== region),
    });
  };

  const visibleTechStacks = techListExpanded
    ? SERVICE_LIST_TECH_STACK_FILTERS
    : SERVICE_LIST_TECH_STACK_FILTERS.slice(
        0,
        SERVICE_LIST_TECH_STACK_VISIBLE_COUNT,
      );

  const visibleRegions = regionListExpanded
    ? SERVICE_LIST_REGION_FILTERS
    : SERVICE_LIST_REGION_FILTERS.slice(0, SERVICE_LIST_REGION_VISIBLE_COUNT);

  const activeTags = [
    ...params.techStacks.map((stack) => {
      const label =
        SERVICE_LIST_TECH_STACK_FILTERS.find((item) => item.id === stack)
          ?.label ?? stack;
      return {
        key: `tech-${stack}`,
        label,
        onRemove: () => {
          removeTechStack(stack);
        },
      };
    }),
    ...params.regions.map((region) => {
      const label =
        SERVICE_LIST_REGION_FILTERS.find((item) => item.id === region)?.label ??
        region;
      return {
        key: `region-${region}`,
        label,
        onRemove: () => {
          removeRegion(region);
        },
      };
    }),
  ];

  if (params.price !== null) {
    const priceLabel = SERVICE_LIST_PRICE_FILTERS.find(
      (item) => item.id === params.price,
    )?.label;
    if (priceLabel) {
      activeTags.push({
        key: `price-${params.price}`,
        label: priceLabel,
        onRemove: () => {
          pushParams({ price: null });
        },
      });
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>필터</div>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          초기화
        </button>
      </div>

      {activeTags.length > 0 ? (
        <div className={styles.activeTags}>
          {activeTags.map((tag) => (
            <button
              key={tag.key}
              type="button"
              className={styles.activeTag}
              aria-label={`${tag.label} 필터 제거`}
              onClick={tag.onRemove}
            >
              {tag.label}
              <X size={16} strokeWidth={2} aria-hidden className={styles.activeTagIcon} />
            </button>
          ))}
        </div>
      ) : null}

      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => {
            setTechExpanded((prev) => !prev);
          }}
        >
          <span className={styles.sectionTitleGroup}>
            <span className={styles.sectionTitle}>기술태그</span>
            {params.techStacks.length > 0 ? (
              <span className={styles.sectionBadge}>{params.techStacks.length}</span>
            ) : null}
          </span>
          <SectionChevron expanded={techExpanded} />
        </button>

        {techExpanded ? (
          <div className={styles.optionList}>
            {visibleTechStacks.map((item) => {
              const checked = params.techStacks.includes(item.id);

              return (
                <label key={item.id} className={styles.optionRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checked}
                    onChange={() => {
                      handleTechStackToggle(item.id);
                    }}
                  />
                  <span className={styles.optionLabel}>{item.label}</span>
                  <span className={styles.optionCount}>
                    {filterCounts.techStackCounts[item.id].toLocaleString()}
                  </span>
                </label>
              );
            })}
            {SERVICE_LIST_TECH_STACK_FILTERS.length >
            SERVICE_LIST_TECH_STACK_VISIBLE_COUNT ? (
              <ListToggleButton
                expanded={techListExpanded}
                onClick={() => {
                  setTechListExpanded((prev) => !prev);
                }}
              />
            ) : null}
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => {
            setRegionExpanded((prev) => !prev);
          }}
        >
          <span className={styles.sectionTitleGroup}>
            <span className={styles.sectionTitle}>지역</span>
            {params.regions.length > 0 ? (
              <span className={styles.sectionBadge}>{params.regions.length}</span>
            ) : null}
          </span>
          <SectionChevron expanded={regionExpanded} />
        </button>

        {regionExpanded ? (
          <div className={styles.optionList}>
            {visibleRegions.map((item) => {
              const checked = params.regions.includes(item.id);

              return (
                <label key={item.id} className={styles.optionRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checked}
                    onChange={() => {
                      handleRegionToggle(item.id);
                    }}
                  />
                  <span className={styles.optionLabel}>{item.label}</span>
                  <span className={styles.optionCount}>
                    {filterCounts.regionCounts[item.id].toLocaleString()}
                  </span>
                </label>
              );
            })}
            {SERVICE_LIST_REGION_FILTERS.length >
            SERVICE_LIST_REGION_VISIBLE_COUNT ? (
              <ListToggleButton
                expanded={regionListExpanded}
                onClick={() => {
                  setRegionListExpanded((prev) => !prev);
                }}
              />
            ) : null}
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => {
            setPriceExpanded((prev) => !prev);
          }}
        >
          <span className={styles.sectionTitle}>가격</span>
          <SectionChevron expanded={priceExpanded} />
        </button>

        {priceExpanded ? (
          <div className={styles.optionList}>
            {SERVICE_LIST_PRICE_FILTERS.map((item) => {
              const checked = params.price === item.id;

              return (
                <label key={item.id} className={styles.optionRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checked}
                    onChange={() => {
                      handlePriceToggle(item.id);
                    }}
                  />
                  <span className={styles.optionLabel}>{item.label}</span>
                  <span className={styles.optionCount}>
                    {(filterCounts.priceCounts[item.id] ?? 0).toLocaleString()}
                  </span>
                </label>
              );
            })}
          </div>
        ) : null}
      </section>
    </aside>
  );
}
