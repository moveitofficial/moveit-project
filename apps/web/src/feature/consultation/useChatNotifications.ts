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
    const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.CHAT}`, {
      withCredentials: true,
    });
    socket.on(CHAT_EVENTS.CHAT_NOTIFICATION, () => {
      void queryClient.invalidateQueries({ queryKey: CHAT_NOTIFICATIONS_KEY });
    });
    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
