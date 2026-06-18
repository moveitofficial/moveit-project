import type { Provider } from '@/types/enums';

export interface WithdrawnItem {
  id: string;
  email: string;
  deletionReason: string | null;
  provider: Provider;
  createdAt: string;
  deletedAt: string;
}

export interface WithdrawnFilterParams {
  tab: 'CLIENT' | 'EXPERT';
  search?: string;
  pageSize?: number;
}
