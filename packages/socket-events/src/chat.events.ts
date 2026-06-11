// CLIENT ↔ EXPERT 채팅 이벤트
export const CHAT_EVENTS = {
  // client → server
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  SEND_MESSAGE: 'sendMessage',
  MARK_READ: 'markRead',
  // server → client
  JOINED_ROOM: 'joinedRoom',
  RECEIVE_MESSAGE: 'receiveMessage',
} as const;
