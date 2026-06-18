'use client';

import { MessagesSquare } from 'lucide-react';

import { Conversation } from '../Conversation';

import * as styles from './ConversationPanel.css';

import type { MessageRoomCounterpart } from '@/feature/message/types';

interface Props {
  roomId: string | null;
  myId: string | null;
  counterpart: MessageRoomCounterpart | null;
  isSeller: boolean;
}

export default function ConversationPanel({
  roomId,
  myId,
  counterpart,
  isSeller,
}: Props) {
  if (roomId === null) {
    return (
      <div className={styles.pane}>
        <div className={styles.emptyState}>
          <MessagesSquare size={48} className={styles.emptyIcon} aria-hidden />
          <p className={styles.emptyTitle}>이어가던 대화를 다시 시작해 볼까요?</p>
          <p className={styles.emptyDescription}>
            대화를 선택하고 자유롭게 이야기해보세요
          </p>
        </div>
      </div>
    );
  }

  // 방이 바뀌면 대화 상태를 새로 시작하도록 key로 리마운트한다.
  return (
    <Conversation
      key={roomId}
      roomId={roomId}
      myId={myId}
      counterpart={counterpart}
      isSeller={isSeller}
    />
  );
}
