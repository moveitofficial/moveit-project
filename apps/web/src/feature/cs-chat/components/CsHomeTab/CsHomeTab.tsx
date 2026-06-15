'use client';

import { CS_BRAND, GREETING_BODY } from '../../constants';
import { useCsChatStore } from '../../csChatStore';
import { useCsRooms } from '../../useCsChat';
import { CsRoomCard } from '../CsRoomCard';

import * as styles from './CsHomeTab.css';

export default function CsHomeTab() {
  const startBot = useCsChatStore((state) => state.startBot);
  const openRoom = useCsChatStore((state) => state.openRoom);
  const { data } = useCsRooms();
  const activeRoom = data?.items.find((room) => room.status !== 'CLOSED');

  if (activeRoom) {
    return (
      <div className={styles.wrapper}>
        <CsRoomCard
          room={activeRoom}
          onClick={() => {
            openRoom(activeRoom.id);
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.caption}>
          <span className={styles.avatar} aria-hidden>
            m
          </span>
          {CS_BRAND}
        </div>
        <div className={styles.body}>
          {GREETING_BODY.map((line, index) => (
            <p
              key={line.text || `blank-${index}`}
              className={line.bold ? styles.bodyLineBold : styles.bodyLine}
            >
              {line.text === '' ? ' ' : line.text}
            </p>
          ))}
        </div>
        <button type="button" className={styles.inquiryButton} onClick={startBot}>
          문의하기
        </button>
      </div>
    </div>
  );
}
