import type { AdminDashboard, ApiSuccess } from './types';

export const mockAdminDashboard: AdminDashboard = {
  summary: {
    pendingExpertCount: 8,
    pendingReportCount: 2,
    pendingSettlementCount: 12,
    activeOrderCount: 32,
  },
  pendingTasks: [
    {
      type: 'EXPERT_APPROVAL',
      title: '코드잇 에이전시 가입 승인 대기',
      requester: '김지훈',
      createdAt: '2026-05-20T15:00:00.000Z',
    },
    {
      type: 'SETTLEMENT',
      title: '디자인 랩 정산 요청 (380,000원)',
      requester: '이서연',
      createdAt: '2026-05-20T15:00:00.000Z',
    },
    {
      type: 'REPORT',
      title: '욕설 신고 - 신고자 김지훈',
      requester: '이서연',
      createdAt: '2026-05-19T10:30:00.000Z',
    },
    {
      type: 'CS',
      title: 'IT코칭 문의드립니다.',
      requester: '정하늘',
      createdAt: '2026-05-18T08:00:00.000Z',
    },
    {
      type: 'EXPERT_APPROVAL',
      title: '무브잇 파트너스 가입 승인 대기',
      requester: '박서준',
      createdAt: '2026-05-17T16:00:00.000Z',
    },
  ],
  recentActivities: [
    {
      type: 'EXPERT_APPROVED',
      message: '김지훈 판매자 권한 승인',
      adminName: '코드잇 관리자',
      createdAt: '2026-05-20T19:00:00.000Z',
    },
    {
      type: 'EXPERT_REJECTED',
      message: '개발에이전시 판매자 권한 거절',
      adminName: '김코드 관리자',
      createdAt: '2026-05-20T10:00:00.000Z',
    },
    {
      type: 'MAIN_UPDATED',
      message: '메인 가장 많이 찾는 IT코칭 수정',
      adminName: '김코드 관리자',
      createdAt: '2026-05-20T10:00:00.000Z',
    },
    {
      type: 'BLACKLIST_ADDED',
      message: '김지훈 판매자 블랙리스트 등록',
      adminName: '코드잇 관리자',
      createdAt: '2026-05-19T22:00:00.000Z',
    },
    {
      type: 'REFUND_APPROVED',
      message: '환불 승인',
      adminName: '김코드 관리자',
      createdAt: '2026-05-19T22:00:00.000Z',
    },
    {
      type: 'FAQ_UPDATED',
      message: 'FAQ 정산문의 수정',
      adminName: '코드잇 관리자',
      createdAt: '2026-05-18T22:00:00.000Z',
    },
  ],
};

export const mockAdminDashboardResponse: ApiSuccess<AdminDashboard> = {
  success: true,
  message: '관리자 대시보드를 조회했습니다.',
  data: mockAdminDashboard,
};
