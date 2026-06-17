'use client';

import { CHAT_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import type { ChatMessage } from './types';
import type { Socket } from 'socket.io-client';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

interface MessageRoomSocketHandlers {
  onMessage: (message: ChatMessage) => void;
}

// chat 네임스페이스 소켓 연결 + 룸 참가. 텍스트 전송·읽음 처리 제공.
export function useMessageRoomSocket(
  roomId: string | null,
  handlers: MessageRoomSocketHandlers,
) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!roomId) return;

    // forceNew: 알림 소켓과 연결을 공유(multiplex)하지 않도록 독립 연결.
    const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.CHAT}`, {
      withCredentials: true,
      forceNew: true,
    });
    socket.emit(CHAT_EVENTS.JOIN_ROOM, { roomId });
    socket.on(
      CHAT_EVENTS.RECEIVE_MESSAGE,
      (data: ChatMessage | { message: ChatMessage }) => {
        // 시스템 메시지는 { message, payload } 형태로 오므로 풀어준다.
        const message = 'message' in data ? data.message : data;
        // 이 방 메시지만 반영(유저 채널로 온 다른 방 메시지 제외).
        if (message.chatRoomId === roomId) {
          handlersRef.current.onMessage(message);
        }
      },
    );
    socketRef.current = socket;

    return () => {
      socket.emit(CHAT_EVENTS.LEAVE_ROOM, { roomId });
      socket.off(CHAT_EVENTS.RECEIVE_MESSAGE);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const sendText = (content: string) => {
    socketRef.current?.emit(CHAT_EVENTS.SEND_MESSAGE, {
      roomId,
      type: 'TEXT',
      content,
    });
  };

  const markRead = (messageId: string) => {
    socketRef.current?.emit(CHAT_EVENTS.MARK_READ, { roomId, messageId });
  };

  return { sendText, markRead };
}
