import {
  SERVICE_LIST_FEATURED_COUNT,
  SERVICE_LIST_PRICE_FILTERS,
  SERVICE_LIST_REGION_FILTERS,
  SERVICE_LIST_TECH_STACK_FILTERS,
} from './constants';

import type {
  GetServiceListPageDataParams,
  ServiceListFilterCounts,
  ServiceListPageData,
  ServiceListSearchParams,
  ServiceListServiceItem,
} from './types';
import type {
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@/mocks/types';

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

const poolByGroup = new Map<ServiceGroupName, ServiceListServiceItem[]>();

function buildServicePool(
  group: ServiceGroupName,
): ServiceListServiceItem[] {
  return mockServiceList
    .filter(
      (service) =>
        service.categoryRef.group === group && service.status === 'ACTIVE',
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

function getServicePool(group: ServiceGroupName): ServiceListServiceItem[] {
  const cached = poolByGroup.get(group);
  if (cached !== undefined) {
    return cached;
  }

  const pool = buildServicePool(group);
  poolByGroup.set(group, pool);
  return pool;
}

const categoryCountBase: Record<'ALL' | ServiceCategoryName, number> = {
  ALL: 0,
  WEB: 0,
  APP: 0,
  AI: 0,
  GAME: 0,
  DATA_ANALYTICS: 0,
};

const priceCountBase = SERVICE_LIST_PRICE_FILTERS.reduce<Record<string, number>>(
  (acc, item) => {
    acc[item.id] = 0;
    return acc;
  },
  {},
);

const techStackCountBase = SERVICE_LIST_TECH_STACK_FILTERS.reduce<
  Record<TechStackName, number>
>(
  (acc, item) => {
    acc[item.id] = 0;
    return acc;
  },
  {} as Record<TechStackName, number>,
);

const regionCountBase = SERVICE_LIST_REGION_FILTERS.reduce<
  Record<Region, number>
>(
  (acc, item) => {
    acc[item.id] = 0;
    return acc;
  },
  {} as Record<Region, number>,
);

function calculateFilterCounts(
  services: ServiceListServiceItem[],
): ServiceListFilterCounts {
  const counts: ServiceListFilterCounts = {
    totalCount: services.length,
    categoryCounts: { ...categoryCountBase },
    priceCounts: { ...priceCountBase },
    techStackCounts: { ...techStackCountBase },
    regionCounts: { ...regionCountBase },
  };

  counts.categoryCounts.ALL = services.length;

  for (const service of services) {
    counts.categoryCounts[service.categoryRef.category] += 1;

    for (const price of SERVICE_LIST_PRICE_FILTERS) {
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
  service: ServiceListServiceItem,
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
  service: ServiceListServiceItem,
  priceId: string | null,
): boolean {
  if (priceId === null) {
    return true;
  }

  const bucket = SERVICE_LIST_PRICE_FILTERS.find((item) => item.id === priceId);
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
  service: ServiceListServiceItem,
  techStacks: TechStackName[],
): boolean {
  if (techStacks.length === 0) {
    return true;
  }

  return techStacks.every((stack) => service.techStacks.includes(stack));
}

function matchesRegions(
  service: ServiceListServiceItem,
  regions: ServiceListSearchParams['regions'],
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
  services: ServiceListServiceItem[],
  sort: ServiceListSearchParams['sort'],
): ServiceListServiceItem[] {
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
  pool: ServiceListServiceItem[],
  params: ServiceListSearchParams,
): ServiceListServiceItem[] {
  return pool.filter((service) => {
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

function countServicesWithParams(
  pool: ServiceListServiceItem[],
  params: ServiceListSearchParams,
): number {
  return filterServices(pool, params).length;
}

function calculateContextualSidebarCounts(
  pool: ServiceListServiceItem[],
  params: ServiceListSearchParams,
): Pick<
  ServiceListFilterCounts,
  'priceCounts' | 'techStackCounts' | 'regionCounts'
> {
  const priceCounts = { ...priceCountBase };
  const techStackCounts = { ...techStackCountBase };
  const regionCounts = { ...regionCountBase };

  for (const price of SERVICE_LIST_PRICE_FILTERS) {
    priceCounts[price.id] = countServicesWithParams(pool, {
      ...params,
      price: price.id,
    });
  }

  for (const stack of SERVICE_LIST_TECH_STACK_FILTERS) {
    const nextTechStacks = params.techStacks.includes(stack.id)
      ? params.techStacks
      : [...params.techStacks, stack.id];

    techStackCounts[stack.id] = countServicesWithParams(pool, {
      ...params,
      techStacks: nextTechStacks,
    });
  }

  for (const region of SERVICE_LIST_REGION_FILTERS) {
    const nextRegions = params.regions.includes(region.id)
      ? params.regions
      : [...params.regions, region.id];

    regionCounts[region.id] = countServicesWithParams(pool, {
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

export function getServiceListPageData(
  group: ServiceGroupName,
  params: GetServiceListPageDataParams,
): Promise<ServiceListPageData> {
  const pool = getServicePool(group);
  const filtered = sortServices(filterServices(pool, params), params.sort);
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const currentPage = Math.min(Math.max(1, params.page), totalPages);
  const startIndex = (currentPage - 1) * params.pageSize;
  const items = filtered.slice(startIndex, startIndex + params.pageSize);

  const featured = sortServices(pool, 'RECOMMENDED').slice(
    0,
    SERVICE_LIST_FEATURED_COUNT,
  );
  const totalAndCategoryCounts = calculateFilterCounts(pool);
  const contextualSidebarCounts = calculateContextualSidebarCounts(pool, params);

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
