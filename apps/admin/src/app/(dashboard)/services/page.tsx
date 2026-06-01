import type { ServiceFilterParams } from '@/features/services/types';

import { ListLayout } from '@/components/common/ListLayout';
import { getPagedServices } from '@/features/services/api';
import { ServiceFilter } from '@/features/services/ServiceFilter';
import { ServiceTable } from '@/features/services/ServiceTable';
import { isServiceStatus, isServiceType } from '@/utils/filterValidators';
import { calcTotalPages, parsePage, parsePageSize } from '@/utils/paging';
import { param, validated } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const search = param(rawParams.search);
  const serviceType = validated(param(rawParams.serviceType), isServiceType);
  const status = validated(param(rawParams.status), isServiceStatus);
  const page = parsePage(rawParams.page);
  const pageSize = parsePageSize(rawParams.pageSize);

  const pagedResult = await getPagedServices({ search, serviceType, status, page, pageSize });

  const { items, pagination: paginationMeta } = pagedResult.data;
  const totalPages = calcTotalPages(paginationMeta.totalCount, pageSize);

  const filterParams: ServiceFilterParams = { search, serviceType, status, pageSize };

  return (
    <ListLayout
      filterSlot={<ServiceFilter params={filterParams} />}
      tableSlot={
        <ServiceTable items={items} page={page} pageSize={pageSize} />
      }
      page={page}
      totalPages={totalPages}
    />
  );
}
