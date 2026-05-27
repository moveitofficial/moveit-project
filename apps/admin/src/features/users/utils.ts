import {
  EXPERT_STATUS_OPTIONS,
  PROVIDER_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from './constants';

import type {
  ExpertApprovalStatus,
  Provider,
  ServiceType,
} from '@/mocks/types';

export function param(raw: string | string[] | undefined): string | undefined {
  const v = typeof raw === 'string' ? raw : undefined;
  return v === '' ? undefined : v;
}

export function validated<T extends string>(
  v: string | undefined,
  guard: (s: string) => s is T,
): T | undefined {
  return v !== undefined && guard(v) ? v : undefined;
}

export function isProvider(v: string): v is Provider {
  return PROVIDER_OPTIONS.some((option) => option.value === v);
}

export function isApprovalStatus(v: string): v is ExpertApprovalStatus {
  return EXPERT_STATUS_OPTIONS.some((option) => option.value === v);
}

export function isServiceType(v: string): v is ServiceType {
  return SERVICE_TYPE_OPTIONS.some((option) => option.value === v);
}
