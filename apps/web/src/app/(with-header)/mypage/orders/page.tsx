import { typography } from '@repo/styles/typography';

import * as styles from './page.css';

import type { OrderFilterParams } from '@/feature/orders/types';
import type { Metadata } from 'next';

import { getOrderTabCounts, getOrders } from '@/feature/orders/api';
import { OrderCardList } from '@/feature/orders/components/OrderCardList';
import { OrderFilter } from '@/feature/orders/components/OrderFilter';
import { OrderSummary } from '@/feature/orders/components/OrderSummary';
import { isOrderSort, isOrderTab } from '@/feature/orders/types';
import { getMe } from '@/feature/signup/api';
import { param, validated } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: me } = await getMe();
  return {
    title: me.role === 'CLIENT' ? '구매관리 | moveit' : '판매관리 | moveit',
  };
}

export default async function OrdersPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const tab = validated(param(rawParams.tab), isOrderTab);
  const sort = validated(param(rawParams.sort), isOrderSort);
  const search = param(rawParams.search);
  const filterParams: OrderFilterParams = { tab, sort, search };

  const { data: me } = await getMe();
  const { role } = me;

  const [result, tabCounts] = await Promise.all([
    getOrders({ role, tab, sort, search, page: 1 }),
    getOrderTabCounts(role),
  ]);
  const { items, pagination } = result.data;

  const title = role === 'CLIENT' ? '구매관리' : '판매관리';

  return (
    <div className={styles.container}>
      <h1 className={`${typography.f18EB} ${styles.title}`}>{title}</h1>
      <OrderSummary role={role} />
      <div className={styles.card}>
        <div className={styles.filterSection}>
          <OrderFilter
            params={filterParams}
            role={role}
            tabCounts={tabCounts.data}
          />
        </div>
        <div className={styles.listHost}>
          <OrderCardList
            key={`${tab ?? ''}-${sort ?? ''}-${search ?? ''}`}
            role={role}
            initialItems={items}
            initialHasNext={pagination.hasNext}
            params={filterParams}
          />
        </div>
      </div>
    </div>
  );
}
