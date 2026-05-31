// CLIENT ↔ EXPERT 상담 채팅 이벤트
export const CHAT_EVENTS = {
  // client → server
  GET_OR_CREATE_ROOM: 'getOrCreateRoom',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  SEND_MESSAGE: 'sendMessage',
  MARK_READ: 'markRead',
  // server → client
  ROOM_READY: 'roomReady',
  JOINED_ROOM: 'joinedRoom',
  RECEIVE_MESSAGE: 'receiveMessage',
} as const;
