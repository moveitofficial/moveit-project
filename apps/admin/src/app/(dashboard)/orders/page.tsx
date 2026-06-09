import * as styles from './page.css';

import type { OrderFilterParams } from '@/features/orders/types';

import { getOrders, getOrderTabCounts } from '@/features/orders/api';
import { OrderCardList } from '@/features/orders/OrderCardList';
import { OrderFilter } from '@/features/orders/OrderFilter';
import { isOrderSort, isOrderTab } from '@/features/orders/types';
import { param, validated } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const tab = validated(param(rawParams.tab), isOrderTab);
  const sort = validated(param(rawParams.sort), isOrderSort);
  const search = param(rawParams.search);

  const [result, tabCounts] = await Promise.all([
    getOrders({ tab, sort, search, page: 1 }),
    getOrderTabCounts(),
  ]);
  const { items, pagination } = result.data;

  const filterParams: OrderFilterParams = { tab, sort, search };

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <OrderFilter params={filterParams} tabCounts={tabCounts} />
      </div>
      <div className={styles.listSection}>
        <OrderCardList
          key={`${tab ?? ''}-${sort ?? ''}-${search ?? ''}`}
          initialItems={items}
          initialHasNext={pagination.hasNext}
          params={filterParams}
        />
      </div>
    </div>
  );
}
