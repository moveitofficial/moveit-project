import type { ServiceGroupName } from '@/mocks/types';

// 오른쪽 패널의 서비스 요약(전문가 다른 서비스 등).
export interface RoomServiceSummary {
  id: string;
  title: string;
  servicePrice: number;
  thumbnailUrl: string;
  group: ServiceGroupName;
}

// 백엔드 ChatRoomResponseDto와 동일 구조.
export interface MessageRoomClient {
  id: string;
  profileImageUrl: string | null;
  nickname: string | null;
}

export interface MessageRoomExpert {
  id: string;
  profileImageUrl: string | null;
  businessName: string | null;
}

export interface MessageRoomLastMessage {
  id: string;
  content: string;
  createdAt: string;
}

export interface MessageRoom {
  id: string;
  currentServiceId: string;
  clientUser: MessageRoomClient;
  expertUser: MessageRoomExpert;
  lastMessage: MessageRoomLastMessage | null;
  myLastReadMessageId: string | null;
  createdAt: string;
}

// 방에서 "상대방"으로 표시할 정보(내가 client면 expert, 내가 expert면 client).
export interface MessageRoomCounterpart {
  id: string;
  name: string;
  profileImageUrl: string | null;
}

export type ChatMessageType = 'TEXT' | 'FILE' | 'SYSTEM';

export type SystemMessageType =
  | 'TRADE_REQUEST'
  | 'TRADE_CANCELED'
  | 'TRADE_REQUEST_CANCELED'
  | 'TRADE_REQUEST_EXPIRED'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_HELD'
  | 'SCHEDULE_REQUEST'
  | 'SCHEDULE_REGISTERED'
  | 'SCHEDULE_CHANGE_REQUEST';

export interface MessageAttachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

// 백엔드 ChatMessageResponseDto와 동일 구조.
export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string | null;
  type: ChatMessageType;
  systemType: SystemMessageType | null;
  orderId: string | null;
  content: string;
  createdAt: string;
  // 백엔드 메시지 내역(findMessages)이 attachments를 include하지 않을 수 있어 옵셔널.
  attachments?: MessageAttachment[];
}

export interface MessageRoomInfoService {
  id: string;
  title: string;
  servicePrice: number;
  // 백엔드 currentService select에 thumbnail이 추가되면 채워진다.
  thumbnailUrl?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'TRADE_REQUEST_EXPIRED'
  | 'NEGOTIATING'
  | 'CANCEL_REQUESTED'
  | 'PAYMENT_CANCELLED'
  | 'IN_PROGRESS'
  | 'DEADLINE_IMMINENT'
  | 'EXPIRED'
  | 'WORK_COMPLETED'
  | 'PURCHASE_CONFIRMED'
  | 'SETTLEMENT_REQUESTED'
  | 'SETTLEMENT_COMPLETED'
  | 'REFUND_REQUESTED'
  | 'REFUND_COMPLETED';

export interface MessageRoomOrder {
  id: string;
  status: OrderStatus;
  agreedServicePrice: number;
  platformFee: number;
  totalAmount: number;
  startDate: string | null;
  endDate: string | null;
}

export interface MessageRoomInfo {
  id: string;
  currentService: MessageRoomInfoService;
  order: MessageRoomOrder | null;
}

// 메시지 내역 응답(room 정보 + 메시지 + 커서).
export interface MessageHistory {
  room: MessageRoomInfo;
  items: ChatMessage[];
  nextCursor: string | null;
}
