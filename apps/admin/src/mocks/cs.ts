import type { AdminCSChatRoom, ApiSuccess, PaginatedResult } from './types';

export const mockAdminCSChatRooms: AdminCSChatRoom[] = [
  {
    id: 'cs-001',
    user: { id: 'user-001', name: '김지훈', email: 'kim@example.com' },
    status: 'OPEN',
    lastMessage: {
      content: '결제가 안 돼요. 도와주세요.',
      createdAt: '2026-05-12T09:00:00.000Z',
    },
    unreadCount: 3,
    createdAt: '2026-05-12T08:50:00.000Z',
  },
  {
    id: 'cs-002',
    user: { id: 'user-002', name: '이수민', email: 'lee@example.com' },
    status: 'OPEN',
    lastMessage: {
      content: '주문 취소 어떻게 하나요?',
      createdAt: '2026-05-11T16:00:00.000Z',
    },
    unreadCount: 1,
    createdAt: '2026-05-11T15:50:00.000Z',
  },
  {
    id: 'cs-003',
    user: { id: 'user-003', name: '박상민', email: 'park@example.com' },
    status: 'CLOSED',
    lastMessage: {
      content: '감사합니다. 해결됐어요.',
      createdAt: '2026-05-10T14:00:00.000Z',
    },
    unreadCount: 0,
    createdAt: '2026-05-10T13:00:00.000Z',
  },
];

export const mockAdminCSChatRoomsResponse: ApiSuccess<PaginatedResult<AdminCSChatRoom>> = {
  success: true,
  message: 'CS 채팅방 목록을 조회했습니다.',
  data: {
    items: mockAdminCSChatRooms,
    pagination: { page: 1, pageSize: 50, totalCount: 3, hasNext: false },
  },
};

export const mockAdminCSMessages: {
  id: string;
  senderRole: 'USER' | 'ADMIN';
  content: string;
  createdAt: string;
}[] = [
  {
    id: 'cs-msg-001',
    senderRole: 'USER',
    content: '안녕하세요. 결제가 자꾸 실패해요.',
    createdAt: '2026-05-12T08:50:00.000Z',
  },
  {
    id: 'cs-msg-002',
    senderRole: 'ADMIN',
    content: '안녕하세요. 어떤 에러 메시지가 나오는지 알려주실 수 있을까요?',
    createdAt: '2026-05-12T08:52:00.000Z',
  },
  {
    id: 'cs-msg-003',
    senderRole: 'USER',
    content: '카드 정보가 일치하지 않는다고 떠요.',
    createdAt: '2026-05-12T09:00:00.000Z',
  },
];
