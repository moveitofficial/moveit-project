import type { AdminFilterParams } from '@/features/admins/types';

import { ListLayout } from '@/components/common/ListLayout';
import { AdminFilter } from '@/features/admins/AdminFilter';
import { AdminManagerTable } from '@/features/admins/AdminManagerTable';
import { AdminRegisterButton } from '@/features/admins/AdminRegisterButton';
import { getPagedManagers } from '@/features/admins/api';
import { calcTotalPages, parsePage, parsePageSize } from '@/utils/paging';
import { param } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminsPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const search = param(rawParams.search);
  const page = parsePage(rawParams.page);
  const pageSize = parsePageSize(rawParams.pageSize);

  const pagedResult = await getPagedManagers({ search, page, pageSize });

  const { items, pagination: paginationMeta } = pagedResult.data;
  const totalPages = calcTotalPages(paginationMeta.totalCount, pageSize);

  const filterParams: AdminFilterParams = { search, pageSize };

  return (
    <ListLayout
      filterSlot={<AdminFilter params={filterParams} />}
      actionSlot={<AdminRegisterButton />}
      tableSlot={
        <AdminManagerTable items={items} page={page} pageSize={pageSize} />
      }
      page={page}
      totalPages={totalPages}
    />
  );
}
