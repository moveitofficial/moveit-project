import type { SettlementStatus } from '@/types/enums';

export interface SettlementFilterParams {
  search?: string;
  status?: SettlementStatus;
}
