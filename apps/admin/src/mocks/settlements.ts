import type { AdminSettlement, ApiSuccess, PaginatedResult } from './types';

const settlementOne: AdminSettlement = {
  id: 'settle-001',
  expertId: 'expert-001',
  expertName: '코드잇 에이전시',
  companyName: '코드잇',
  serviceTitle: '프로팀의 앱개발 센스있는 디자인+개발 합니다.',
  thumbnailUrl: '/service-thumbnail.jpg',
  categoryName: 'IT 코칭 > APP 제작',
  clientName: '조한준',
  amount: 80_000_000,
  status: 'SETTLEMENT_COMPLETED',
  bankName: '국민은행',
  bankAccount: '123-456-789',
  adminMemo: '정산 완료',
  startDate: '2025-05-27T00:00:00.000Z',
  endDate: '2025-06-24T00:00:00.000Z',
  requestedAt: '2025-06-25T10:00:00.000Z',
  processedAt: '2025-06-26T11:00:00.000Z',
};

const adminSettlements: AdminSettlement[] = [
  settlementOne,
  {
    id: 'settle-002',
    expertId: 'expert-002',
    expertName: '웹스튜디오',
    companyName: '웹스튜디오',
    serviceTitle: 'React 웹사이트 풀스택 개발 — 기획부터 배포까지',
    thumbnailUrl: '/service-thumbnail.jpg',
    categoryName: 'IT 코칭 > 웹 개발',
    clientName: '이수민',
    amount: 3_200_000,
    status: 'SETTLEMENT_REQUESTED',
    bankName: '신한은행',
    bankAccount: '987-654-321',
    adminMemo: null,
    startDate: '2025-04-01T00:00:00.000Z',
    endDate: '2025-04-30T00:00:00.000Z',
    requestedAt: '2025-05-02T09:00:00.000Z',
    processedAt: null,
  },
  {
    id: 'settle-003',
    expertId: 'expert-003',
    expertName: '디자인 랩',
    companyName: '디자인 랩',
    serviceTitle: 'UI/UX 디자인 시스템 구축 및 컨설팅',
    thumbnailUrl: '/service-thumbnail.jpg',
    categoryName: '프로젝트 의뢰 > 디자인',
    clientName: '최영희',
    amount: 1_980_000,
    status: 'SETTLEMENT_COMPLETED',
    bankName: '우리은행',
    bankAccount: '555-666-777',
    adminMemo: '정산 완료',
    startDate: '2025-03-10T00:00:00.000Z',
    endDate: '2025-04-10T00:00:00.000Z',
    requestedAt: '2025-04-12T14:00:00.000Z',
    processedAt: '2025-04-14T10:00:00.000Z',
  },
  {
    id: 'settle-004',
    expertId: 'expert-004',
    expertName: 'AI 스튜디오',
    companyName: 'AI 스튜디오',
    serviceTitle: 'AI 챗봇 개발 및 LLM 파인튜닝 서비스',
    thumbnailUrl: '/service-thumbnail.jpg',
    categoryName: 'IT 코칭 > AI/머신러닝',
    clientName: '김민수',
    amount: 7_700_000,
    status: 'SETTLEMENT_REQUESTED',
    bankName: '하나은행',
    bankAccount: '111-222-333',
    adminMemo: null,
    startDate: '2025-02-01T00:00:00.000Z',
    endDate: '2025-03-15T00:00:00.000Z',
    requestedAt: '2025-03-17T08:00:00.000Z',
    processedAt: null,
  },
];

export const mockAdminSettlements: AdminSettlement[] = adminSettlements;

export const mockAdminSettlementsResponse: ApiSuccess<
  PaginatedResult<AdminSettlement>
> = {
  success: true,
  message: '정산 목록을 조회했습니다.',
  data: {
    items: adminSettlements,
    pagination: {
      page: 1,
      pageSize: 50,
      totalCount: adminSettlements.length,
      hasNext: false,
    },
  },
};

export const mockAdminSettlementDetailResponse: ApiSuccess<AdminSettlement> = {
  success: true,
  message: '정산 상세를 조회했습니다.',
  data: settlementOne,
};
