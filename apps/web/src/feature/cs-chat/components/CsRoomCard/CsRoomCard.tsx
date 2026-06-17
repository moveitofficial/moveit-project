import { CS_BRAND } from '../../constants';

import * as styles from './CsRoomCard.css';

import type { CsRoom } from '../../types';

interface CsRoomCardProps {
  room: CsRoom;
  onClick: () => void;
}

export default function CsRoomCard({ room, onClick }: CsRoomCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.head}>
        <span className={styles.avatar} aria-hidden>
          m
        </span>
        {CS_BRAND}
      </div>
      <p className={styles.preview}>{room.lastMessage?.content ?? ''}</p>
    </button>
  );
}
