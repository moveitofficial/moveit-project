import type { AdminSettlement, ApiSuccess, PaginatedResult } from './types';

const adminSettlementOne: AdminSettlement = {
  id: 'settle-001',
  expertId: 'expert-001',
  expertName: '박전문가',
  companyName: '코드잇 에이전시',
  amount: 380_000,
  status: 'REQUESTED',
  bankName: '국민은행',
  bankAccount: '123-456-789',
  adminMemo: null,
  requestedAt: '2026-05-11T15:00:00.000Z',
  processedAt: null,
};

export const mockAdminSettlements: AdminSettlement[] = [
  adminSettlementOne,
  {
    id: 'settle-002',
    expertId: 'expert-002',
    expertName: '이디자이너',
    companyName: '웹스튜디오',
    amount: 225_000,
    status: 'APPROVED',
    bankName: '신한은행',
    bankAccount: '987-654-321',
    adminMemo: '정산 승인 처리',
    requestedAt: '2026-05-09T10:00:00.000Z',
    processedAt: '2026-05-10T11:00:00.000Z',
  },
  {
    id: 'settle-003',
    expertId: 'expert-003',
    expertName: '김백엔드',
    companyName: '백엔드 마스터',
    amount: 450_000,
    status: 'COMPLETED',
    bankName: '우리은행',
    bankAccount: '555-666-777',
    adminMemo: '정산 완료',
    requestedAt: '2026-05-01T09:00:00.000Z',
    processedAt: '2026-05-03T16:00:00.000Z',
  },
];

export const mockAdminSettlementsResponse: ApiSuccess<PaginatedResult<AdminSettlement>> = {
  success: true,
  message: '정산 목록을 조회했습니다.',
  data: {
    items: mockAdminSettlements,
    pagination: { page: 1, pageSize: 20, totalCount: 3, hasNext: false },
  },
};

export const mockAdminSettlementDetailResponse: ApiSuccess<AdminSettlement> = {
  success: true,
  message: '정산 상세를 조회했습니다.',
  data: adminSettlementOne,
};
