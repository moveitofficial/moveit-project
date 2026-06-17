'use client';

import csChat from '@public/cschat/csChat.svg';
import movitNoti from '@public/cschat/movitNoti.svg';
import clsx from 'clsx';
import Image from 'next/image';

import { STATUS_DONE, STATUS_IN_PROGRESS } from '../../constants';
import { formatStamp } from '../../csTime';
import { useLastSenderStore } from '../../lastSenderStore';

import * as styles from './CsRoomListItem.css';

import type { CsAdminRoom } from '../../types';

interface CsRoomListItemProps {
  room: CsAdminRoom;
  selected: boolean;
  onClick: () => void;
}

export default function CsRoomListItem({
  room,
  selected,
  onClick,
}: CsRoomListItemProps) {
  const lastSender = useLastSenderStore((state) => state.byRoom[room.id]);

  // 보낸 사람을 아는 방은 그 기준(관리자=m, 고객=로봇), 모르면 status로 폴백
  const showAdmin = lastSender
    ? lastSender === 'ADMIN'
    : room.status !== 'OPEN';

  const name = showAdmin
    ? `${room.assignedAdmin?.name ?? ''} 관리자`
    : `${room.user.nickname ?? ''} 고객님`;
  const statusLabel =
    room.status === 'CLOSED'
      ? STATUS_DONE
      : room.status === 'ASSIGNED'
        ? STATUS_IN_PROGRESS
        : null;

  return (
    <button
      type="button"
      className={clsx(styles.card, selected && styles.cardSelected)}
      onClick={onClick}
    >
      <Image src={showAdmin ? movitNoti : csChat} alt="" width={40} height={40} />
      <div className={styles.content}>
        <div className={styles.nameRow}>
          <div className={styles.nameDate}>
            <span className={styles.name}>{name}</span>
            <span className={styles.date}>{formatStamp(room.createdAt).date}</span>
          </div>
          {statusLabel ? <span className={styles.status}>{statusLabel}</span> : null}
        </div>
        <p className={styles.preview}>{room.lastMessage?.content ?? ''}</p>
      </div>
    </button>
  );
}
