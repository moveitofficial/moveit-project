'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ConversationPanel } from '../ConversationPanel';
import { RoomList } from '../RoomList';
import { ServicePanel } from '../ServicePanel';

import * as styles from './MessageView.css';

import { useDebouncedValue, useMessageRooms } from '@/feature/message/useMessage';
import { useMessageNotifications } from '@/feature/message/useMessageNotifications';
import { getCounterpart } from '@/feature/message/utils';

interface Props {
  // 내 사용자 id — 서버(getMe)에서 주입해 첫 렌더부터 내/상대 메시지를 정확히 구분한다.
  myId: string | null;
  // 결제 후 복귀 등으로 특정 방을 바로 열고 싶을 때(쿼리 roomId).
  initialRoomId: string | null;
}

export default function MessageView({ myId, initialRoomId }: Props) {
  const [search, setSearch] = useState('');
  const [selectedRoomId, setSelectedRoomId] =
    useState<string | null>(initialRoomId);

  // 헤더 알림 클릭 등 Next 라우터 이동으로 ?roomId가 바뀌면 그 방을 연다.
  const roomIdParam = useSearchParams().get('roomId');
  useEffect(() => {
    if (roomIdParam !== null) {
      setSelectedRoomId(roomIdParam);
    }
  }, [roomIdParam]);

  // 안 연 방 포함 모든 방의 새 메시지를 실시간으로 목록에 반영.
  useMessageNotifications();

  // 방 선택을 URL에 반영해 새로고침해도 유지(재요청 없이 URL만 갱신).
  const selectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    globalThis.history.replaceState(null, '', `/service/message?roomId=${roomId}`);
  };
  const leaveRoom = () => {
    setSelectedRoomId(null);
    globalThis.history.replaceState(null, '', '/service/message');
  };

  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessageRooms(debouncedSearch);
  // 페이지 평탄화(페이지 경계서 새 메시지로 방이 밀리면 중복될 수 있어 id로 dedup).
  const seenRoomIds = new Set<string>();
  const rooms = (data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((room) => {
      if (seenRoomIds.has(room.id)) {
        return false;
      }
      seenRoomIds.add(room.id);
      return true;
    });

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? null;

  // 선택한 방이 아직 로드된 페이지에 없으면(목록 뒤쪽 방) 찾을 때까지 다음 페이지 로드.
  // 검색 중에는 필터로 안 잡힐 수 있어 전체 페이지를 긁지 않도록 제외.
  const needsRoomLookup =
    selectedRoomId !== null &&
    selectedRoom === null &&
    debouncedSearch.trim().length === 0;
  useEffect(() => {
    if (needsRoomLookup && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [needsRoomLookup, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const counterpart =
    selectedRoom === null ? null : getCounterpart(selectedRoom, myId);
  // 내가 이 방의 판매자(expert)인지 — 결제요청·일정 액션은 판매자만.
  const isSeller =
    selectedRoom !== null &&
    myId !== null &&
    selectedRoom.expertUser.id === myId;

  return (
    <div className={styles.page}>
      <RoomList
        rooms={rooms}
        isLoading={isLoading}
        myId={myId}
        search={search}
        onSearchChange={setSearch}
        selectedRoomId={selectedRoomId}
        onSelectRoom={selectRoom}
      />
      <ConversationPanel
        roomId={selectedRoomId}
        myId={myId}
        counterpart={counterpart}
        isSeller={isSeller}
      />
      {selectedRoom === null ? null : (
        <ServicePanel
          roomId={selectedRoom.id}
          serviceId={selectedRoom.currentServiceId}
          reportedUserId={counterpart?.id ?? null}
          onLeave={leaveRoom}
        />
      )}
    </div>
  );
}
