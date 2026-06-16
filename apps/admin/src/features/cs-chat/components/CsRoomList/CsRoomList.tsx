'use client';


import { EMPTY_LIST_TEXT, SEARCH_PLACEHOLDER } from '../../constants';
import { CsEmpty } from '../CsEmpty';
import { CsRoomListItem } from '../CsRoomListItem';

import * as styles from './CsRoomList.css';

import type { CsAdminRoom } from '../../types';

import { SearchBar } from '@/components/common/SearchBar';

interface CsRoomListProps {
  rooms: CsAdminRoom[];
  selectedId: string | null;
  onSearch: (value: string) => void;
  onSelect: (room: CsAdminRoom) => void;
}

export default function CsRoomList({
  rooms,
  selectedId,
  onSearch,
  onSelect,
}: CsRoomListProps) {
  return (
    <div className={styles.column}>
      <SearchBar onChange={onSearch} placeholder={SEARCH_PLACEHOLDER} />
      <div className={styles.panel}>
        {rooms.length === 0 ? (
          <CsEmpty text={EMPTY_LIST_TEXT} />
        ) : (
          rooms.map((room) => (
            <CsRoomListItem
              key={room.id}
              room={room}
              selected={room.id === selectedId}
              onClick={() => {
                onSelect(room);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
