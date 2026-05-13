import type { AdminDashboard, ApiSuccess } from './types';

export const mockAdminDashboard: AdminDashboard = {
  summary: {
    pendingExpertCount: 8,
    pendingReportCount: 2,
    pendingSettlementCount: 12,
    activeOrderCount: 32,
  },
  pendingTasks: [
    { type: 'EXPERT_APPROVAL', title: '코드잇 에이전시 가입 승인 대기', createdAt: '2026-05-12T08:00:00.000Z' },
    { type: 'SETTLEMENT', title: '디자인 랩 정산 요청 (380,000원)', createdAt: '2026-05-11T15:00:00.000Z' },
    { type: 'REPORT', title: '욕설 신고 - 신고자 김지훈', createdAt: '2026-05-11T10:30:00.000Z' },
    { type: 'REFUND', title: '환불 요청 - 주문 #order-998', createdAt: '2026-05-10T16:00:00.000Z' },
  ],
  recentActivities: [
    { type: 'USER_SIGN_UP', message: '신규 회원 5명 가입', createdAt: '2026-05-12T09:00:00.000Z' },
    { type: 'ORDER_COMPLETE', message: '주문 12건 완료', createdAt: '2026-05-12T07:00:00.000Z' },
    { type: 'REVIEW', message: '리뷰 8건 등록', createdAt: '2026-05-11T22:00:00.000Z' },
  ],
};

export const mockAdminDashboardResponse: ApiSuccess<AdminDashboard> = {
  success: true,
  message: '관리자 대시보드를 조회했습니다.',
  data: mockAdminDashboard,
};
