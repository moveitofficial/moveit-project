'use client';

import { CHAT_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useLastSenderStore } from './lastSenderStore';
import { MESSAGE_ROOMS_KEY } from './useMessage';

import type { ChatMessage } from './types';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

/**
 * 내 모든 방의 활동을 user-${myId} 채널로 받아 목록을 실시간 갱신한다.
 * 게이트웨이가 연결 시 user 채널에 join하므로 방 입장 없이도 수신된다.
 * - CHAT_NOTIFICATION: 텍스트·파일 전송 알림(평면 메시지)
 * - RECEIVE_MESSAGE: 유저 채널로 오는 시스템 메시지({ message, payload })
 */
export function useMessageNotifications() {
  const queryClient = useQueryClient();
  const setLastSender = useLastSenderStore((state) => state.setLastSender);

  useEffect(() => {
    // forceNew: 룸 소켓과 연결을 공유(multiplex)하지 않도록 독립 연결.
    const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.CHAT}`, {
      withCredentials: true,
      forceNew: true,
    });
    const handleActivity = (data: ChatMessage | { message: ChatMessage }) => {
      const message = 'message' in data ? data.message : data;
      // 목록 프로필·이름을 보낸 사람 기준으로(시스템 메시지는 senderId 없음).
      if (message.senderId !== null) {
        setLastSender(message.chatRoomId, message.senderId);
      }
      void queryClient.invalidateQueries({ queryKey: MESSAGE_ROOMS_KEY });
    };
    socket.on(CHAT_EVENTS.CHAT_NOTIFICATION, handleActivity);
    socket.on(CHAT_EVENTS.RECEIVE_MESSAGE, handleActivity);
    return () => {
      socket.off(CHAT_EVENTS.CHAT_NOTIFICATION, handleActivity);
      socket.off(CHAT_EVENTS.RECEIVE_MESSAGE, handleActivity);
      socket.disconnect();
    };
  }, [queryClient, setLastSender]);
}
