'use client';

import { useState } from 'react';

import { useCsChatStore } from '../../csChatStore';
import { useCsRooms } from '../../useCsChat';
import { CsActiveInquiryDialog } from '../CsActiveInquiryDialog';
import { CsRoomCard } from '../CsRoomCard';

import * as styles from './CsConversationList.css';

export default function CsConversationList() {
  const openRoom = useCsChatStore((state) => state.openRoom);
  const startBot = useCsChatStore((state) => state.startBot);
  const { data } = useCsRooms();
  const [askNew, setAskNew] = useState(false);

  const rooms = data?.items ?? [];
  const activeRoom = rooms.find((room) => room.status !== 'CLOSED');

  const handleNewInquiry = () => {
    if (activeRoom) {
      setAskNew(true);
      return;
    }
    startBot();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {rooms.length === 0 ? (
          <p className={styles.empty}>상담 내역이 없습니다.</p>
        ) : (
          rooms.map((room) => (
            <CsRoomCard
              key={room.id}
              room={room}
              onClick={() => {
                openRoom(room.id);
              }}
            />
          ))
        )}
      </div>

      <button
        type="button"
        className={styles.newButton}
        onClick={handleNewInquiry}
      >
        새 문의하기
      </button>

      {askNew && activeRoom ? (
        <CsActiveInquiryDialog
          onGoActive={() => {
            openRoom(activeRoom.id);
          }}
          onStartNew={() => {
            setAskNew(false);
            startBot();
          }}
          onCancel={() => {
            setAskNew(false);
          }}
        />
      ) : null}
    </div>
  );
}
