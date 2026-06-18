'use client';

import profileFallback from '@public/header/Profile.svg';
import messEmpty from '@public/noti/messEmpt.svg';
import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { MessageSquareMore } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { formatDotDate } from './format';
import * as styles from './Header.css';
import * as menu from './notiPanel.css';
import { useDropdown } from './useDropdown';

import type { ChatNotification } from '@/feature/consultation/chatNotifications';
import type { Role } from '@/types/enums';

import {
  useChatNotificationSocket,
  useChatNotifications,
  useDeleteAllChatNotifications,
  useDeleteChatNotification,
} from '@/feature/consultation/useChatNotifications';

function MessageRow({
  notification,
  role,
  onSelect,
  onDelete,
}: {
  notification: ChatNotification;
  role: Role;
  onSelect: (roomId: string) => void;
  onDelete: (roomId: string) => void;
}) {
  const other =
    role === 'EXPERT' ? notification.clientUser : notification.expertUser;

  return (
    <li className={menu.item}>
      <button
        type="button"
        className={menu.itemMain}
        onClick={() => {
          onSelect(notification.id);
        }}
      >
        <div className={menu.avatar}>
          <Image
            src={other.profileImageUrl ?? profileFallback}
            alt=""
            width={40}
            height={40}
            className={menu.avatarImage}
          />
          <span className={menu.unreadDot} />
        </div>
        <div className={menu.itemBody}>
          <p className={clsx(typography.f14R, menu.content)}>
            {notification.lastMessage?.content ?? ''}
          </p>
          <span className={clsx(typography.f12R, menu.meta)}>
            {notification.lastMessage
              ? formatDotDate(notification.lastMessage.createdAt)
              : ''}
          </span>
        </div>
      </button>
      <button
        type="button"
        className={clsx(typography.f12R, menu.deleteButton)}
        onClick={() => {
          onDelete(notification.id);
        }}
      >
        삭제
      </button>
    </li>
  );
}

export default function MessageMenu({ role }: { role: Role }) {
  const { ref, open, setOpen } = useDropdown();
  const router = useRouter();

  useChatNotificationSocket();
  const { data } = useChatNotifications();
  const deleteOne = useDeleteChatNotification();
  const deleteAll = useDeleteAllChatNotifications();

  const messages = data?.data ?? [];
  const hasUnread = messages.length > 0;

  return (
    <div ref={ref} className={styles.profileMenu}>
      <button
        type="button"
        aria-label="메시지"
        className={styles.iconButton}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <MessageSquareMore size={24} />
        {hasUnread && <span className={styles.badge} />}
      </button>
      {open && (
        <div className={menu.panel}>
          <p className={clsx(typography.f16EB, menu.title)}>안 읽은 메세지</p>
          {messages.length === 0 ? (
            <div className={menu.empty}>
              <Image src={messEmpty} alt="" />
              <p className={clsx(typography.f14R, menu.emptyText)}>
                모든 메세지를 확인했어요
              </p>
            </div>
          ) : (
            <ul className={menu.list}>
              {messages.map((notification) => (
                <MessageRow
                  key={notification.id}
                  notification={notification}
                  role={role}
                  onSelect={(roomId) => {
                    router.push(`/service/message?roomId=${roomId}`);
                    setOpen(false);
                  }}
                  onDelete={(roomId) => {
                    deleteOne.mutate(roomId);
                  }}
                />
              ))}
            </ul>
          )}
          <div className={menu.footer}>
            <button
              type="button"
              className={clsx(typography.f16B, menu.footerButton)}
              onClick={() => {
                deleteAll.mutate();
              }}
            >
              모두읽음
            </button>
            <button
              type="button"
              className={clsx(
                typography.f16B,
                menu.footerButton,
                menu.footerDivider,
              )}
              onClick={() => {
                deleteAll.mutate();
              }}
            >
              모두삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
