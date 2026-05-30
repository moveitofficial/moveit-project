import type { AdminWithdrawnExpert, AdminWithdrawnUser } from './types';

export const mockWithdrawnUsers: AdminWithdrawnUser[] = [
  {
    id: 'wd-user-001',
    email: 'kim@naver.com',
    withdrawReason: '더 이상 서비스를 이용하지 않아서 탈퇴합니다.',
    provider: 'LOCAL',
    createdAt: '2024-04-29T10:00:00.000Z',
    withdrawnAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'wd-user-002',
    email: 'lee@naver.com',
    withdrawReason: '서비스 이용 중 불편한 점이 있었습니다.',
    provider: 'NAVER',
    createdAt: '2024-04-29T10:00:00.000Z',
    withdrawnAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'wd-user-003',
    email: 'park@kakao.com',
    withdrawReason: '개인정보 보호를 위해 탈퇴합니다.',
    provider: 'KAKAO',
    createdAt: '2024-04-29T10:00:00.000Z',
    withdrawnAt: '2026-05-01T10:00:00.000Z',
  },
];

export const mockWithdrawnExperts: AdminWithdrawnExpert[] = [
  {
    id: 'wd-expert-001',
    email: 'expert1@naver.com',
    withdrawReason: '사업을 정리하게 되어 탈퇴합니다.',
    provider: 'LOCAL',
    createdAt: '2024-04-29T10:00:00.000Z',
    withdrawnAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'wd-expert-002',
    email: 'expert2@gmail.com',
    withdrawReason: '서비스 이용 중 불편한 점이 있었습니다.',
    provider: 'GOOGLE',
    createdAt: '2024-04-29T10:00:00.000Z',
    withdrawnAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'wd-expert-003',
    email: 'expert3@kakao.com',
    withdrawReason: '수수료가 너무 높아 다른 플랫폼을 이용하겠습니다.',
    provider: 'KAKAO',
    createdAt: '2024-04-29T10:00:00.000Z',
    withdrawnAt: '2026-05-01T10:00:00.000Z',
  },
];
