'use client';

import csChat from '@public/cschat/csChat.svg';
import movitNoti from '@public/cschat/movitNoti.svg';
import clsx from 'clsx';
import { File as FileIcon, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';


import { useAttachmentStore } from '../../attachmentStore';
import { FILE_SENT_LABEL } from '../../constants';
import { formatStamp } from '../../csTime';
import { isCsSystem } from '../../types';

import * as styles from './CsMessageList.css';

import type { CsLiveItem, CsMessage, CsMessageAttachment } from '../../types';

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

function Stamp({ iso }: { iso: string }) {
  const stamp = formatStamp(iso);
  return (
    <div className={styles.stamp}>
      <span>{stamp.date}</span>
      <span>{stamp.time}</span>
    </div>
  );
}

export default function CsMessageList({ items }: { items: CsLiveItem[] }) {
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
        return item.senderType === 'USER' ? (
          <div key={item.id} className={styles.userRow}>
            <Image
              src={csChat}
              alt=""
              width={24}
              height={24}
              className={styles.avatar}
            />
            <Body item={item} className={styles.userBubble} />
            <Stamp iso={item.createdAt} />
          </div>
        ) : (
          <div key={item.id} className={styles.adminRow}>
            <Stamp iso={item.createdAt} />
            <Body item={item} className={styles.adminBubble} />
            <Image
              src={movitNoti}
              alt=""
              width={24}
              height={24}
              className={styles.avatar}
            />
          </div>
        );
      })}
    </>
  );
}
