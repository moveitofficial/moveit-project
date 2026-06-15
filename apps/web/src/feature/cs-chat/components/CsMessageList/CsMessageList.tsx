import { BotMessageSquare } from 'lucide-react';

import { CONNECTING_TEXT } from '../../constants';
import { formatStamp } from '../../csTime';
import { isCsSystem } from '../../types';

import * as styles from './CsMessageList.css';

import type { CsLiveItem } from '../../types';

interface CsMessageListProps {
  items: CsLiveItem[];
  /** "상담원 연결중입니다" 안내 노출 여부 */
  showConnecting: boolean;
}

export default function CsMessageList({
  items,
  showConnecting,
}: CsMessageListProps) {
  return (
    <>
      {items.map((item) => {
        if (isCsSystem(item)) {
          return (
            <p key={item.id} className={styles.systemLine}>
              {item.text}
            </p>
          );
        }
        const stamp = formatStamp(item.createdAt);
        return item.senderType === 'USER' ? (
          <div key={item.id} className={styles.userRow}>
            <div className={styles.stamp}>
              <span>{stamp.date}</span>
              <span>{stamp.time}</span>
            </div>
            <p className={styles.userBubble}>{item.content}</p>
          </div>
        ) : (
          <div key={item.id} className={styles.adminRow}>
            <span className={styles.adminAvatar} aria-hidden>
              <BotMessageSquare size={16} />
            </span>
            <p className={styles.adminBubble}>{item.content}</p>
            <div className={styles.stamp}>
              <span>{stamp.date}</span>
              <span>{stamp.time}</span>
            </div>
          </div>
        );
      })}
      {showConnecting ? (
        <p className={styles.systemLine}>{CONNECTING_TEXT}</p>
      ) : null}
    </>
  );
}
