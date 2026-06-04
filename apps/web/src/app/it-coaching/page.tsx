import type { Metadata } from 'next';

import { getItCoachingPageData } from '@/feature/it-coaching/api';
import { ItCoachingListing } from '@/feature/it-coaching/components/ItCoachingListing';
import { IT_COACHING_PAGE_SIZE } from '@/feature/it-coaching/constants';
import { parseItCoachingSearchParams } from '@/feature/it-coaching/utils';
import { calcTotalPages } from '@/utils/paging';

export const metadata: Metadata = {
  title: 'IT코칭 | moveit',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ItCoachingPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const params = parseItCoachingSearchParams(rawParams);

  const pageData = await getItCoachingPageData({
    ...params,
    pageSize: IT_COACHING_PAGE_SIZE,
  });

  const totalPages = calcTotalPages(
    pageData.pagination.totalCount,
    IT_COACHING_PAGE_SIZE,
  );

  return (
    <ItCoachingListing
      featured={pageData.featured}
      filterCounts={pageData.filterCounts}
      items={pageData.items}
      params={{ ...params, page: pageData.pagination.page }}
      page={pageData.pagination.page}
      totalPages={totalPages}
    />
  );
}
