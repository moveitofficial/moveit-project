'use client';

import clsx from 'clsx';
import { BotMessageSquare, File as FileIcon, Image as ImageIcon } from 'lucide-react';

import { useAttachmentStore } from '../../attachmentStore';
import { CONNECTING_TEXT, FILE_SENT_LABEL } from '../../constants';
import { formatStamp } from '../../csTime';
import { isCsSystem } from '../../types';

import * as styles from './CsMessageList.css';

import type { CsLiveItem, CsMessage, CsMessageAttachment } from '../../types';

interface CsMessageListProps {
  items: CsLiveItem[];
  /** "상담원 연결중입니다" 안내 노출 여부 */
  showConnecting: boolean;
}

async function downloadFile(url: string, fileName: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, '_blank');
  }
}

function FileBubble({
  attachment,
  className,
}: {
  attachment: CsMessageAttachment;
  className: string;
}) {
  const Icon = attachment.fileType.startsWith('image/') ? ImageIcon : FileIcon;
  return (
    <a
      href={attachment.fileUrl}
      className={clsx(className, styles.fileBubble)}
      onClick={(event) => {
        event.preventDefault();
        void downloadFile(attachment.fileUrl, attachment.fileName);
      }}
    >
      <Icon size={18} className={styles.fileIcon} />
      <span className={styles.fileName}>{FILE_SENT_LABEL}</span>
    </a>
  );
}

function Body({ item, className }: { item: CsMessage; className: string }) {
  // 내역 API엔 attachments가 없으므로 소켓 때 캐시해둔 값으로 폴백
  const cached = useAttachmentStore((state) => state.byMessageId[item.id]);
  const file =
    item.type === 'FILE' ? (item.attachments?.[0] ?? cached?.[0]) : undefined;
  return file ? (
    <FileBubble attachment={file} className={className} />
  ) : (
    <p className={className}>{item.content}</p>
  );
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
            <Body item={item} className={styles.userBubble} />
          </div>
        ) : (
          <div key={item.id} className={styles.adminRow}>
            <span className={styles.adminAvatar} aria-hidden>
              <BotMessageSquare size={16} />
            </span>
            <Body item={item} className={styles.adminBubble} />
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
