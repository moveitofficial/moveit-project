import type {
  ExpertApprovalStatus,
  Provider,
  ServiceType,
  ServiceStatus,
} from '@/types/enums';

import {
  EXPERT_STATUS_OPTIONS,
  PROVIDER_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  SERVICE_STATUS_OPTIONS,
} from '@/utils/constants';

export function isProvider(v: string): v is Provider {
  return PROVIDER_OPTIONS.some((option) => option.value === v);
}

export function isApprovalStatus(v: string): v is ExpertApprovalStatus {
  return EXPERT_STATUS_OPTIONS.some((option) => option.value === v);
}

export function isServiceType(v: string): v is ServiceType {
  return SERVICE_TYPE_OPTIONS.some((option) => option.value === v);
}

export function isServiceStatus(v: string): v is ServiceStatus {
  return SERVICE_STATUS_OPTIONS.some((option) => option.value === v);
}
