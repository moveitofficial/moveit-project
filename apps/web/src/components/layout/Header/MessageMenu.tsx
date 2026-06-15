'use client';

import profileFallback from '@public/header/Profile.svg';
import messEmpty from '@public/noti/messEmpt.svg';
import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { MessageSquareMore } from 'lucide-react';
import Image from 'next/image';

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
  onDelete,
}: {
  notification: ChatNotification;
  role: Role;
  onDelete: (roomId: string) => void;
}) {
  const other =
    role === 'EXPERT' ? notification.clientUser : notification.expertUser;

  return (
    <li className={menu.item}>
      {/* TODO: 채팅방 라우트 생성 후 행 클릭 시 router.push(`/chat/${notification.id}`) */}
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
        <div className={clsx(typography.f12R, menu.meta)}>
          <span>
            {notification.lastMessage
              ? formatDotDate(notification.lastMessage.createdAt)
              : ''}
          </span>
          <button
            type="button"
            className={clsx(typography.f12R, menu.deleteButton)}
            onClick={() => {
              onDelete(notification.id);
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}

export default function MessageMenu({ role }: { role: Role }) {
  const { ref, open, setOpen } = useDropdown();

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
