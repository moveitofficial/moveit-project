import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';

export interface SignInData {
  email: string;
  password: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  isSuper: boolean;
  mustChangePassword: boolean;
}

export type SignInResponse = ApiSuccess<{ admin: AdminAccount }>;

export function signIn(data: SignInData): Promise<SignInResponse> {
  return api.post<SignInResponse>('/admin/auth/signin', data);
}

export function signOut(): Promise<ApiSuccess<null>> {
  return api.post<ApiSuccess<null>>('/admin/auth/signout', {});
}
