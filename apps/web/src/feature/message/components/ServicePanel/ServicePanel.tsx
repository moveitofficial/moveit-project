'use client';

import { RectLabel } from '@repo/ui/RectLabel';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ReportModal } from '../ReportModal';

import * as styles from './ServicePanel.css';

import { ORDER_STATUS_BADGE_CONFIG } from '@/feature/orders/constants';
import type { OrderStatus } from '@/feature/orders/types';
import {
  useMessageHistory,
  useRoomOtherServices,
  useRoomService,
  useSubmitReport,
} from '@/feature/message/useMessage';
import { formatScheduleDate } from '@/feature/message/utils';
import { buildServiceDetailHref } from '@/feature/serviceDetail/utils';

interface Props {
  roomId: string;
  serviceId: string;
  reportedUserId: string | null;
  onLeave: () => void;
}

function ServiceThumbnail({ url }: { url: string }) {
  if (url.length === 0) {
    return <div className={styles.thumbnail} aria-hidden />;
  }
  return (
    <Image
      src={url}
      alt=""
      width={56}
      height={56}
      unoptimized
      className={styles.thumbnailImage}
    />
  );
}

export default function ServicePanel({
  roomId,
  serviceId,
  reportedUserId,
  onLeave,
}: Props) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const reportMutation = useSubmitReport();
  // 문의 서비스는 고정 서비스 → 서비스 엔드포인트에서 직접(썸네일 포함).
  const { data: service } = useRoomService(serviceId);
  // 주문(등록된 일정)은 방에 종속 → 메시지 응답에서.
  const { data: history } = useMessageHistory(roomId);
  const { data: others } = useRoomOtherServices(serviceId);

  const order = history?.pages[0]?.room.order ?? null;
  const thumb = service?.thumbnailUrl ?? '';
  const startDate = order?.startDate ?? null;
  const endDate = order?.endDate ?? null;
  const hasSchedule = startDate !== null && endDate !== null;
  // 결제 완료(NEGOTIATING 이상)부터 패널에 노출. 미결제·만료는 제외.
  const isPaid =
    order !== null &&
    order.status !== 'PENDING' &&
    order.status !== 'TRADE_REQUEST_EXPIRED';

  return (
    <aside className={styles.panel}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>문의 서비스</h3>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.headerAction}
              onClick={() => {
                setIsReportOpen(true);
              }}
              disabled={reportedUserId === null}
            >
              신고
            </button>
            <button
              type="button"
              className={styles.headerAction}
              onClick={onLeave}
            >
              나가기
            </button>
          </div>
        </div>
        {service === undefined ? null : (
          <Link
            href={buildServiceDetailHref(service.id, service.group)}
            target="_blank"
            rel="noreferrer"
            className={styles.serviceCardLink}
          >
            <ServiceThumbnail url={thumb} />
            <div className={styles.serviceInfo}>
              <p className={styles.serviceTitle}>{service.title}</p>
              <p className={styles.servicePrice}>
                {service.servicePrice.toLocaleString()} 원
              </p>
            </div>
          </Link>
        )}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>전문가 서비스</h3>
        <div className={styles.serviceList}>
          {(others ?? []).map((other) => (
            <Link
              key={other.id}
              href={buildServiceDetailHref(other.id, other.group)}
              target="_blank"
              rel="noreferrer"
              className={styles.serviceCardLink}
            >
              <ServiceThumbnail url={other.thumbnailUrl} />
              <div className={styles.serviceInfo}>
                <p className={styles.serviceTitle}>{other.title}</p>
                <p className={styles.servicePrice}>
                  {other.servicePrice.toLocaleString()} 원
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {order !== null && isPaid ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              {hasSchedule ? '등록된 일정' : '결제한 서비스'}
            </h3>
            {ORDER_STATUS_BADGE_CONFIG[order.status as OrderStatus] && (
              <RectLabel
                text={ORDER_STATUS_BADGE_CONFIG[order.status as OrderStatus].text}
                color={ORDER_STATUS_BADGE_CONFIG[order.status as OrderStatus].color}
              />
            )}
          </div>
          <div className={styles.serviceCard}>
            <ServiceThumbnail url={thumb} />
            <div className={styles.serviceInfo}>
              <p className={styles.serviceTitle}>{service?.title ?? ''}</p>
              <p className={styles.servicePrice}>
                {order.agreedServicePrice.toLocaleString()} 원
              </p>
            </div>
          </div>
          {hasSchedule ? (
            <p className={styles.scheduleText}>
              일정: {formatScheduleDate(order.startDate ?? '')} ~{' '}
              {formatScheduleDate(order.endDate ?? '')}
            </p>
          ) : null}
        </section>
      ) : null}

      {reportedUserId === null ? null : (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => {
            setIsReportOpen(false);
          }}
          isSubmitting={reportMutation.isPending}
          onSubmit={({ reason, detail, files }) => {
            reportMutation.mutate(
              { reportedUserId, reason, detail, files },
              {
                onSuccess: () => {
                  setIsReportOpen(false);
                },
              },
            );
          }}
        />
      )}
    </aside>
  );
}
