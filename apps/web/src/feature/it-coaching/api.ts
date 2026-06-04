import {
  IT_COACHING_FEATURED_COUNT,
  IT_COACHING_PRICE_FILTERS,
  IT_COACHING_REGION_FILTERS,
  IT_COACHING_TECH_STACK_FILTERS,
} from './constants';

import type {
  GetItCoachingPageDataParams,
  ItCoachingFilterCounts,
  ItCoachingPageData,
  ItCoachingServiceItem,
} from './types';
import type { ItCoachingSearchParams } from './utils';
import type { Region, ServiceCategoryName, TechStackName } from '@/mocks/types';

import { mockExpertList } from '@/mocks/experts';
import { mockServiceList } from '@/mocks/services';

/** API 연동 전: 전문가 지역 mock 보강 (연동 후에는 응답 item.region 사용) */
const MOCK_EXPERT_REGION: Partial<Record<string, Region>> = {
  'expert-003': 'SEOUL',
  'expert-004': 'GYEONGGI_SOUTH',
  'expert-005': 'DAEGU',
  'expert-006': 'BUSAN',
  'expert-007': 'SEOUL',
  'expert-008': 'INCHEON',
};

const expertById = new Map(mockExpertList.map((expert) => [expert.id, expert]));

function buildItCoachingPool(): ItCoachingServiceItem[] {
  return mockServiceList
    .filter(
      (service) =>
        service.categoryRef.group === 'IT_COACHING' &&
        service.status === 'ACTIVE',
    )
    .map((service) => {
      const expert = expertById.get(service.expert.id);

      return {
        ...service,
        techStacks: expert?.techStacks ?? [],
        region: MOCK_EXPERT_REGION[service.expert.id] ?? null,
      };
    });
}

const itCoachingPool = buildItCoachingPool();

const categoryCountBase: Record<'ALL' | ServiceCategoryName, number> = {
  ALL: 0,
  WEB: 0,
  APP: 0,
  AI: 0,
  GAME: 0,
  DATA_ANALYTICS: 0,
};

const priceCountBase = IT_COACHING_PRICE_FILTERS.reduce<Record<string, number>>(
  (acc, item) => {
    acc[item.id] = 0;
    return acc;
  },
  {},
);

const techStackCountBase = IT_COACHING_TECH_STACK_FILTERS.reduce<
  Record<TechStackName, number>
>(
  (acc, item) => {
    acc[item.id] = 0;
    return acc;
  },
  {} as Record<TechStackName, number>,
);

const regionCountBase = IT_COACHING_REGION_FILTERS.reduce<
  Record<Region, number>
>(
  (acc, item) => {
    acc[item.id] = 0;
    return acc;
  },
  {} as Record<Region, number>,
);

function calculateFilterCounts(
  services: ItCoachingServiceItem[],
): ItCoachingFilterCounts {
  const counts: ItCoachingFilterCounts = {
    totalCount: services.length,
    categoryCounts: { ...categoryCountBase },
    priceCounts: { ...priceCountBase },
    techStackCounts: { ...techStackCountBase },
    regionCounts: { ...regionCountBase },
  };

  counts.categoryCounts.ALL = services.length;

  for (const service of services) {
    counts.categoryCounts[service.categoryRef.category] += 1;

    for (const price of IT_COACHING_PRICE_FILTERS) {
      if (matchesPrice(service, price.id)) {
        counts.priceCounts[price.id] = (counts.priceCounts[price.id] ?? 0) + 1;
      }
    }

    for (const stack of service.techStacks) {
      if (stack in counts.techStackCounts) {
        counts.techStackCounts[stack] += 1;
      }
    }

    const region = service.region;
    if (region !== null && region in counts.regionCounts) {
      counts.regionCounts[region] += 1;
    }
  }

  return counts;
}

function matchesKeyword(
  service: ItCoachingServiceItem,
  keyword: string,
): boolean {
  if (keyword.length === 0) {
    return true;
  }

  const lowered = keyword.toLowerCase();
  return (
    service.title.toLowerCase().includes(lowered) ||
    service.expert.name.toLowerCase().includes(lowered) ||
    service.expert.companyName.toLowerCase().includes(lowered)
  );
}

