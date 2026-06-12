import type { ServiceOrderSort, ServiceOrderTab } from './types';

export const SERVICE_ORDER_TABS: {
  key: ServiceOrderTab;
  label: string;
}[] = [
  { key: 'all', label: '전체' },
  { key: 'working', label: '작업/논의중' },
  { key: 'workCompleted', label: '작업완료' },
  { key: 'purchaseConfirmed', label: '구매확정' },
  { key: 'settlement', label: '정산요청/완료' },
  { key: 'expired', label: '기한만료' },
  { key: 'cancelRefund', label: '환불·취소' },
];

export const SERVICE_ORDER_SORT_OPTIONS: {
  key: ServiceOrderSort;
  label: string;
}[] = [
  { key: 'latest', label: '최신순' },
  { key: 'endDate', label: '마감일 순' },
];
