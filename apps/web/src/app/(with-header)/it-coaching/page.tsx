import type { Metadata } from 'next';

import { IT_COACHING_LIST_CONFIG } from '@/feature/itCoaching/constants';
import { getServiceListPageData } from '@/feature/serviceList/api';
import { ServiceList } from '@/feature/serviceList/components/ServiceList';
import { SERVICE_LIST_PAGE_SIZE } from '@/feature/serviceList/constants';
import { parseServiceListSearchParams } from '@/feature/serviceList/utils';
import { calcTotalPages } from '@/utils/paging';

export const metadata: Metadata = {
  title: 'IT코칭 | moveit',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ItCoachingPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const params = parseServiceListSearchParams(
    rawParams,
    IT_COACHING_LIST_CONFIG,
  );

  const pageData = await getServiceListPageData(
    IT_COACHING_LIST_CONFIG.serviceGroup,
    {
      ...params,
      pageSize: SERVICE_LIST_PAGE_SIZE,
    },
  );

  const totalPages = calcTotalPages(
    pageData.pagination.totalCount,
    SERVICE_LIST_PAGE_SIZE,
  );

  return (
    <ServiceList
      config={IT_COACHING_LIST_CONFIG}
      featured={pageData.featured}
      filterCounts={pageData.filterCounts}
      items={pageData.items}
      params={{ ...params, page: pageData.pagination.page }}
      page={pageData.pagination.page}
      totalPages={totalPages}
    />
  );
}
