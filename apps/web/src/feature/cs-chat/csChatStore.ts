import { create } from 'zustand';

import type { CsChatTab } from './types';

/** 패널 본문 라우팅: tab(홈/대화 목록) · bot(스크립트 플로우) · room(실시간 채팅) */
type CsChatViewState = 'tab' | 'bot' | 'room';

interface CsChatState {
  isOpen: boolean;
  view: CsChatViewState;
  tab: CsChatTab;
  /** 입장한 상담방 (room 뷰에서 사용, 2단계) */
  activeRoomId: string | null;
  open: () => void;
  close: () => void;
  setTab: (tab: CsChatTab) => void;
  /** 문의하기 → 봇 스크립트 플로우 진입 */
  startBot: () => void;
  /** 봇/룸 헤더의 뒤로가기 → 탭 화면으로 */
  backToTab: () => void;
  /** 상담방 입장 (2단계) */
  openRoom: (roomId: string) => void;
}

const INITIAL: Pick<CsChatState, 'view' | 'tab' | 'activeRoomId'> = {
  view: 'tab',
  tab: 'home',
  activeRoomId: null,
};

export const useCsChatStore = create<CsChatState>((set) => ({
  isOpen: false,
  ...INITIAL,
  open: () => {
    set({ isOpen: true });
  },
  close: () => {
    set({ isOpen: false, ...INITIAL });
  },
  setTab: (tab) => {
    set({ tab, view: 'tab' });
  },
  startBot: () => {
    set({ view: 'bot' });
  },
  backToTab: () => {
    set({ view: 'tab', activeRoomId: null });
  },
  openRoom: (roomId) => {
    set({ view: 'room', activeRoomId: roomId });
  },
}));
