'use client';

import { useEffect, useRef } from 'react';

import { EMPTY_CHAT_TEXT } from '../../constants';
import { useCsAdminChat } from '../../useCsAdminChat';
import { CsAdminChatInput } from '../CsAdminChatInput';
import { CsEmpty } from '../CsEmpty';
import { CsMessageList } from '../CsMessageList';

import * as styles from './CsChatView.css';

import type { CsAdminRoom } from '../../types';

function ChatRoom({
  room,
  myAdminId,
}: {
  room: CsAdminRoom;
  myAdminId: string | undefined;
}) {
  const { items, canReply, send, complete, uploadFile } = useCsAdminChat(
    room,
    myAdminId,
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [items]);

  return (
    <>
      <div className={styles.transcript}>
        <CsMessageList items={items} />
        <div ref={bottomRef} />
      </div>
      <CsAdminChatInput
        disabled={!canReply}
        onSend={send}
        onComplete={complete}
        onAttach={(file) => {
          void uploadFile(file);
        }}
      />
    </>
  );
}

export default function CsChatView({
  room,
  myAdminId,
}: {
  room: CsAdminRoom | null;
  myAdminId: string | undefined;
}) {
  return (
    <div className={styles.panel}>
      {room ? (
        <ChatRoom key={room.id} room={room} myAdminId={myAdminId} />
      ) : (
        <CsEmpty text={EMPTY_CHAT_TEXT} />
      )}
    </div>
  );
}
