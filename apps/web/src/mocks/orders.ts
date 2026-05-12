import { serviceOne } from './services';

import type {
  ApiSuccess,
  OrderDetail,
  OrderListItem,
  PaginatedResult,
} from './types';

const orderOne: OrderListItem = {
  id: 'order-001',
  serviceTitle: '안드로이드 / iOS 앱 개발 React Native',
  thumbnailUrl: 'https://picsum.photos/seed/svc1/400/300',
  expertName: '코드잇 에이전시',
  status: 'IN_PROGRESS',
  totalAmount: 418_000,
  startDate: '2026-05-01T00:00:00.000Z',
  endDate: '2026-06-01T00:00:00.000Z',
  createdAt: '2026-04-25T10:00:00.000Z',
};

const orderTwo: OrderListItem = {
  id: 'order-002',
  serviceTitle: 'React 기반 웹사이트 제작 (반응형)',
  thumbnailUrl: 'https://picsum.photos/seed/svc2/400/300',
  expertName: '웹스튜디오',
  status: 'WORK_COMPLETED',
  totalAmount: 275_000,
  startDate: '2026-04-01T00:00:00.000Z',
  endDate: '2026-04-22T00:00:00.000Z',
  createdAt: '2026-03-25T15:30:00.000Z',
};

const orderThree: OrderListItem = {
  id: 'order-003',
  serviceTitle: 'Figma 기반 UI/UX 디자인 패키지',
  thumbnailUrl: 'https://picsum.photos/seed/svc4/400/300',
  expertName: '디자인 랩',
  status: 'PURCHASE_CONFIRMED',
  totalAmount: 198_000,
  startDate: '2026-03-15T00:00:00.000Z',
  endDate: '2026-03-29T00:00:00.000Z',
  createdAt: '2026-03-10T11:00:00.000Z',
};

const orderFour: OrderListItem = {
  id: 'order-004',
  serviceTitle: 'AI 챗봇 개발 (GPT API 기반)',
  thumbnailUrl: 'https://picsum.photos/seed/svc5/400/300',
  expertName: 'AI 스튜디오',
  status: 'CANCELED',
  totalAmount: 770_000,
  startDate: '2026-02-01T00:00:00.000Z',
  endDate: '2026-03-18T00:00:00.000Z',
  createdAt: '2026-01-25T09:00:00.000Z',
};

export const mockOrderList: OrderListItem[] = [orderOne, orderTwo, orderThree, orderFour];

export const mockOrderDetail: OrderDetail = {
  ...orderOne,
  service: serviceOne,
  agreedServicePrice: 380_000,
  platformFee: 38_000,
  payment: {
    id: 'pay-001',
    method: 'CARD',
    status: 'DONE',
    paidAt: '2026-04-25T10:05:00.000Z',
  },
};

export const mockMyOrdersResponse: ApiSuccess<PaginatedResult<OrderListItem>> = {
  success: true,
  message: '주문 목록을 조회했습니다.',
  data: {
    items: mockOrderList,
    pagination: { page: 1, pageSize: 20, totalCount: 4, hasNext: false },
  },
};

export const mockOrderDetailResponse: ApiSuccess<OrderDetail> = {
  success: true,
  message: '주문 상세를 조회했습니다.',
  data: mockOrderDetail,
};

export const mockCreateOrderResponse: ApiSuccess<{
  orderId: string;
  status: 'PENDING';
  totalAmount: number;
  platformFee: number;
}> = {
  success: true,
  message: '주문이 생성되었습니다.',
  data: {
    orderId: 'order-new',
    status: 'PENDING',
    totalAmount: 418_000,
    platformFee: 38_000,
  },
};
