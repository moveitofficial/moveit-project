import type { AdminRefund, ApiSuccess, PaginatedResult } from './types';

export const mockAdminRefunds: AdminRefund[] = [
  {
    id: 'refund-001',
    orderId: 'order-998',
    serviceTitle: 'AI 챗봇 개발',
    clientName: '최영희',
    expertName: 'AI 스튜디오',
    type: 'REFUND',
    reason: '작업 결과물이 요구사항과 다릅니다.',
    refundAmount: 700_000,
    status: 'REQUESTED',
    adminMemo: null,
    createdAt: '2026-05-10T16:00:00.000Z',
    processedAt: null,
  },
  {
    id: 'refund-002',
    orderId: 'order-997',
    serviceTitle: 'React 웹사이트 제작',
    clientName: '김지훈',
    expertName: '웹스튜디오',
    type: 'CANCEL',
    reason: '개인 사정으로 취소합니다.',
    refundAmount: 250_000,
    status: 'APPROVED',
    adminMemo: '취소 정책에 따라 승인 처리',
    createdAt: '2026-05-08T10:00:00.000Z',
    processedAt: '2026-05-09T14:00:00.000Z',
  },
  {
    id: 'refund-003',
    orderId: 'order-996',
    serviceTitle: '디자인 패키지',
    clientName: '박상민',
    expertName: '디자인 랩',
    type: 'REFUND',
    reason: '작업 지연으로 환불 요청합니다.',
    refundAmount: 180_000,
    status: 'REJECTED',
    adminMemo: '환불 조건에 해당하지 않음',
    createdAt: '2026-05-05T11:00:00.000Z',
    processedAt: '2026-05-06T16:00:00.000Z',
  },
];

export const mockAdminRefundsResponse: ApiSuccess<PaginatedResult<AdminRefund>> = {
  success: true,
  message: '환불 목록을 조회했습니다.',
  data: {
    items: mockAdminRefunds,
    pagination: { page: 1, pageSize: 20, totalCount: 3, hasNext: false },
  },
};
