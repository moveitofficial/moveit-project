'use client';

import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import * as styles from './ScheduleModal.css';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (endDateIso: string) => void;
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export default function ScheduleModal({
  isOpen,
  onClose,
  title,
  submitLabel,
  isSubmitting,
  onSubmit,
}: Props) {
  const today = startOfToday();
  const [view, setView] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const [selected, setSelected] = useState<Date | null>(null);

  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const dayTime = (day: number) =>
    new Date(view.year, view.month, day).getTime();
  const canSubmit = selected !== null && !isSubmitting;

  const goPrev = () => {
    setView((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 },
    );
  };
  const goNext = () => {
    setView((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 },
    );
  };

  const handleClose = () => {
    setSelected(null);
    setView({ year: today.getFullYear(), month: today.getMonth() });
    onClose();
  };

  const handleSubmit = () => {
    if (selected === null || isSubmitting) {
      return;
    }
    const iso = new Date(
      Date.UTC(selected.getFullYear(), selected.getMonth(), selected.getDate()),
    ).toISOString();
    onSubmit(iso);
  };

  const selectedLabel =
    selected === null
      ? '-'
      : `${String(selected.getFullYear())}. ${pad(selected.getMonth() + 1)}. ${pad(selected.getDate())} (${WEEKDAYS[selected.getDay()]})`;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={420}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.notice}>
          마감일 미준수 시 구매자 요청에 따라 100% 환불이 진행됩니다.
        </p>
        <span className={styles.label}>마감일</span>

        <div className={styles.calendar}>
          <div className={styles.calHeader}>
            <span className={styles.calMonth}>
              {view.year}년 {view.month + 1}월
            </span>
            <div className={styles.calNav}>
              <button
                type="button"
                className={styles.navButton}
                onClick={goPrev}
                aria-label="이전 달"
              >
                <ChevronLeft size={20} aria-hidden />
              </button>
              <button
                type="button"
                className={styles.navButton}
                onClick={goNext}
                aria-label="다음 달"
              >
                <ChevronRight size={20} aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.weekRow}>
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className={styles.weekday}>
                {weekday}
              </span>
            ))}
          </div>

          <div className={styles.grid}>
            {days.map((day) => {
              const isPast = dayTime(day) < today.getTime();
              const isToday = dayTime(day) === today.getTime();
              const isSelected =
                selected !== null && dayTime(day) === selected.getTime();

              return (
                <button
                  key={day}
                  type="button"
                  className={clsx(
                    styles.day,
                    isToday && styles.dayToday,
                    isSelected && styles.daySelected,
                  )}
                  style={
                    day === 1
                      ? { gridColumnStart: firstWeekday + 1 }
                      : undefined
                  }
                  disabled={isPast}
                  onClick={() => {
                    setSelected(new Date(view.year, view.month, day));
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>시작일</span>
          <span className={styles.infoValue}>결제 완료 시점 자동 지정</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>선택한 마감일</span>
          <span className={styles.infoValueStrong}>{selectedLabel}</span>
        </div>

        <button
          type="button"
          className={clsx(
            styles.submitButton,
            canSubmit ? undefined : styles.submitButtonDisabled,
          )}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {submitLabel}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleClose}
        >
          아니오
        </button>
      </div>
    </Modal>
  );
}
