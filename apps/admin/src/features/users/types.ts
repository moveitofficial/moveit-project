import type { ExpertApprovalStatus, Provider, ServiceType } from '@/types/enums';

export interface UserItem {
  id: string;
  name: string | null;
  email: string;
  provider: Provider;
  region: string | null;
  paymentCount: number;
  reportCount: number;
  businessName: string | null;
  specialtyGroup: ServiceType | null;
  approvalStatus: ExpertApprovalStatus | null;
  createdAt: string;
}

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
