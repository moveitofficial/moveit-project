import { api } from '@repo/fetcher';

import {
  SERVICE_LIST_FEATURED_COUNT,
  SERVICE_LIST_PRICE_FILTERS,
  SERVICE_LIST_REGION_FILTERS,
  SERVICE_LIST_TECH_STACK_FILTERS,
  type ServiceListSort,
} from './constants';

import type {
  GetServiceListPageDataParams,
  ServiceListFilterCounts,
  ServiceListPageData,
  ServiceListSearchParams,
  ServiceListServiceItem,
} from './types';
import type {
  ApiSuccess,
  PaginatedResult,
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  ServiceListItem,
  TechStackName,
} from '@/mocks/types';

interface ServiceListItemApi {
  id: string;
  title: string;
  servicePrice: number;
  workDuration: number;
  revisionCount: number;
  thumbnailUrl: string;
  status: ServiceListItem['status'];
  expert: ServiceListItem['expert'] & { region?: Region | null };
  categoryRef: ServiceListItem['categoryRef'];
  techStacks: TechStackName[];
  rating: number;
  reviewCount: number;
}

type ServiceListPaginatedApi = PaginatedResult<ServiceListItemApi>;

const SERVICE_LIST_FALLBACK_THUMBNAIL =
  'https://picsum.photos/seed/moveit-fallback/400/300';

function resolveThumbnailUrl(thumbnailUrl: string): string {
  return thumbnailUrl.trim().length > 0
    ? thumbnailUrl
    : SERVICE_LIST_FALLBACK_THUMBNAIL;
}

const SERVICE_CATEGORY_NAMES: ServiceCategoryName[] = [
  'WEB',
  'APP',
  'AI',
  'GAME',
  'DATA_ANALYTICS',
];

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

function mapSortToApi(sort: ServiceListSort): string {
  switch (sort) {
    case 'RECOMMENDED':
    case 'SALES': {
      return 'popular';
    }
    case 'LATEST': {
      return 'latest';
    }
    case 'RATING': {
      return 'rating';
    }
    case 'PRICE_ASC': {
      return 'price_asc';
    }
  }
}

function resolvePriceRange(
  priceId: string | null,
): { priceMin?: number; priceMax?: number } {
  if (priceId === null) {
    return {};
  }

  const bucket = SERVICE_LIST_PRICE_FILTERS.find((item) => item.id === priceId);
  if (!bucket) {
    return {};
  }

  return {
    ...(bucket.min === null ? {} : { priceMin: bucket.min }),
    ...(bucket.max === null ? {} : { priceMax: bucket.max }),
  };
}

function buildListQuery(
  group: ServiceGroupName,
  params: {
    page: number;
    pageSize: number;
    sort: ServiceListSort;
    category?: ServiceListSearchParams['category'];
    keyword?: string;
    techStacks?: TechStackName[];
    regions?: Region[];
    price?: string | null;
  },
): string {
  const query = new URLSearchParams({
    group,
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: mapSortToApi(params.sort),
  });

  if (params.category !== undefined && params.category !== 'ALL') {
    query.set('category', params.category);
  }

  const keyword = params.keyword?.trim() ?? '';
  if (keyword.length > 0) {
    query.set('search', keyword);
  }

  const techStacks = params.techStacks ?? [];
  if (techStacks.length > 0) {
    query.set('techStacks', techStacks.slice(0, 3).join(','));
  }

  const regions = params.regions ?? [];
  if (regions.length === 1) {
    query.set('region', regions[0] ?? '');
  }

  const priceRange = resolvePriceRange(params.price ?? null);
  if (priceRange.priceMin !== undefined) {
    query.set('priceMin', String(priceRange.priceMin));
  }
  if (priceRange.priceMax !== undefined) {
    query.set('priceMax', String(priceRange.priceMax));
  }

  return query.toString();
}

function mapServiceListItem(item: ServiceListItemApi): ServiceListServiceItem {
  return {
    id: item.id,
    title: item.title,
    servicePrice: item.servicePrice,
    workDuration: item.workDuration,
    revisionCount: item.revisionCount,
    thumbnailUrl: resolveThumbnailUrl(item.thumbnailUrl),
    status: item.status,
    expert: {
      id: item.expert.id,
      name: item.expert.name,
      companyName: item.expert.companyName,
      profileImageUrl: item.expert.profileImageUrl,
    },
    categoryRef: item.categoryRef,
    rating: item.rating,
    reviewCount: item.reviewCount,
    isFavorite: false,
    techStacks: item.techStacks,
    region: item.expert.region ?? null,
  };
}

async function fetchServiceList(
  query: string,
): Promise<ServiceListPaginatedApi> {
  const response = await api.get<ApiSuccess<ServiceListPaginatedApi>>(
    `/services?${query}`,
  );

  return response.data;
}

