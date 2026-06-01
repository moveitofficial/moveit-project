import type { ReportFilterParams } from '@/features/reports/types';

import { ListLayout } from '@/components/common/ListLayout';
import { getPagedReports } from '@/features/reports/api';
import { ReportFilter } from '@/features/reports/ReportFilter';
import { ReportTable } from '@/features/reports/ReportTable';
import { isReportReason } from '@/utils/filterValidators';
import { calcTotalPages, parsePage, parsePageSize } from '@/utils/paging';
import { param, validated } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ReportsPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const search = param(rawParams.search);
  const reason = validated(param(rawParams.reason), isReportReason);
  const page = parsePage(rawParams.page);
  const pageSize = parsePageSize(rawParams.pageSize);

  const pagedResult = await getPagedReports({ search, reason, page, pageSize });

  const { items, pagination: paginationMeta } = pagedResult.data;
  const totalPages = calcTotalPages(paginationMeta.totalCount, pageSize);

  const filterParams: ReportFilterParams = { search, reason, pageSize };

  return (
    <ListLayout
      filterSlot={<ReportFilter params={filterParams} />}
      tableSlot={
        <ReportTable items={items} page={page} pageSize={pageSize} />
      }
      page={page}
      totalPages={totalPages}
    />
  );
}
