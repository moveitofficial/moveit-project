'use client';

import { CHAT_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { io } from 'socket.io-client';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

// 채팅방에 텍스트 한 줄 전송(일회성). 연결 즉시 버퍼가 flush되므로 그 후 종료.
export function sendChatText(roomId: string, content: string): void {
  const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.CHAT}`, {
    withCredentials: true,
    forceNew: true,
  });
  socket.emit(CHAT_EVENTS.SEND_MESSAGE, { roomId, type: 'TEXT', content });
  socket.once('connect', () => {
    socket.disconnect();
  });
}
