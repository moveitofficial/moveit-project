import type {
  ExpertApprovalStatus,
  Provider,
  ServiceType,
} from '@/mocks/types';

import {
  EXPERT_STATUS_OPTIONS,
  PROVIDER_OPTIONS,
  SERVICE_TYPE_OPTIONS,
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
