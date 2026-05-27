import type {
  ExpertApprovalStatus,
  Provider,
  ServiceType,
} from '@/mocks/types';

export type UserTabType = 'CLIENT' | 'EXPERT';

export interface ClientUserFilterParams {
  tab: 'CLIENT';
  search?: string;
  provider?: Provider;
  region?: string;
  pageSize?: number;
}

export interface ExpertUserFilterParams {
  tab: 'EXPERT';
  search?: string;
  provider?: Provider;
  region?: string;
  approvalStatus?: ExpertApprovalStatus;
  serviceType?: ServiceType;
  pageSize?: number;
}

export type UserFilterParams = ClientUserFilterParams | ExpertUserFilterParams;
