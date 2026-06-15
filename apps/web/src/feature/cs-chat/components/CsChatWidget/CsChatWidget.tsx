'use client';

import { MessageCircleMore, X } from 'lucide-react';


import { useCsChatStore } from '../../csChatStore';
import { CsChatPanel } from '../CsChatPanel';

import * as styles from './CsChatWidget.css';

import { useUserStore } from '@/stores/user-store';

export default function CsChatWidget() {
  const user = useUserStore((state) => state.user);
  const isOpen = useCsChatStore((state) => state.isOpen);
  const open = useCsChatStore((state) => state.open);
  const close = useCsChatStore((state) => state.close);

  // 로그인 상태에서만 노출
  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      {isOpen ? <CsChatPanel /> : null}
      <button
        type="button"
        className={styles.launcher}
        onClick={isOpen ? close : open}
        aria-label={isOpen ? '고객센터 채팅 닫기' : '고객센터 채팅 열기'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={30} /> : <MessageCircleMore size={30} />}
      </button>
    </div>
  );
}
