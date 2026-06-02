import type { ApiSuccess, Role, User } from './types';

export const mockClientUser: User = {
  id: 'user-001',
  email: 'kim@example.com',
  name: '김지훈',
  role: 'CLIENT',
  provider: 'LOCAL',
  profileImageUrl: 'https://i.pravatar.cc/150?img=12',
  region: 'SEOUL',
  phoneNumber: '010-1234-5678',
  isBlocked: false,
  isDeleted: false,
  createdAt: '2026-01-15T09:00:00.000Z',
};

export const mockExpertUser: User = {
  id: 'expert-001',
  email: 'expert@example.com',
  name: '박전문가',
  role: 'EXPERT',
  provider: 'LOCAL',
  profileImageUrl: 'https://i.pravatar.cc/150?img=33',
  region: 'GYEONGGI_SOUTH',
  phoneNumber: '010-9876-5432',
  isBlocked: false,
  isDeleted: false,
  createdAt: '2025-11-20T10:30:00.000Z',
};

export const mockBlockedUser: User = {
  id: 'user-blocked-001',
  email: 'blocked@example.com',
  name: '차단된유저',
  role: 'CLIENT',
  provider: 'KAKAO',
  profileImageUrl: null,
  region: null,
  phoneNumber: null,
  isBlocked: true,
  isDeleted: false,
  createdAt: '2025-08-10T12:00:00.000Z',
};

export const mockCurrentUser = mockClientUser;

export function getMockAuthUser(): User | null {
  const flag = process.env.NEXT_PUBLIC_MOCK_AUTH_USER?.trim().toLowerCase();
  if (flag === 'false') {
    return null;
  }
  if (flag === 'true') {
    return mockCurrentUser;
  }
  if (process.env.NODE_ENV === 'development') {
    return mockCurrentUser;
  }

  return null;
}

export const mockCurrentUserResponse: ApiSuccess<User> = {
  success: true,
  message: '요청 성공',
  data: mockCurrentUser,
};

export const mockSignInResponse: ApiSuccess<{ user: User }> = {
  success: true,
  message: '요청 성공',
  data: { user: mockCurrentUser },
};

export const mockSignUpResponse: ApiSuccess<{
  userId: string;
  role: Role;
  onboardingRequired: boolean;
}> = {
  success: true,
  message: '요청 성공',
  data: {
    userId: 'user-002',
    role: 'CLIENT',
    onboardingRequired: true,
  },
};
