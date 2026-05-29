export interface ClientBlacklistFilterParams {
  tab: 'CLIENT';
  search?: string;
  pageSize?: number;
}

export interface ExpertBlacklistFilterParams {
  tab: 'EXPERT';
  search?: string;
  pageSize?: number;
}

export type BlacklistFilterParams =
  | ClientBlacklistFilterParams
  | ExpertBlacklistFilterParams;
