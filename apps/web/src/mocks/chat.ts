import type {
  ApiSuccess,
  ChatMessage,
  ChatRoomListItem,
  PaginatedResult,
} from './types';

export const mockChatRoomList: ChatRoomListItem[] = [
  {
    id: 'room-001',
    currentService: { id: 'svc-001', title: '안드로이드 / iOS 앱 개발 React Native' },
    opponent: {
      id: 'expert-001',
      name: '코드잇 에이전시',
      profileImageUrl: 'https://i.pravatar.cc/150?img=33',
    },
    lastMessage: {
      id: 'msg-007',
      type: 'TEXT',
      content: '네 알겠습니다. 디자인 시안 보내드릴게요!',
      createdAt: '2026-05-12T09:30:00.000Z',
    },
    unreadCount: 2,
  },
  {
    id: 'room-002',
    currentService: { id: 'svc-002', title: 'React 기반 웹사이트 제작 (반응형)' },
    opponent: {
      id: 'expert-002',
      name: '웹스튜디오',
      profileImageUrl: 'https://i.pravatar.cc/150?img=44',
    },
    lastMessage: {
      id: 'msg-020',
      type: 'TEXT',
      content: '오늘 작업 완료했습니다. 확인 부탁드려요.',
      createdAt: '2026-05-11T17:00:00.000Z',
    },
    unreadCount: 0,
  },
  {
    id: 'room-003',
    currentService: { id: 'svc-003', title: 'NestJS + PostgreSQL 백엔드 API 1:1 코칭' },
    opponent: {
      id: 'expert-003',
      name: '백엔드 마스터',
      profileImageUrl: 'https://i.pravatar.cc/150?img=55',
    },
    lastMessage: {
      id: 'msg-030',
      type: 'SYSTEM',
      content: '결제가 완료되었습니다.',
      createdAt: '2026-05-10T12:00:00.000Z',
    },
    unreadCount: 1,
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    chatRoomId: 'room-001',
    senderId: 'user-001',
    type: 'TEXT',
    systemType: null,
    content: '안녕하세요! React Native 앱 개발 문의드립니다.',
    attachments: [],
    isRead: true,
    createdAt: '2026-05-10T10:00:00.000Z',
  },
  {
    id: 'msg-002',
    chatRoomId: 'room-001',
    senderId: 'expert-001',
    type: 'TEXT',
    systemType: null,
    content: '안녕하세요! 어떤 앱을 개발하시려는지 자세히 알려주실 수 있을까요?',
    attachments: [],
    isRead: true,
    createdAt: '2026-05-10T10:05:00.000Z',
  },
  {
    id: 'msg-003',
    chatRoomId: 'room-001',
    senderId: 'user-001',
    type: 'TEXT',
    systemType: null,
    content: '커뮤니티 기능이 있는 SNS 앱이에요. iOS / Android 둘 다 필요해요.',
    attachments: [],
    isRead: true,
    createdAt: '2026-05-10T10:08:00.000Z',
  },
  {
    id: 'msg-004',
    chatRoomId: 'room-001',
    senderId: 'expert-001',
    type: 'TEXT',
    systemType: null,
    content: '네 가능합니다. 디자인 시안이 있으신가요?',
    attachments: [],
    isRead: true,
    createdAt: '2026-05-10T10:10:00.000Z',
  },
  {
    id: 'msg-005',
    chatRoomId: 'room-001',
    senderId: 'expert-001',
    type: 'FILE',
    systemType: null,
    content: '견적서 파일 보내드립니다.',
    attachments: [
      {
        url: 'https://example.com/files/quote-001.pdf',
        fileName: '견적서_codeit_20260510.pdf',
        fileSize: 245_678,
        fileType: 'application/pdf',
      },
    ],
    isRead: true,
    createdAt: '2026-05-10T10:30:00.000Z',
  },
  {
    id: 'msg-006',
    chatRoomId: 'room-001',
    senderId: 'expert-001',
    type: 'SYSTEM',
    systemType: 'TRADE_REQUEST_RECEIVED',
    content: '전문가가 거래를 요청했어요.',
    attachments: [],
    isRead: false,
    createdAt: '2026-05-12T09:25:00.000Z',
  },
  {
    id: 'msg-007',
    chatRoomId: 'room-001',
    senderId: 'expert-001',
    type: 'TEXT',
    systemType: null,
    content: '네 알겠습니다. 디자인 시안 보내드릴게요!',
    attachments: [],
    isRead: false,
    createdAt: '2026-05-12T09:30:00.000Z',
  },
];

export const mockChatRoomsResponse: ApiSuccess<{ items: ChatRoomListItem[] }> = {
  success: true,
  message: '요청 성공',
  data: { items: mockChatRoomList },
};

export const mockChatMessagesResponse: ApiSuccess<PaginatedResult<ChatMessage>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockChatMessages,
    pagination: { page: 1, pageSize: 50, totalCount: 7, hasNext: false },
  },
};
