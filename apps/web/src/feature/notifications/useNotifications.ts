'use client';

import { NOTIFICATION_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import {
  deleteAllNotifications,
  deleteNotification,
  getNotificationUnread,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationTab,
} from './api';

const NOTIFICATIONS_KEY = ['notifications'];

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

export function useNotifications(tab: NotificationTab, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: [...NOTIFICATIONS_KEY, 'list', tab],
    queryFn: ({ pageParam }) => getNotifications(tab, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.hasNext ? allPages.length + 1 : undefined,
    enabled,
  });
}

export function useNotificationUnread() {
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, 'unread'],
    queryFn: getNotificationUnread,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useNotificationSocket() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.NOTIFICATIONS}`, {
      withCredentials: true,
    });
    socket.on(NOTIFICATION_EVENTS.NEW_NOTIFICATION, () => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    });
    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
