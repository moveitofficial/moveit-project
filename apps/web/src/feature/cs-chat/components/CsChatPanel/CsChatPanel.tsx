'use client';

import clsx from 'clsx';
import { ChevronLeft, Home, MessageCircleMore } from 'lucide-react';

import { useCsChatStore } from '../../csChatStore';
import { CsBotFlow } from '../CsBotFlow';
import { CsChatRoom } from '../CsChatRoom';
import { CsConversationList } from '../CsConversationList';
import { CsHomeTab } from '../CsHomeTab';

import * as styles from './CsChatPanel.css';

function PanelBody() {
  const view = useCsChatStore((state) => state.view);
  const tab = useCsChatStore((state) => state.tab);
  const activeRoomId = useCsChatStore((state) => state.activeRoomId);

  if (view === 'bot') {
    return <CsBotFlow />;
  }
  if (view === 'room') {
    return <CsChatRoom key={activeRoomId} />;
  }
  if (tab === 'home') {
    return <CsHomeTab />;
  }
  return <CsConversationList />;
}

export default function CsChatPanel() {
  const view = useCsChatStore((state) => state.view);
  const tab = useCsChatStore((state) => state.tab);
  const backToTab = useCsChatStore((state) => state.backToTab);
  const setTab = useCsChatStore((state) => state.setTab);

  const isScript = view !== 'tab';
  const showAvatar = isScript || tab === 'home';
  const headerTitle = !isScript && tab === 'list' ? '대화' : '무브잇';

  return (
    <section className={styles.panel} aria-label="무브잇 고객센터 채팅">
      <header
        className={clsx(styles.header, isScript ? styles.headerBot : styles.headerTab)}
      >
        {isScript ? (
          <button
            type="button"
            className={styles.headerIcon}
            onClick={backToTab}
            aria-label="뒤로"
          >
            <ChevronLeft size={24} />
          </button>
        ) : null}
        {showAvatar ? (
          <span
            className={clsx(styles.avatar, isScript ? styles.avatarSm : styles.avatarLg)}
            aria-hidden
          >
            m
          </span>
        ) : null}
        <span className={clsx(styles.title, isScript ? styles.titleBot : styles.titleTab)}>
          {headerTitle}
        </span>
        {isScript ? (
          <button type="button" className={styles.exit} onClick={backToTab}>
            나가기
          </button>
        ) : null}
      </header>

      <PanelBody />

      {isScript ? null : (
        <nav className={styles.tabBar}>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'home' && styles.tabActive)}
            onClick={() => {
              setTab('home');
            }}
          >
            <Home size={24} />
            홈
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'list' && styles.tabActive)}
            onClick={() => {
              setTab('list');
            }}
          >
            <MessageCircleMore size={24} />
            대화
          </button>
        </nav>
      )}
    </section>
  );
}
