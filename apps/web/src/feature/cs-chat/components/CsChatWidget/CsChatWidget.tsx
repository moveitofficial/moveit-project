'use client';

import { MessageCircleMore, X } from 'lucide-react';


import { useCsChatStore } from '../../csChatStore';
import { CsChatPanel } from '../CsChatPanel';

import * as styles from './CsChatWidget.css';

// 노출 여부(로그인)는 (with-header) 레이아웃에서 서버 getMe로 판단해 마운트한다.
export default function CsChatWidget() {
  const isOpen = useCsChatStore((state) => state.isOpen);
  const open = useCsChatStore((state) => state.open);
  const close = useCsChatStore((state) => state.close);

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
