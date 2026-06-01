import type { ServiceStatus, ServiceType } from '@/mocks/types';

export interface ServiceFilterParams {
  search?: string;
  serviceType?: ServiceType;
  status?: ServiceStatus;
  pageSize?: number;
}
