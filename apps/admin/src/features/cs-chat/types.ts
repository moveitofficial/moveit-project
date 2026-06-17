// 백엔드 Prisma enum과 1:1 대응 (admin은 @prisma/client 미사용)
export type CsChatStatus = 'OPEN' | 'ASSIGNED' | 'CLOSED';
export type SenderType = 'USER' | 'ADMIN';
export type CsMessageType = 'TEXT' | 'FILE' | 'SYSTEM';

export interface CsRoomUser {
  id: string;
  profileImageUrl: string | null;
  nickname: string | null;
}

export interface CsRoomAdmin {
  id: string;
  name: string;
}

export interface CsRoomLastMessage {
  id: string;
  content: string;
  createdAt: string;
}

/** GET /admin/cs/rooms 항목 */
export interface CsAdminRoom {
  id: string;
  status: CsChatStatus;
  user: CsRoomUser;
  assignedAdmin: CsRoomAdmin | null;
  lastMessage: CsRoomLastMessage | null;
  myLastReadMessageId: string | null;
  createdAt: string;
}

export interface CsMessageAttachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface CsMessage {
  id: string;
  chatRoomId: string;
  senderType: SenderType;
  senderUserId: string | null;
  senderAdminId: string | null;
  type: CsMessageType;
  content: string;
  createdAt: string;
  attachments?: CsMessageAttachment[];
}

/** 라이브 채팅 시스템 안내 라인 */
export interface CsLiveSystem {
  kind: 'system';
  id: string;
  text: string;
}

export type CsLiveItem = CsMessage | CsLiveSystem;

export const isCsSystem = (item: CsLiveItem): item is CsLiveSystem =>
  'kind' in item;
