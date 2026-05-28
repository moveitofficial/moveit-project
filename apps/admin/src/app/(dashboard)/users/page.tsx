import type { UserFilterParams } from '@/features/users/types';

import { TabListLayout } from '@/components/common/TabListLayout';
import { getPagedUsers, getUserTabCounts } from '@/features/users/api';
import { UserFilter } from '@/features/users/UserFilter';
import { UserTable } from '@/features/users/UserTable';
import {
  isApprovalStatus,
  isProvider,
  isServiceType,
} from '@/utils/filterValidators';
import { calcTotalPages, parsePage, parsePageSize } from '@/utils/paging';
import { param, parseTab, validated } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UsersPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const tab = parseTab(rawParams.tab);
  const search = param(rawParams.search);
  const provider = validated(param(rawParams.provider), isProvider);
  const region = param(rawParams.region);
  const page = parsePage(rawParams.page);
  const pageSize = parsePageSize(rawParams.pageSize);
  const approvalStatus =
    tab === 'EXPERT'
      ? validated(param(rawParams.approvalStatus), isApprovalStatus)
      : undefined;
  const serviceType =
    tab === 'EXPERT'
      ? validated(param(rawParams.serviceType), isServiceType)
      : undefined;

  const [tabCounts, pagedResult] = await Promise.all([
    getUserTabCounts(),
    getPagedUsers({
      tab,
      search,
      provider,
      region,
      page,
      pageSize,
      approvalStatus,
      serviceType,
    }),
  ]);

  const { clientCount, expertCount } = tabCounts;
  const { items, pagination: paginationMeta } = pagedResult.data;

  const totalPages = calcTotalPages(paginationMeta.totalCount, pageSize);

  const filterParams: UserFilterParams =
    tab === 'CLIENT'
      ? { tab, search, provider, region, pageSize }
      : {
          tab,
          search,
          provider,
          region,
          approvalStatus,
          serviceType,
          pageSize,
        };

  return (
    <TabListLayout
      tab={tab}
      clientCount={clientCount}
      expertCount={expertCount}
      filterSlot={<UserFilter params={filterParams} />}
      tableSlot={
        <UserTable tab={tab} items={items} page={page} pageSize={pageSize} />
      }
      page={page}
      totalPages={totalPages}
    />
  );
}
