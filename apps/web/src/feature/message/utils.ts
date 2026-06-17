import type {
  MessageRoom,
  MessageRoomCounterpart,
  OrderStatus,
} from './types';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

// 내가 client인지 expert인지에 따라 상대방 정보를 고른다.
export function getCounterpart(
  room: MessageRoom,
  myId: string | null,
): MessageRoomCounterpart {
  const isMeClient = myId !== null && room.clientUser.id === myId;
  const target = isMeClient ? room.expertUser : room.clientUser;
  const name = isMeClient
    ? room.expertUser.businessName
    : room.clientUser.nickname;

  return {
    id: target.id,
    name: name ?? '알 수 없음',
    profileImageUrl: target.profileImageUrl,
  };
}

export function getCounterpartInitials(name: string): string {
  return name.replaceAll(' ', '').slice(0, 2);
}

// 목록 표시용: 마지막으로 보낸 사람 기준 프로필·이름(모르면 상대방으로 폴백).
export function getRoomDisplayPerson(
  room: MessageRoom,
  myId: string | null,
  lastSenderId: string | undefined,
): Pick<MessageRoomCounterpart, 'name' | 'profileImageUrl'> {
  if (lastSenderId === room.expertUser.id) {
    return {
      name: room.expertUser.businessName ?? '알 수 없음',
      profileImageUrl: room.expertUser.profileImageUrl,
    };
  }
  if (lastSenderId === room.clientUser.id) {
    return {
      name: room.clientUser.nickname ?? '알 수 없음',
      profileImageUrl: room.clientUser.profileImageUrl,
    };
  }
  const counterpart = getCounterpart(room, myId);
  return {
    name: counterpart.name,
    profileImageUrl: counterpart.profileImageUrl,
  };
}

// 목록 시간 표기: 1분 내 "방금 전", 오늘 "HH:mm", 그 외 "YY.MM.DD".
export function formatRoomTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 60_000) {
    return '방금 전';
  }

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return `${String(date.getFullYear()).slice(2)}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

export function hasUnread(room: MessageRoom): boolean {
  if (room.lastMessage === null) {
    return false;
  }
  return room.lastMessage.id !== room.myLastReadMessageId;
}

// 대화 버블 옆 시간 표기 (HH:mm).
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 일정 날짜 표기 (YYYY.MM.DD).
export function formatScheduleDate(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getFullYear())}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

// 결제 일시 표기 (YYYY.MM.DD 오전/오후 hh:mm).
export function formatPaymentDateTime(iso: string): string {
  const date = new Date(iso);
  const hour = date.getHours();
  const meridiem = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(date.getFullYear())}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${meridiem} ${pad(hour12)}:${pad(date.getMinutes())}`;
}

const ORDER_STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  PENDING: '결제 대기',
  NEGOTIATING: '논의중',
  IN_PROGRESS: '작업중',
  DEADLINE_IMMINENT: '마감임박',
  WORK_COMPLETED: '작업완료',
  PURCHASE_CONFIRMED: '구매확정',
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}
