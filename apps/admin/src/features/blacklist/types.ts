import type { Provider } from '@/types/enums';

export interface BlacklistItem {
  id: string;
  name: string | null;
  businessName: string | null;
  email: string;
  provider: Provider;
  region: string | null;
  paymentCount: number;
  reportCount: number;
  createdAt: string;
}

export interface BlacklistFilterParams {
  tab: 'CLIENT' | 'EXPERT';
  search?: string;
  pageSize?: number;
}
