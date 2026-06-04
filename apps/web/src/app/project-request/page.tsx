import type { Metadata } from 'next';

import { PROJECT_REQUEST_LIST_CONFIG } from '@/feature/projectRequest/constants';
import { getServiceListPageData } from '@/feature/serviceList/api';
import { ServiceList } from '@/feature/serviceList/components/ServiceList';
import { SERVICE_LIST_PAGE_SIZE } from '@/feature/serviceList/constants';
import { parseServiceListSearchParams } from '@/feature/serviceList/utils';
import { calcTotalPages } from '@/utils/paging';

export const metadata: Metadata = {
  title: '프로젝트 의뢰 | moveit',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjectRequestPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const params = parseServiceListSearchParams(
    rawParams,
    PROJECT_REQUEST_LIST_CONFIG,
  );

  const pageData = await getServiceListPageData(
    PROJECT_REQUEST_LIST_CONFIG.serviceGroup,
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
      config={PROJECT_REQUEST_LIST_CONFIG}
      featured={pageData.featured}
      filterCounts={pageData.filterCounts}
      items={pageData.items}
      params={{ ...params, page: pageData.pagination.page }}
      page={pageData.pagination.page}
      totalPages={totalPages}
    />
  );
}
