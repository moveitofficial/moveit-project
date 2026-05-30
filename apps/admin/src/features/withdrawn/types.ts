export interface ClientWithdrawnFilterParams {
  tab: 'CLIENT';
  search?: string;
  pageSize?: number;
}

export interface ExpertWithdrawnFilterParams {
  tab: 'EXPERT';
  search?: string;
  pageSize?: number;
}

export type WithdrawnFilterParams =
  | ClientWithdrawnFilterParams
  | ExpertWithdrawnFilterParams;
