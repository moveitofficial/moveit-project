import type { ApiSuccess, Notification, PaginatedResult } from './types';

export const mockNotifications: Notification[] = [
  {
    id: 'noti-001',
    type: 'COMMUNITY',
    category: 'POST_COMMENT',
    content: '"React 18 vs 19" 게시글에 새 댓글이 달렸어요.',
    referenceType: 'POST',
    referenceId: 'post-001',
    isRead: false,
    createdAt: '2026-05-12T09:30:00.000Z',
  },
  {
    id: 'noti-002',
    type: 'TRANSACTION',
    category: 'ORDER_CREATED',
    content: '주문이 새로 생성되었어요. 진행 상황을 확인해주세요.',
    referenceType: 'ORDER',
    referenceId: 'order-001',
    isRead: false,
    createdAt: '2026-05-11T14:00:00.000Z',
  },
  {
    id: 'noti-003',
    type: 'TRANSACTION',
    category: 'PAYMENT_SUCCESS',
    content: '결제 418,000원이 정상 처리되었어요.',
    referenceType: 'PAYMENT',
    referenceId: 'pay-001',
    isRead: true,
    createdAt: '2026-05-10T15:30:00.000Z',
  },
  {
    id: 'noti-004',
    type: 'COMMUNITY',
    category: 'POST_LIKE',
    content: '내 게시글에 좋아요가 달렸어요.',
    referenceType: 'POST',
    referenceId: 'post-002',
    isRead: true,
    createdAt: '2026-05-10T11:00:00.000Z',
  },
  {
    id: 'noti-005',
    type: 'TRANSACTION',
    category: 'PURCHASE_CONFIRM_REQUEST',
    content: '작업이 완료되었어요. 구매확정을 요청해주세요.',
    referenceType: 'ORDER',
    referenceId: 'order-002',
    isRead: true,
    createdAt: '2026-05-09T16:00:00.000Z',
  },
  {
    id: 'noti-006',
    type: 'REMINDER',
    category: 'DEADLINE_REMINDER',
    content: '주문 마감까지 3일 남았어요.',
    referenceType: 'ORDER',
    referenceId: 'order-001',
    isRead: false,
    createdAt: '2026-05-09T09:00:00.000Z',
  },
];

export const mockNotificationsResponse: ApiSuccess<PaginatedResult<Notification>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockNotifications,
    pagination: { page: 1, pageSize: 20, totalCount: 6, hasNext: false },
  },
};

export const mockUnreadCountResponse: ApiSuccess<{
  communityCount: number;
  transactionCount: number;
  reminderCount: number;
}> = {
  success: true,
  message: '요청 성공',
  data: {
    communityCount: 1,
    transactionCount: 1,
    reminderCount: 1,
  },
};
