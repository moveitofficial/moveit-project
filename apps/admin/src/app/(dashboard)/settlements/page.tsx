import * as styles from './page.css';

import type { SettlementFilterParams } from '@/features/settlements/types';

import { getSettlements } from '@/features/settlements/api';
import { SettlementFilter } from '@/features/settlements/SettlementFilter';
import { SettlementList } from '@/features/settlements/SettlementList';
import { isSettlementStatus } from '@/utils/filterValidators';
import { param, validated } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SettlementsPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const search = param(rawParams.search);
  const status = validated(param(rawParams.status), isSettlementStatus);

  const result = await getSettlements({ search, status, page: 1 });
  const { items, pagination } = result.data;

  const filterParams: SettlementFilterParams = { search, status };

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <SettlementFilter params={filterParams} />
      </div>
      <div className={styles.listSection}>
        <SettlementList
          key={`${search ?? ''}-${status ?? ''}`}
          initialItems={items}
          initialHasNext={pagination.hasNext}
          params={filterParams}
        />
      </div>
    </div>
  );
}
