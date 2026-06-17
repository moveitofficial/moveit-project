import { create } from 'zustand';

/**
 * 방별 "마지막 메시지를 보낸 사용자 id".
 * 목록 프로필·이름을 보낸 사람 기준으로 표시하기 위해 소켓 수신 때 기록한다.
 */
interface LastSenderState {
  byRoom: Record<string, string>;
  setLastSender: (roomId: string, senderId: string) => void;
}

export const useLastSenderStore = create<LastSenderState>((set) => ({
  byRoom: {},
  setLastSender: (roomId, senderId) => {
    set((state) => ({ byRoom: { ...state.byRoom, [roomId]: senderId } }));
  },
}));
