import type { ApiSuccess, Notification, PaginatedResult } from './types';

export const mockNotifications: Notification[] = [
  {
    id: 'noti-001',
    type: 'MESSAGE',
    title: '새 메시지가 도착했어요',
    content: '코드잇 에이전시님으로부터 메시지가 왔습니다.',
    linkUrl: '/chats/room-001',
    isRead: false,
    createdAt: '2026-05-12T09:30:00.000Z',
  },
  {
    id: 'noti-002',
    type: 'ORDER',
    title: '주문이 진행 중입니다',
    content: '주문 #order-001의 작업이 시작되었습니다.',
    linkUrl: '/orders/order-001',
    isRead: false,
    createdAt: '2026-05-11T14:00:00.000Z',
  },
  {
    id: 'noti-003',
    type: 'PAYMENT',
    title: '결제가 완료되었어요',
    content: '418,000원 결제가 정상 처리되었습니다.',
    linkUrl: '/orders/order-001',
    isRead: true,
    createdAt: '2026-05-10T15:30:00.000Z',
  },
  {
    id: 'noti-004',
    type: 'COMMENT',
    title: '내 글에 댓글이 달렸어요',
    content: '"React 18 vs 19" 게시글에 새 댓글이 달렸습니다.',
    linkUrl: '/community/post-001',
    isRead: true,
    createdAt: '2026-05-10T11:00:00.000Z',
  },
  {
    id: 'noti-005',
    type: 'SERVICE',
    title: '찜한 서비스가 할인 중이에요',
    content: '"NestJS 백엔드 API 구축" 서비스가 10% 할인 중입니다.',
    linkUrl: '/services/svc-003',
    isRead: true,
    createdAt: '2026-05-08T09:00:00.000Z',
  },
];

export const mockNotificationsResponse: ApiSuccess<PaginatedResult<Notification>> = {
  success: true,
  message: '알림 목록을 조회했습니다.',
  data: {
    items: mockNotifications,
    pagination: { page: 1, pageSize: 20, totalCount: 5, hasNext: false },
  },
};

export const mockUnreadCountResponse: ApiSuccess<{
  messageCount: number;
  transactionCount: number;
  communityCount: number;
}> = {
  success: true,
  message: '읽지 않은 알림 수를 조회했습니다.',
  data: {
    messageCount: 3,
    transactionCount: 5,
    communityCount: 2,
  },
};
