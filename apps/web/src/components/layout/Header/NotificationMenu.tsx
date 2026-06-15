'use client';

import movitNoti from '@public/noti/movitNoti.svg';
import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { formatDotDate } from './format';
import * as styles from './Header.css';
import * as panel from './notiPanel.css';
import { useDropdown } from './useDropdown';

import type {
  NotificationItem,
  NotificationTab,
} from '@/feature/notifications/api';

import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationSocket,
  useNotificationUnread,
  useNotifications,
} from '@/feature/notifications/useNotifications';

const TABS: { key: NotificationTab; label: string; emptyText: string }[] = [
  {
    key: 'TRANSACTION',
    label: '거래 알림',
    emptyText: '모든 거래 알림을 확인했어요',
  },
  { key: 'MOVEIT', label: '무빗 알림', emptyText: '모든 무빗 알림을 확인했어요' },
];

function NotificationRow({
  item,
  onRead,
  onDelete,
}: {
  item: NotificationItem;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li
      className={panel.item}
      onClick={() => {
        if (!item.isRead) {
          onRead(item.id);
        }
      }}
    >
      <div className={panel.avatar}>
        <Image src={movitNoti} alt="" width={40} height={40} />
        {!item.isRead && <span className={panel.unreadDot} />}
      </div>
      <div className={panel.itemBody}>
        <p className={clsx(typography.f14R, panel.content)}>{item.content}</p>
        <div className={clsx(typography.f12R, panel.meta)}>
          <span>{formatDotDate(item.createdAt)}</span>
          <button
            type="button"
            className={clsx(typography.f12R, panel.deleteButton)}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(item.id);
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}

export default function NotificationMenu() {
  const { ref, open, setOpen } = useDropdown();
  const [tab, setTab] = useState<NotificationTab>('TRANSACTION');
  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);

  useNotificationSocket();
  const unread = useNotificationUnread();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications(tab, open);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteOne = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  const items = data?.pages.flatMap((page) => page.data.items) ?? [];
  const emptyText = TABS.find((item) => item.key === tab)?.emptyText ?? '';
  const hasUnread = unread.data?.data.hasUnread ?? false;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = listRef.current;
    if (!sentinel || !root || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={ref} className={styles.profileMenu}>
      <button
        type="button"
        aria-label="알림"
        className={styles.iconButton}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Bell size={24} />
        {hasUnread && <span className={styles.badge} />}
      </button>
      {open && (
        <div className={panel.panel}>
          <div className={panel.tabBar}>
            {TABS.map((item) => {
              const isActive = item.key === tab;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={clsx(
                    isActive ? typography.f16EB : typography.f16R,
                    panel.tab,
                    isActive && panel.tabActive,
                  )}
                  onClick={() => {
                    setTab(item.key);
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {items.length === 0 ? (
            <div className={panel.empty}>
              <Image src={movitNoti} alt="" />
              <p className={clsx(typography.f14R, panel.emptyText)}>
                {emptyText}
              </p>
            </div>
          ) : (
            <ul ref={listRef} className={panel.list}>
              {items.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onRead={(id) => {
                    markRead.mutate(id);
                  }}
                  onDelete={(id) => {
                    deleteOne.mutate(id);
                  }}
                />
              ))}
              <li ref={sentinelRef} />
            </ul>
          )}
          <div className={panel.footer}>
            <button
              type="button"
              className={clsx(typography.f16B, panel.footerButton)}
              onClick={() => {
                markAllRead.mutate();
              }}
            >
              모두읽음
            </button>
            <button
              type="button"
              className={clsx(
                typography.f16B,
                panel.footerButton,
                panel.footerDivider,
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
