import type { ApiSuccess, User } from './types';

export const mockCurrentUser: User = {
  id: 'user-001',
  email: 'kim@example.com',
  name: '김지훈',
  role: 'CLIENT',
  profileImageUrl: 'https://i.pravatar.cc/150?img=12',
  isBlocked: false,
  isDeleted: false,
};

export const mockSignInResponse: ApiSuccess<{ accessToken: string; user: User }> = {
  success: true,
  message: '로그인되었습니다.',
  data: {
    accessToken: 'mock-access-token',
    user: mockCurrentUser,
  },
};

export const mockSignUpResponse: ApiSuccess<{
  userId: string;
  role: 'CLIENT' | 'EXPERT';
  onboardingRequired: boolean;
}> = {
  success: true,
  message: '회원가입이 완료되었습니다.',
  data: {
    userId: 'user-002',
    role: 'CLIENT',
    onboardingRequired: true,
  },
};

export const mockOAuthSignInResponse: ApiSuccess<{
  accessToken: string;
  isNewUser: boolean;
  onboardingRequired: boolean;
  user: Pick<User, 'id' | 'email' | 'role'>;
}> = {
  success: true,
  message: 'SNS 로그인에 성공했습니다.',
  data: {
    accessToken: 'mock-oauth-token',
    isNewUser: true,
    onboardingRequired: true,
    user: {
      id: 'user-003',
      email: 'oauth@example.com',
      role: null as unknown as User['role'],
    },
  },
};

export const mockExpertUser: User = {
  id: 'expert-001',
  email: 'expert@example.com',
  name: '박전문가',
  role: 'EXPERT',
  profileImageUrl: 'https://i.pravatar.cc/150?img=33',
  isBlocked: false,
  isDeleted: false,
};
