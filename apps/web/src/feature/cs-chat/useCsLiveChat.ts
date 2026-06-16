'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { useAttachmentStore } from './attachmentStore';
import { ADMIN_CONNECTED_TEXT } from './constants';
import { isCsSystem } from './types';
import { CS_ROOMS_KEY, useCreateCsRoom } from './useCsChat';
import { useCsRoomSocket } from './useCsRoomSocket';

import type { CsLiveItem, CsMessage } from './types';

const ASSIGNED_SYSTEM_ID = 'sys-assigned';

/**
 * CS 라이브 채팅 상태(메시지·상담원배정) + 소켓 송수신.
 * 신규 문의(roomId 없음)는 첫 전송 시 방을 생성하고, 기존 방은 roomId로 시작한다.
 */
export function useCsLiveChat(initialRoomId: string | null) {
  const [roomId, setRoomId] = useState(initialRoomId);
  const [items, setItems] = useState<CsLiveItem[]>([]);
  const [assigned, setAssigned] = useState(false);
  const createRoom = useCreateCsRoom();
  const queryClient = useQueryClient();
  const cacheAttachments = useAttachmentStore((state) => state.cache);

  const { sendMessage } = useCsRoomSocket(roomId, {
    onMessage: (message) => {
      setItems((prev) =>
        prev.some((item) => !isCsSystem(item) && item.id === message.id)
          ? prev
          : [...prev, message],
      );
      if (message.attachments?.length) {
        cacheAttachments(message.id, message.attachments);
      }
      // 새 메시지 → 대화 목록 미리보기 최신화
      void queryClient.invalidateQueries({ queryKey: CS_ROOMS_KEY });
    },
    onAdminAssigned: () => {
      setAssigned(true);
      setItems((prev) =>
        prev.some((item) => isCsSystem(item) && item.id === ASSIGNED_SYSTEM_ID)
          ? prev
          : [
              ...prev,
              { kind: 'system', id: ASSIGNED_SYSTEM_ID, text: ADMIN_CONNECTED_TEXT },
            ],
      );
    },
  });

  /**
   * 기존 방 메시지 내역 반영. 소켓으로 먼저 받은 메시지·시스템 라인은 유지하고
   * 내역과 병합한다(내역이 늦게/비어서 와도 안전).
   */
  const syncHistory = useCallback((messages: CsMessage[]) => {
    const historyIds = new Set(messages.map((message) => message.id));
    setItems((prev) => {
      const extra = prev.filter(
        (item) => isCsSystem(item) || !historyIds.has(item.id),
      );
      return [...messages, ...extra];
    });
    if (messages.some((message) => message.senderType === 'ADMIN')) {
      setAssigned(true);
    }
  }, []);

  const send = (content: string) => {
    if (roomId) {
      sendMessage(content);
      return;
    }
    createRoom.mutate(content, {
      onSuccess: (room) => {
        setRoomId(room.id);
        if (room.lastMessage) {
          setItems([
            {
              id: room.lastMessage.id,
              chatRoomId: room.id,
              senderType: 'USER',
              senderUserId: null,
              senderAdminId: null,
              type: 'TEXT',
              content: room.lastMessage.content,
              createdAt: room.lastMessage.createdAt,
              attachments: [],
            },
          ]);
        }
      },
    });
  };

  return {
    roomId,
    items,
    assigned,
    syncHistory,
    send,
    isCreating: createRoom.isPending,
  };
}
