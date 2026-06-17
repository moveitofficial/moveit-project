'use client';

import clsx from 'clsx';
import { MessagesSquare, Search } from 'lucide-react';
import Image from 'next/image';

import * as styles from './RoomList.css';

import type { MessageRoom } from '@/feature/message/types';

import { useLastSenderStore } from '@/feature/message/lastSenderStore';
import {
  formatRoomTime,
  getCounterpartInitials,
  getRoomDisplayPerson,
  hasUnread,
} from '@/feature/message/utils';

interface Props {
  rooms: MessageRoom[];
  isLoading: boolean;
  myId: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export default function RoomList({
  rooms,
  isLoading,
  myId,
  search,
  onSearchChange,
  selectedRoomId,
  onSelectRoom,
}: Props) {
  // 방별 마지막 보낸 사람(소켓 기록) — 목록 프로필·이름을 그 사람 기준으로.
  const lastSenderByRoom = useLastSenderStore((state) => state.byRoom);

  return (
    <div className={styles.listPane}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          placeholder="검색해 보세요"
        />
        <Search size={20} className={styles.searchIcon} aria-hidden />
      </div>

      <div className={styles.listBox}>
        {isLoading ? (
          <p className={styles.stateText}>대화를 불러오는 중...</p>
        ) : rooms.length === 0 ? (
          <div className={styles.emptyState}>
            <MessagesSquare
              size={48}
              className={styles.emptyIcon}
              aria-hidden
            />
            <p className={styles.emptyText}>
              아직 시작된 대화가 없습니다.
              <br aria-hidden />
              궁금한 점이 있다면
              <br aria-hidden />
              전문가에게 언제든 문의해보세요.
            </p>
          </div>
        ) : (
          <ul className={styles.roomList}>
            {rooms.map((room) => {
              const person = getRoomDisplayPerson(
                room,
                myId,
                lastSenderByRoom[room.id],
              );
              const isActive = room.id === selectedRoomId;

              return (
                <li key={room.id}>
                  <button
                    type="button"
                    className={clsx(
                      styles.roomCard,
                      isActive && styles.roomCardActive,
                    )}
                    onClick={() => {
                      onSelectRoom(room.id);
                    }}
                  >
                    {person.profileImageUrl === null ? (
                      <span className={styles.avatarFallback}>
                        {getCounterpartInitials(person.name)}
                      </span>
                    ) : (
                      <Image
                        src={person.profileImageUrl}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className={styles.avatar}
                      />
                    )}

                    <span className={styles.roomBody}>
                      <span className={styles.roomTopRow}>
                        <span className={styles.roomName}>
                          {person.name}
                        </span>
                        {room.lastMessage === null ? null : (
                          <span className={styles.roomTime}>
                            {formatRoomTime(room.lastMessage.createdAt)}
                          </span>
                        )}
                      </span>
                      <span className={styles.roomPreviewRow}>
                        <span className={styles.roomPreview}>
                          {room.lastMessage?.content ?? '대화를 시작해보세요.'}
                        </span>
                        {hasUnread(room) && room.id !== selectedRoomId ? (
                          <span className={styles.unreadDot} aria-label="안 읽음" />
                        ) : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
