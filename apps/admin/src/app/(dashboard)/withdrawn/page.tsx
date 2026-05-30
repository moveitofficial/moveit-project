import type { WithdrawnFilterParams } from '@/features/withdrawn/types';

import { TabListLayout } from '@/components/common/TabListLayout';
import {
  getPagedWithdrawn,
  getWithdrawnTabCounts,
} from '@/features/withdrawn/api';
import { WithdrawnFilter } from '@/features/withdrawn/WithdrawnFilter';
import { WithdrawnTable } from '@/features/withdrawn/WithdrawnTable';
import { calcTotalPages, parsePage, parsePageSize } from '@/utils/paging';
import { param, parseTab } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WithdrawnPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const tab = parseTab(rawParams.tab);
  const search = param(rawParams.search);
  const page = parsePage(rawParams.page);
  const pageSize = parsePageSize(rawParams.pageSize);

  const [tabCounts, pagedResult] = await Promise.all([
    getWithdrawnTabCounts(),
    getPagedWithdrawn({ tab, search, page, pageSize }),
  ]);

  const { clientCount, expertCount } = tabCounts;
  const { items, pagination: paginationMeta } = pagedResult.data;

  const totalPages = calcTotalPages(paginationMeta.totalCount, pageSize);

  const filterParams: WithdrawnFilterParams = { tab, search, pageSize };

  return (
    <TabListLayout
      tab={tab}
      clientCount={clientCount}
      expertCount={expertCount}
      filterSlot={<WithdrawnFilter params={filterParams} />}
      tableSlot={
        <WithdrawnTable items={items} page={page} pageSize={pageSize} />
      }
      page={page}
      totalPages={totalPages}
    />
  );
}
