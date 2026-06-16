'use client';

import { useState } from 'react';


import { useCsRooms } from '../../useCsChat';
import { CsBusyDialog } from '../CsBusyDialog';
import { CsChatView } from '../CsChatView';
import { CsRoomList } from '../CsRoomList';

import * as styles from './CsChatBoard.css';

import type { CsAdminRoom } from '../../types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

import { useAdminStore } from '@/stores/admin-store';

interface CsChatBoardProps {
  initialRooms: ApiSuccess<PaginatedResult<CsAdminRoom>>;
}

export default function CsChatBoard({ initialRooms }: CsChatBoardProps) {
  const myAdminId = useAdminStore((state) => state.admin?.id);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CsAdminRoom | null>(null);
  const [busyOpen, setBusyOpen] = useState(false);

  const { data } = useCsRooms(search, initialRooms);
  const rooms = data?.items ?? [];

  const handleSelect = (room: CsAdminRoom) => {
    const isMine = !!myAdminId && room.assignedAdmin?.id === myAdminId;
    // 다른 관리자가 상담중인 방은 입장 불가
    if (room.status === 'ASSIGNED' && !isMine) {
      setBusyOpen(true);
      return;
    }
    setSelected(room);
  };

  return (
    <div className={styles.board}>
      <CsRoomList
        rooms={rooms}
        selectedId={selected?.id ?? null}
        onSearch={setSearch}
        onSelect={handleSelect}
      />
      <CsChatView room={selected} myAdminId={myAdminId} />
      {busyOpen ? (
        <CsBusyDialog
          onConfirm={() => {
            setBusyOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
