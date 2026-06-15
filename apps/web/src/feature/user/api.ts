import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';

export interface WithdrawData {
  isDeleted: boolean;
  deletedAt: string | null;
  deletionReason: string | null;
}

export function withdrawUser(
  deletionReason: string,
): Promise<ApiSuccess<WithdrawData>> {
  return api.delete<ApiSuccess<WithdrawData>>('/users/me', { deletionReason });
}
