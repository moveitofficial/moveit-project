// 백엔드 Prisma enum과 1:1 대응 (web은 @prisma/client 미사용)
export type CsChatStatus = 'OPEN' | 'ASSIGNED' | 'CLOSED';
export type SenderType = 'USER' | 'ADMIN';
export type CsMessageType = 'TEXT' | 'FILE' | 'SYSTEM';

/** 위젯 패널 하단 탭 */
export type CsChatTab = 'home' | 'list';

/**
 * 패널 본문에 표시되는 화면.
 * - bot: 봇 스크립트 플로우(인사·메뉴·자동응답·동의)
 * - room: 상담원과의 실시간 채팅방 (2단계)
 */
export type CsChatView = 'bot' | 'room';

/** 봇 스크립트 메뉴 (자동응답 4종 + 상담원 연결) */
export type CsBotMenu = 'SALES' | 'ORDER' | 'TAX' | 'SETTLEMENT';

/** 봇 트랜스크립트 한 줄 */
export interface CsBotEntry {
  id: string;
  role: 'bot' | 'user';
  /** 줄바꿈 포함 본문 (lines가 있으면 무시) */
  text: string;
  /** line별 강조 렌더 (인사 카피용) */
  lines?: { text: string; bold?: boolean }[];
  /** 봇 메시지 하단 캡션 (예: "무브잇 고객센터") */
  caption?: string;
}

/** 트랜스크립트 하단에 노출되는 선택지(칩/버튼) */
export interface CsBotChoice {
  label: string;
  action: CsBotAction;
}

/** 선택지를 눌렀을 때 수행할 동작 */
export type CsBotAction =
  | { type: 'menu' }
  | { type: 'autoReply'; menu: CsBotMenu }
  | { type: 'connect' }
  | { type: 'agree' }
  | { type: 'disagree' }
  | { type: 'backToStart' };

// ── 백엔드(/cs) 응답 타입 ─────────────────────────────

export interface CsRoomLastMessage {
  id: string;
  content: string;
  createdAt: string;
}

export interface CsRoom {
  id: string;
  status: CsChatStatus;
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

/** 라이브 채팅 렌더 항목: 실제 메시지 | 시스템 라인 */
export type CsLiveItem = CsMessage | CsLiveSystem;

export const isCsSystem = (item: CsLiveItem): item is CsLiveSystem =>
  'kind' in item;
