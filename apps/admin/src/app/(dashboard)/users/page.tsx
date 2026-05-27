import { Pagination } from '@repo/ui/Pagination';
import { Suspense } from 'react';

import * as styles from './page.css';

import type { UserFilterParams } from '@/features/users/types';
import type { AdminExpert, AdminUser } from '@/mocks/types';

import { getPagedUsers, getUserTabCounts } from '@/features/users/api';
import { UserFilter } from '@/features/users/UserFilter';
import { UserTable } from '@/features/users/UserTable';
import { UserTabs } from '@/features/users/UserTabs';
import {
  isApprovalStatus,
  isProvider,
  isServiceType,
  param,
  validated,
} from '@/features/users/utils';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UsersPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const tab = param(rawParams.tab) === 'EXPERT' ? 'EXPERT' : 'CLIENT';
  const search = param(rawParams.search);
  const provider = validated(param(rawParams.provider), isProvider);
  const region = param(rawParams.region);
  const page = Math.max(
    1,
    Number.parseInt(param(rawParams.page) ?? '', 10) || 1,
  );
  const rawPageSize = param(rawParams.pageSize);
  const pageSize =
    rawPageSize === undefined
      ? 50
      : Math.max(1, Number.parseInt(rawPageSize, 10) || 50);
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

  const totalPages =
    paginationMeta.totalCount <= 0
      ? 1
      : Math.ceil(paginationMeta.totalCount / pageSize);
  const currentClients = tab === 'CLIENT' ? (items as AdminUser[]) : [];
  const currentExperts = tab === 'EXPERT' ? (items as AdminExpert[]) : [];

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
    <div className={styles.container}>
      <UserTabs
        currentTab={tab}
        clientCount={clientCount}
        expertCount={expertCount}
      />

      <div className={styles.filterSection}>
        <Suspense fallback={null}>
          <UserFilter params={filterParams} />
        </Suspense>
      </div>

      <div className={styles.tableSection}>
        <UserTable
          tab={tab}
          clients={currentClients}
          experts={currentExperts}
          page={page}
          pageSize={pageSize}
        />
      </div>

      <Suspense fallback={null}>
        <div className={styles.pagination}>
          <Pagination
            currentPage={paginationMeta.page}
            totalPages={totalPages}
          />
        </div>
      </Suspense>
    </div>
  );
}
