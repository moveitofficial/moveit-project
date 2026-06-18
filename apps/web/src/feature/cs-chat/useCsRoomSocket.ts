'use client';

import { CS_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import type { CsMessage } from './types';
import type { Socket } from 'socket.io-client';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

interface CsRoomSocketHandlers {
  onMessage: (message: CsMessage) => void;
  onAdminAssigned: () => void;
}

/**
 * cs 네임스페이스 소켓 연결 + 룸 참가.
 * roomId가 생기면 연결하고, 메시지/상담원배정 이벤트를 콜백으로 전달한다.
 */
export function useCsRoomSocket(
  roomId: string | null,
  handlers: CsRoomSocketHandlers,
) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!roomId) return;

    const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.CS}`, {
      withCredentials: true,
    });
    socket.emit(CS_EVENTS.JOIN_ROOM, { roomId });
    socket.on(CS_EVENTS.RECEIVE_MESSAGE, (message: CsMessage) => {
      handlersRef.current.onMessage(message);
    });
    socket.on(CS_EVENTS.ADMIN_ASSIGNED, () => {
      handlersRef.current.onAdminAssigned();
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const sendMessage = (content: string) => {
    socketRef.current?.emit(CS_EVENTS.SEND_MESSAGE, {
      roomId,
      type: 'TEXT',
      content,
    });
  };

  return { sendMessage };
}
