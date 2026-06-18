import type { ServiceStatus, ServiceType } from '@/types/enums';

export interface ServiceItem {
  id: string;
  title: string;
  categoryGroup: ServiceType;
  businessName: string | null;
  status: ServiceStatus;
  servicePrice: number;
  createdAt: string;
  orderCount: number;
}

export interface ServiceFilterParams {
  search?: string;
  categoryGroup?: ServiceType;
  status?: ServiceStatus;
  pageSize?: number;
}
