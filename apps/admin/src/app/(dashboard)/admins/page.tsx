import type { AdminFilterParams } from '@/features/admins/types';

import { ListLayout } from '@/components/common/ListLayout';
import { AdminFilter } from '@/features/admins/AdminFilter';
import { AdminListTable } from '@/features/admins/AdminListTable';
import { AdminRegisterButton } from '@/features/admins/AdminRegisterButton';
import { getPagedAdmins } from '@/features/admins/api';
import { calcTotalPages, parsePage, parsePageSize } from '@/utils/paging';
import { param } from '@/utils/queryParams';
import { getAdminSession } from '@/utils/session';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminsPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const search = param(rawParams.search);
  const page = parsePage(rawParams.page);
  const pageSize = parsePageSize(rawParams.pageSize);

  const [pagedResult, session] = await Promise.all([
    getPagedAdmins({ search, page, pageSize }),
    getAdminSession(),
  ]);

  const { items, pagination: paginationMeta } = pagedResult.data;
  const totalPages = calcTotalPages(paginationMeta.totalCount, pageSize);

  const filterParams: AdminFilterParams = { search, pageSize };

  return (
    <ListLayout
      filterSlot={<AdminFilter params={filterParams} />}
      actionSlot={<AdminRegisterButton isSuper={session?.isSuper ?? false} />}
      tableSlot={
        <AdminListTable items={items} page={page} pageSize={pageSize} />
      }
      page={page}
      totalPages={totalPages}
    />
  );
}
