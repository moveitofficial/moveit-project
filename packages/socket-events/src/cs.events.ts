// USER ↔ ADMIN CS 채팅 이벤트
export const CS_EVENTS = {
  // client/admin → server
  JOIN_ROOM: 'joinRoom',
  SEND_MESSAGE: 'sendMessage',
  CLOSE_TICKET: 'closeTicket',
  ASSIGN_ADMIN: 'assignAdmin',
  // server → client/admin
  JOINED_ROOM: 'joinedRoom',
  RECEIVE_MESSAGE: 'receiveMessage',
  TICKET_CLOSED: 'ticketClosed',
} as const;
