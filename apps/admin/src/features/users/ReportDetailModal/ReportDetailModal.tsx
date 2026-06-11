'use client';

import { typography } from '@repo/styles/typography';
import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { REPORT_DETAIL_MODAL_TITLE, type UserReportTableVariant } from './reportDetailConstants';
import * as styles from './ReportDetailModal.css';

import type { UserReportDetail } from '@/features/users/types';

import { getUserReportDetail } from '@/features/users/api';
import { REPORT_REASON_LABEL } from '@/utils/constants';

interface Props {
  reportId: string;
  tableVariant: UserReportTableVariant;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDetailModal({
  reportId,
  tableVariant,
  isOpen,
  onClose,
}: Props) {
  const [detail, setDetail] = useState<UserReportDetail | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setDetail(null);
      setImageIndex(0);
      return;
    }

    cancelledRef.current = false;
    setIsLoading(true);

    void (async () => {
      try {
        const { data } = await getUserReportDetail(reportId);
        if (cancelledRef.current) return;
        setDetail(data);
      } catch {
        alert(
          '신고 상세를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
        onClose();
      } finally {
        if (!cancelledRef.current) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [isOpen, reportId, onClose]);

  const images = detail?.images ?? [];
  const hasImages = images.length > 0;
  const currentImage = images[imageIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={528}>
      <div className={styles.modal}>
        <div className={styles.top}>
          <div className={styles.header}>
            <span className={`${typography.f18EB} ${styles.reportIcon}`}>
              !
            </span>
            <h2 className={`${typography.f18EB} ${styles.title}`}>
              {REPORT_DETAIL_MODAL_TITLE[tableVariant]}
            </h2>
          </div>

          <div className={styles.divider} />

          {detail !== null && hasImages && (
            <div className={styles.evidenceSection}>
              <p className={typography.f16EB}>
                증거파일
              </p>
              <div className={styles.carousel}>
                <button
                  type="button"
                  className={clsx(styles.navButton, styles.navButtonPrev)}
                  disabled={imageIndex === 0}
                  aria-label="이전 증거파일"
                  onClick={() => {
                    setImageIndex((prev) => prev - 1);
                  }}
                >
                  <ChevronLeft size={24} aria-hidden />
                </button>
                <div className={styles.imageFrame}>
                  {currentImage !== undefined && (
                    <Image
                      src={currentImage}
                      alt=""
                      fill
                      className={styles.carouselImage}
                      unoptimized
                    />
                  )}
                </div>
                <button
                  type="button"
                  className={clsx(styles.navButton, styles.navButtonNext)}
                  disabled={imageIndex >= images.length - 1}
                  aria-label="다음 증거파일"
                  onClick={() => {
                    setImageIndex((prev) => prev + 1);
                  }}
                >
                  <ChevronRight size={24} aria-hidden />
                </button>
              </div>
              <span className={`${typography.f14R} ${styles.pageIndicator}`}>
                {imageIndex + 1}/{images.length}
              </span>
            </div>
          )}

          {detail !== null && (
            <div className={styles.detailSection}>
              <div className={styles.detailHeader}>
                <p className={typography.f16EB}>
                  상세내용
                </p>
                <span className={`${typography.f14R} ${styles.reasonLabel}`}>
                  {REPORT_REASON_LABEL[detail.reason]}
                </span>
              </div>
              <p className={`${typography.f16R} ${styles.detailText}`}>
                {detail.detail}
              </p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.confirmButton}
            disabled={isLoading || detail === null}
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}
