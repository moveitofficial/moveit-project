'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';


import { useAttachmentStore } from './attachmentStore';
import { useLastSenderStore } from './lastSenderStore';
import { MESSAGE_ROOMS_KEY, useMessageHistory } from './useMessage';
import { useMessageRoomSocket } from './useMessageRoomSocket';

import type { ChatMessage } from './types';

// 대화방 상태: REST 내역 + 소켓 실시간 수신/전송 + 읽음 처리.
export function useMessageChat(roomId: string) {
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessageHistory(roomId);
  const queryClient = useQueryClient();
  const cacheAttachments = useAttachmentStore((state) => state.cache);
  const setLastSender = useLastSenderStore((state) => state.setLastSender);

  const { sendText, markRead } = useMessageRoomSocket(roomId, {
    onMessage: (message) => {
      setLiveMessages((prev) =>
        prev.some((item) => item.id === message.id) ? prev : [...prev, message],
      );
      // 내역 API엔 attachments가 없으므로 소켓 때 캐시해 재입장/새로고침에 대비.
      if (message.attachments?.length) {
        cacheAttachments(message.id, message.attachments);
      }
      // 목록 프로필·이름을 "마지막 보낸 사람" 기준으로 표시하기 위해 기록(시스템 메시지 제외).
      if (message.senderId !== null) {
        setLastSender(roomId, message.senderId);
      }
      // 메시지가 오면 방 내역(order 포함) 최신화 — 상대의 일정 변경(텍스트 알림)도 반영.
      void queryClient.invalidateQueries({
        queryKey: ['messageHistory', roomId],
      });
      // 결제상세는 결제 관련 시스템 메시지에서만 변함.
      if (message.type === 'SYSTEM') {
        void queryClient.invalidateQueries({ queryKey: ['orderPayment'] });
      }
      // 새 메시지 → 목록 미리보기 최신화
      void queryClient.invalidateQueries({ queryKey: MESSAGE_ROOMS_KEY });
    },
  });

  // 방이 바뀌면 소켓 임시 메시지를 비운다.
  useEffect(() => {
    setLiveMessages([]);
  }, [roomId]);

  // pages[0]=최신, 뒤로 갈수록 과거 → 시간순으로 뒤집어 펼친다.
  const firstPage = data?.pages[0] ?? null;
  const history = [...(data?.pages ?? [])]
    .reverse()
    .flatMap((page) => page.items);
  // 내역 + 소켓 수신 병합 후 id 기준 중복 제거(같은 메시지가 여러 경로로 와도 1번만).
  const seenIds = new Set<string>();
  const messages = [...history, ...liveMessages].filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }
    seenIds.add(item.id);
    return true;
  });

  // 마지막 메시지 읽음 처리 (markRead는 ref로 안정화).
  const markReadRef = useRef(markRead);
  markReadRef.current = markRead;
  const lastMessageId = messages.at(-1)?.id ?? null;
  useEffect(() => {
    if (lastMessageId !== null) {
      markReadRef.current(lastMessageId);
      // 방을 읽었으니 헤더 "안 읽은 메시지" 알림도 갱신.
      void queryClient.invalidateQueries({ queryKey: ['chatNotifications'] });
    }
  }, [lastMessageId, queryClient]);

  return {
    messages,
    room: firstPage?.room ?? null,
    isLoading,
    sendText,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
