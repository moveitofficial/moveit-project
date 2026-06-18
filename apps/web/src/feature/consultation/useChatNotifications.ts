'use client';

import { CHAT_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import {
  deleteAllChatNotifications,
  deleteChatNotification,
  getChatNotifications,
} from './chatNotifications';

const CHAT_NOTIFICATIONS_KEY = ['chatNotifications'];

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

export function useChatNotifications() {
  return useQuery({
    queryKey: CHAT_NOTIFICATIONS_KEY,
    queryFn: getChatNotifications,
  });
}

export function useDeleteChatNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChatNotification,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CHAT_NOTIFICATIONS_KEY }),
  });
}

export function useDeleteAllChatNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllChatNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CHAT_NOTIFICATIONS_KEY }),
  });
}

export function useChatNotificationSocket() {
  const queryClient = useQueryClient();
  useEffect(() => {
    // forceNew: 룸/메시지 소켓과 연결을 공유(multiplex)하지 않도록 독립 연결.
    const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.CHAT}`, {
      withCredentials: true,
      forceNew: true,
    });
    const invalidate = (): void => {
      void queryClient.invalidateQueries({ queryKey: CHAT_NOTIFICATIONS_KEY });
    };
    // CHAT_NOTIFICATION: 텍스트·파일 / RECEIVE_MESSAGE: 시스템 메시지(일정·결제·거래요청 등)
    socket.on(CHAT_EVENTS.CHAT_NOTIFICATION, invalidate);
    socket.on(CHAT_EVENTS.RECEIVE_MESSAGE, invalidate);
    return () => {
      socket.off(CHAT_EVENTS.CHAT_NOTIFICATION, invalidate);
      socket.off(CHAT_EVENTS.RECEIVE_MESSAGE, invalidate);
      socket.disconnect();
    };
  }, [queryClient]);
}
