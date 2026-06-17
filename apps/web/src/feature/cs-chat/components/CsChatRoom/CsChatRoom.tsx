'use client';

import { useEffect, useRef } from 'react';

import { useCsChatStore } from '../../csChatStore';
import { useCsMessages } from '../../useCsChat';
import { useCsLiveChat } from '../../useCsLiveChat';
import { CsChatInput } from '../CsChatInput';
import { CsMessageList } from '../CsMessageList';

import * as styles from './CsChatRoom.css';

export default function CsChatRoom() {
  const roomId = useCsChatStore((state) => state.activeRoomId);
  const { items, assigned, syncHistory, send } = useCsLiveChat(roomId);
  const { data } = useCsMessages(roomId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) syncHistory(data.items);
  }, [data, syncHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [items]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.transcript}>
        <CsMessageList items={items} showConnecting={!!roomId && !assigned} />
        <div ref={bottomRef} />
      </div>
      <CsChatInput onSubmit={send} />
    </div>
  );
}