async function fetchTotalCount(
  group: ServiceGroupName,
  params: ServiceListSearchParams & { pageSize: number },
  overrides: Partial<ServiceListSearchParams> = {},
): Promise<number> {
  const merged: ServiceListSearchParams & { pageSize: number } = {
    ...params,
    ...overrides,
    page: 1,
    pageSize: 1,
  };

  const data = await fetchServiceList(
    buildListQuery(group, {
      page: merged.page,
      pageSize: merged.pageSize,
      sort: merged.sort,
      category: merged.category,
      keyword: merged.keyword,
      techStacks: merged.techStacks,
      regions: merged.regions,
      price: merged.price,
    }),
  );

  return data.pagination.totalCount;
}

async function fetchCategoryFilterCounts(
  group: ServiceGroupName,
): Promise<Pick<ServiceListFilterCounts, 'totalCount' | 'categoryCounts'>> {
  const [allCount, ...categoryCountsList] = await Promise.all([
      fetchTotalCount(group, {
        category: 'ALL',
        page: 1,
        sort: 'RECOMMENDED',
        keyword: '',
        techStacks: [],
        regions: [],
        price: null,
        pageSize: 1,
      }),
      ...SERVICE_CATEGORY_NAMES.map((category) =>
        fetchTotalCount(group, {
          category,
          page: 1,
          sort: 'RECOMMENDED',
          keyword: '',
          techStacks: [],
          regions: [],
          price: null,
          pageSize: 1,
        }),
      ),
    ]);

  const categoryCounts = {
    ALL: allCount,
    WEB: categoryCountsList[0] ?? 0,
    APP: categoryCountsList[1] ?? 0,
    AI: categoryCountsList[2] ?? 0,
    GAME: categoryCountsList[3] ?? 0,
    DATA_ANALYTICS: categoryCountsList[4] ?? 0,
  };

  return {
    totalCount: allCount,
    categoryCounts,
  };
}

async function fetchContextualSidebarCounts(
  group: ServiceGroupName,
  params: ServiceListSearchParams & { pageSize: number },
): Promise<
  Pick<ServiceListFilterCounts, 'priceCounts' | 'techStackCounts' | 'regionCounts'>
> {
  const [priceCountsList, techStackCountsList, regionCountsList] =
    await Promise.all([
      Promise.all(
        SERVICE_LIST_PRICE_FILTERS.map(async (price) => ({
          id: price.id,
          count: await fetchTotalCount(group, params, {
            price: price.id,
          }),
        })),
      ),
      Promise.all(
        SERVICE_LIST_TECH_STACK_FILTERS.map(async (stack) => {
          const nextTechStacks = params.techStacks.includes(stack.id)
            ? params.techStacks
            : [...params.techStacks, stack.id];

          return {
            id: stack.id,
            count: await fetchTotalCount(group, params, {
              techStacks: nextTechStacks,
            }),
          };
        }),
      ),
      Promise.all(
        SERVICE_LIST_REGION_FILTERS.map(async (region) => {
          const nextRegions = params.regions.includes(region.id)
            ? params.regions
            : [...params.regions, region.id];

          return {
            id: region.id,
            count: await fetchTotalCount(group, params, {
              regions: nextRegions.length === 1 ? nextRegions : [region.id],
            }),
          };
        }),
      ),
    ]);

  const priceCounts = { ...priceCountBase };
  for (const item of priceCountsList) {
    priceCounts[item.id] = item.count;
  }

  const techStackCounts = { ...techStackCountBase };
  for (const item of techStackCountsList) {
    techStackCounts[item.id] = item.count;
  }

  const regionCounts = { ...regionCountBase };
  for (const item of regionCountsList) {
    regionCounts[item.id] = item.count;
  }

  return {
    priceCounts,
    techStackCounts,
    regionCounts,
  };
}

export async function getServiceListPageData(
  group: ServiceGroupName,
  params: GetServiceListPageDataParams,
): Promise<ServiceListPageData> {
  const listQuery = buildListQuery(group, {
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
    category: params.category,
    keyword: params.keyword,
    techStacks: params.techStacks,
    regions: params.regions,
    price: params.price,
  });

  const featuredQuery = buildListQuery(group, {
    page: 1,
    pageSize: SERVICE_LIST_FEATURED_COUNT,
    sort: 'RECOMMENDED',
    category: 'ALL',
    keyword: '',
    techStacks: [],
    regions: [],
    price: null,
  });

  const [listData, featuredData, categoryCounts, sidebarCounts] =
    await Promise.all([
      fetchServiceList(listQuery),
      fetchServiceList(featuredQuery),
      fetchCategoryFilterCounts(group),
      fetchContextualSidebarCounts(group, params),
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(listData.pagination.totalCount / params.pageSize),
  );
  const currentPage = Math.min(Math.max(1, params.page), totalPages);

  return {
    featured: featuredData.items.map((item) => mapServiceListItem(item)),
    filterCounts: {
      ...categoryCounts,
      ...sidebarCounts,
    },
    items: listData.items.map((item) => mapServiceListItem(item)),
    pagination: {
      page: currentPage,
      pageSize: params.pageSize,
      totalCount: listData.pagination.totalCount,
      hasNext: listData.pagination.hasNext,
    },
  };
}
