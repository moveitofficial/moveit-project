import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';

export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';

export interface MyUser {
  provider: AuthProvider;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export function getMyUser(): Promise<ApiSuccess<MyUser>> {
  return api.get<ApiSuccess<MyUser>>('/users/me');
}

export function patchPassword(
  body: ChangePasswordBody,
): Promise<ApiSuccess<Record<string, never>>> {
  return api.patch<ApiSuccess<Record<string, never>>>(
    '/users/me/password',
    body,
  );
}
