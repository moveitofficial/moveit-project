import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';
import type { Role } from '@/types/enums';

export interface SignInData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  ProfileImageUrl: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
}

export type SignInResponse = ApiSuccess<{ user: User }>;

export function signIn(data: SignInData): Promise<SignInResponse> {
  return api.post<SignInResponse>('/auth/signin', data);
}

export function signOut(): Promise<ApiSuccess<null>> {
  return api.post<ApiSuccess<null>>('/auth/signout', {});
}
