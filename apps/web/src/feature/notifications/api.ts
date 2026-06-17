import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';

export type NotificationTab = 'TRANSACTION' | 'MOVEIT';

export interface NotificationItem {
  id: string;
  type: string;
  category: string;
  content: string;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  hasNext: boolean;
}

export function getNotifications(
  tab: NotificationTab,
  page: number,
): Promise<ApiSuccess<NotificationListResponse>> {
  return api.get<ApiSuccess<NotificationListResponse>>(
    `/notifications?tab=${tab}&page=${String(page)}`,
  );
}

export function getNotificationUnread(): Promise<
  ApiSuccess<{ hasUnread: boolean }>
> {
  return api.get<ApiSuccess<{ hasUnread: boolean }>>('/notifications/unread');
}

export function markNotificationRead(id: string): Promise<ApiSuccess<null>> {
  return api.patch<ApiSuccess<null>>(`/notifications/${id}/read`, {});
}

export function markAllNotificationsRead(): Promise<ApiSuccess<null>> {
  return api.patch<ApiSuccess<null>>('/notifications/read-all', {});
}

export function deleteNotification(id: string): Promise<ApiSuccess<null>> {
  return api.delete<ApiSuccess<null>>(`/notifications/${id}`);
}

export function deleteAllNotifications(): Promise<ApiSuccess<null>> {
  return api.delete<ApiSuccess<null>>('/notifications');
}
