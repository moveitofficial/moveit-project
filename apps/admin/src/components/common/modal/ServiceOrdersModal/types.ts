export interface ServiceOrderItem {
  id: string;
  status: string;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  client: { id: string; name: string | null };
  service: {
    id: string;
    title: string;
    serviceGroupName: string;
    serviceCategoryName: string;
    thumbnailUrl: string | null;
  };
}

export type ServiceOrderTab =
  | 'all'
  | 'working'
  | 'workCompleted'
  | 'purchaseConfirmed'
  | 'settlement'
  | 'expired'
  | 'cancelRefund';

export type ServiceOrderSort = 'latest' | 'endDate';

export type ServiceOrderCounts = Record<ServiceOrderTab, number>;

export interface ServiceOrdersResult {
  items: ServiceOrderItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}
