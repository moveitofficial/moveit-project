import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export function updatePassword(
  data: UpdatePasswordData,
): Promise<ApiSuccess<null>> {
  return api.patch<ApiSuccess<null>>('/admin/auth/password', data);
}