function matchesPrice(
  service: ItCoachingServiceItem,
  priceId: string | null,
): boolean {
  if (priceId === null) {
    return true;
  }

  const bucket = IT_COACHING_PRICE_FILTERS.find((item) => item.id === priceId);
  if (!bucket) {
    return true;
  }

  if (bucket.min !== null && service.servicePrice < bucket.min) {
    return false;
  }

  if (bucket.max !== null && service.servicePrice > bucket.max) {
    return false;
  }

  return true;
}

function matchesTechStacks(
  service: ItCoachingServiceItem,
  techStacks: TechStackName[],
): boolean {
  if (techStacks.length === 0) {
    return true;
  }

  return techStacks.every((stack) => service.techStacks.includes(stack));
}

function matchesRegions(
  service: ItCoachingServiceItem,
  regions: ItCoachingSearchParams['regions'],
): boolean {
  if (regions.length === 0) {
    return true;
  }

  if (service.region === null) {
    return false;
  }

  return regions.includes(service.region);
}

function sortServices(
  services: ItCoachingServiceItem[],
  sort: ItCoachingSearchParams['sort'],
): ItCoachingServiceItem[] {
  const next = [...services];

  switch (sort) {
    case 'SALES': {
      return next.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    case 'LATEST': {
      return next.sort((a, b) => b.id.localeCompare(a.id));
    }
    case 'RATING': {
      return next.sort((a, b) => b.rating - a.rating);
    }
    case 'PRICE_ASC': {
      return next.sort((a, b) => a.servicePrice - b.servicePrice);
    }
    default: {
      return next.sort(
        (a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating,
      );
    }
  }
}

function filterServices(
  params: ItCoachingSearchParams,
): ItCoachingServiceItem[] {
  return itCoachingPool.filter((service) => {
    if (
      params.category !== 'ALL' &&
      service.categoryRef.category !== params.category
    ) {
      return false;
    }

    if (!matchesKeyword(service, params.keyword)) {
      return false;
    }

    if (!matchesPrice(service, params.price)) {
      return false;
    }

    if (!matchesTechStacks(service, params.techStacks)) {
      return false;
    }

    if (!matchesRegions(service, params.regions)) {
      return false;
    }

    return true;
  });
}

function countServicesWithParams(params: ItCoachingSearchParams): number {
  return filterServices(params).length;
}

function calculateContextualSidebarCounts(
  params: ItCoachingSearchParams,
): Pick<
  ItCoachingFilterCounts,
  'priceCounts' | 'techStackCounts' | 'regionCounts'
> {
  const priceCounts = { ...priceCountBase };
  const techStackCounts = { ...techStackCountBase };
  const regionCounts = { ...regionCountBase };

  for (const price of IT_COACHING_PRICE_FILTERS) {
    priceCounts[price.id] = countServicesWithParams({
      ...params,
      price: price.id,
    });
  }

  for (const stack of IT_COACHING_TECH_STACK_FILTERS) {
    const nextTechStacks = params.techStacks.includes(stack.id)
      ? params.techStacks
      : [...params.techStacks, stack.id];

    techStackCounts[stack.id] = countServicesWithParams({
      ...params,
      techStacks: nextTechStacks,
    });
  }

  for (const region of IT_COACHING_REGION_FILTERS) {
    const nextRegions = params.regions.includes(region.id)
      ? params.regions
      : [...params.regions, region.id];

    regionCounts[region.id] = countServicesWithParams({
      ...params,
      regions: nextRegions,
    });
  }

  return {
    priceCounts,
    techStackCounts,
    regionCounts,
  };
}

export function getItCoachingPageData(
  params: GetItCoachingPageDataParams,
): Promise<ItCoachingPageData> {
  const filtered = sortServices(filterServices(params), params.sort);
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const currentPage = Math.min(Math.max(1, params.page), totalPages);
  const startIndex = (currentPage - 1) * params.pageSize;
  const items = filtered.slice(startIndex, startIndex + params.pageSize);

  const featured = sortServices(itCoachingPool, 'RECOMMENDED').slice(
    0,
    IT_COACHING_FEATURED_COUNT,
  );
  const totalAndCategoryCounts = calculateFilterCounts(itCoachingPool);
  const contextualSidebarCounts = calculateContextualSidebarCounts(params);

  return Promise.resolve({
    featured,
    filterCounts: {
      ...totalAndCategoryCounts,
      ...contextualSidebarCounts,
    },
    items,
    pagination: {
      page: currentPage,
      pageSize: params.pageSize,
      totalCount,
      hasNext: startIndex + params.pageSize < totalCount,
    },
  });
}
