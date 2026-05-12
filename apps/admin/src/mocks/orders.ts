import type { AdminOrder, ApiSuccess, PaginatedResult } from './types';

const adminOrderOne: AdminOrder = {
  id: 'order-001',
  serviceTitle: 'React Native 앱 개발',
  expertName: '코드잇 에이전시',
  clientName: '김지훈',
  status: 'IN_PROGRESS',
  totalAmount: 418_000,
  platformFee: 38_000,
  paymentStatus: 'DONE',
  createdAt: '2026-04-25T10:00:00.000Z',
  startDate: '2026-05-01T00:00:00.000Z',
  endDate: '2026-06-01T00:00:00.000Z',
};

export const mockAdminOrders: AdminOrder[] = [
  adminOrderOne,
  {
    id: 'order-002',
    serviceTitle: 'React 웹사이트 제작',
    expertName: '웹스튜디오',
    clientName: '이수민',
    status: 'WORK_COMPLETED',
    totalAmount: 275_000,
    platformFee: 25_000,
    paymentStatus: 'DONE',
    createdAt: '2026-03-25T15:30:00.000Z',
    startDate: '2026-04-01T00:00:00.000Z',
    endDate: '2026-04-22T00:00:00.000Z',
  },
  {
    id: 'order-003',
    serviceTitle: 'UI/UX 디자인 패키지',
    expertName: '디자인 랩',
    clientName: '박상민',
    status: 'PURCHASE_CONFIRMED',
    totalAmount: 198_000,
    platformFee: 18_000,
    paymentStatus: 'DONE',
    createdAt: '2026-03-10T11:00:00.000Z',
    startDate: '2026-03-15T00:00:00.000Z',
    endDate: '2026-03-29T00:00:00.000Z',
  },
  {
    id: 'order-004',
    serviceTitle: 'AI 챗봇 개발',
    expertName: 'AI 스튜디오',
    clientName: '최영희',
    status: 'CANCELED',
    totalAmount: 770_000,
    platformFee: 70_000,
    paymentStatus: 'CANCELED',
    createdAt: '2026-01-25T09:00:00.000Z',
    startDate: '2026-02-01T00:00:00.000Z',
    endDate: '2026-03-18T00:00:00.000Z',
  },
];

export const mockAdminOrdersResponse: ApiSuccess<PaginatedResult<AdminOrder>> = {
  success: true,
  message: '주문 내역을 조회했습니다.',
  data: {
    items: mockAdminOrders,
    pagination: { page: 1, pageSize: 20, totalCount: 4, hasNext: false },
  },
};

export const mockAdminOrderDetailResponse: ApiSuccess<AdminOrder> = {
  success: true,
  message: '거래 상세를 조회했습니다.',
  data: adminOrderOne,
};
