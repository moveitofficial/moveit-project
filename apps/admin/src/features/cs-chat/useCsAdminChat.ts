'use client';

import { CS_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import { uploadCsFile } from './api';
import { useAttachmentStore } from './attachmentStore';
import { CLOSING_MESSAGE, TICKET_CLOSED_TEXT } from './constants';
import { useLastSenderStore } from './lastSenderStore';
import { isCsSystem } from './types';
import { CS_ROOMS_KEY, useCsMessages } from './useCsChat';

import type { CsAdminRoom, CsLiveItem, CsMessage } from './types';
import type { Socket } from 'socket.io-client';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

const CLOSED_SYSTEM_ID = 'sys-closed';

/**
 * 관리자 상담방 라이브 채팅.
 * - OPEN 방: assignAdmin으로 점유하며 입장
 * - 내 담당(ASSIGNED): joinRoom으로 이어서 상담
 * - CLOSED: 소켓 없이 내역만(뷰 전용)
 */
export function useCsAdminChat(room: CsAdminRoom, myAdminId: string | undefined) {
  const queryClient = useQueryClient();
  const setLastSender = useLastSenderStore((state) => state.setLastSender);
  const cacheAttachments = useAttachmentStore((state) => state.cache);
  const { data } = useCsMessages(room.id);
  const [items, setItems] = useState<CsLiveItem[]>([]);
  const [closed, setClosed] = useState(room.status === 'CLOSED');
  const socketRef = useRef<Socket | null>(null);

  const isMine = !!myAdminId && room.assignedAdmin?.id === myAdminId;
  const live =
    !closed && (room.status === 'OPEN' || (room.status === 'ASSIGNED' && isMine));
  const claim = room.status === 'OPEN';

  useEffect(() => {
    if (!live) return;

    const socket = io(`${SOCKET_URL}/${SOCKET_NAMESPACES.CS}`, {
      withCredentials: true,
      // polling 핸드셰이크는 CORS에 막히므로 websocket 전송만 사용(브라우저는 WS에 CORS 미적용)
      transports: ['websocket'],
    });
    socket.emit(claim ? CS_EVENTS.ASSIGN_ADMIN : CS_EVENTS.JOIN_ROOM, {
      roomId: room.id,
    });
    socket.on(CS_EVENTS.RECEIVE_MESSAGE, (message: CsMessage) => {
      setItems((prev) =>
        prev.some((item) => !isCsSystem(item) && item.id === message.id)
          ? prev
          : [...prev, message],
      );
      setLastSender(room.id, message.senderType);
      if (message.attachments?.length) {
        cacheAttachments(message.id, message.attachments);
      }
      void queryClient.invalidateQueries({ queryKey: CS_ROOMS_KEY });
    });
    socket.on(CS_EVENTS.TICKET_CLOSED, () => {
      setClosed(true);
      setItems((prev) =>
        prev.some((item) => isCsSystem(item) && item.id === CLOSED_SYSTEM_ID)
          ? prev
          : [...prev, { kind: 'system', id: CLOSED_SYSTEM_ID, text: TICKET_CLOSED_TEXT }],
      );
      void queryClient.invalidateQueries({ queryKey: CS_ROOMS_KEY });
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [live, claim, room.id, queryClient, setLastSender, cacheAttachments]);

  const syncHistory = useCallback(
    (messages: CsMessage[]) => {
      const ids = new Set(messages.map((message) => message.id));
      setItems((prev) => {
        const extra = prev.filter(
          (item) => isCsSystem(item) || !ids.has(item.id),
        );
        return [...messages, ...extra];
      });
      const last = messages.at(-1);
      if (last) setLastSender(room.id, last.senderType);
    },
    [room.id, setLastSender],
  );

  useEffect(() => {
    if (data) syncHistory(data.items);
  }, [data, syncHistory]);

  const send = (content: string) => {
    socketRef.current?.emit(CS_EVENTS.SEND_MESSAGE, {
      roomId: room.id,
      type: 'TEXT',
      content,
    });
  };

  const complete = () => {
    // 마무리 인사 전송 후 상담 종료
    socketRef.current?.emit(CS_EVENTS.SEND_MESSAGE, {
      roomId: room.id,
      type: 'TEXT',
      content: CLOSING_MESSAGE,
    });
    socketRef.current?.emit(CS_EVENTS.CLOSE_TICKET, { roomId: room.id });
  };

  const uploadFile = (file: File) => uploadCsFile(room.id, file);

  return { items, canReply: live, closed, send, complete, uploadFile };
}
