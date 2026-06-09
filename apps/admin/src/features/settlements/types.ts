import type {
  ServiceCategory,
  ServiceType,
  SettlementStatus,
} from '@/types/enums';

export interface SettlementFilterParams {
  search?: string;
  status?: SettlementStatus;
}

export interface SettlementItem {
  id: string;
  status: SettlementStatus;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  settledAt: string | null;
  settledByAdminName: string | null;
  client: {
    id: string;
    name: string | null;
  };
  expert: {
    id: string;
    businessName: string | null;
  };
  service: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    categoryGroup: ServiceType;
    categoryName: ServiceCategory;
  };
}
