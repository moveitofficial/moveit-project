import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';

interface ChatNotificationClientUser {
  id: string;
  profileImageUrl: string | null;
  nickname: string | null;
}

interface ChatNotificationExpertUser {
  id: string;
  profileImageUrl: string | null;
  businessName: string | null;
}

export interface ChatNotification {
  id: string;
  currentServiceId: string;
  clientUser: ChatNotificationClientUser;
  expertUser: ChatNotificationExpertUser;
  lastMessage: { id: string; content: string; createdAt: string } | null;
}

export function getChatNotifications(): Promise<ApiSuccess<ChatNotification[]>> {
  return api.get<ApiSuccess<ChatNotification[]>>('/chat/notifications');
}

export function deleteChatNotification(
  roomId: string,
): Promise<ApiSuccess<null>> {
  return api.delete<ApiSuccess<null>>(`/chat/notifications/${roomId}`);
}

export function deleteAllChatNotifications(): Promise<ApiSuccess<null>> {
  return api.delete<ApiSuccess<null>>('/chat/notifications');
}
