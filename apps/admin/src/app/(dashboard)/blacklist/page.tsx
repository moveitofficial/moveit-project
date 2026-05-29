import type { BlacklistFilterParams } from '@/features/blacklist/types';

import { TabListLayout } from '@/components/common/TabListLayout';
import {
  getBlacklistTabCounts,
  getPagedBlacklist,
} from '@/features/blacklist/api';
import { BlacklistFilter } from '@/features/blacklist/BlacklistFilter';
import { BlacklistTable } from '@/features/blacklist/BlacklistTable';
import { calcTotalPages, parsePage, parsePageSize } from '@/utils/paging';
import { param, parseTab } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlacklistPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const tab = parseTab(rawParams.tab);
  const search = param(rawParams.search);
  const page = parsePage(rawParams.page);
  const pageSize = parsePageSize(rawParams.pageSize);

  const [tabCounts, pagedResult] = await Promise.all([
    getBlacklistTabCounts(),
    getPagedBlacklist({ tab, search, page, pageSize }),
  ]);

  const { clientCount, expertCount } = tabCounts;
  const { items, pagination: paginationMeta } = pagedResult.data;

  const totalPages = calcTotalPages(paginationMeta.totalCount, pageSize);

  const filterParams: BlacklistFilterParams =
    tab === 'CLIENT' ? { tab, search, pageSize } : { tab, search, pageSize };

  return (
    <TabListLayout
      tab={tab}
      clientCount={clientCount}
      expertCount={expertCount}
      filterSlot={<BlacklistFilter params={filterParams} />}
      tableSlot={
        <BlacklistTable
          tab={tab}
          items={items}
          page={page}
          pageSize={pageSize}
        />
      }
      page={page}
      totalPages={totalPages}
    />
  );
}
