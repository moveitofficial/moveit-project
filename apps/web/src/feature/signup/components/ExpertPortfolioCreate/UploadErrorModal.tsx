'use client';

import { CircleAlert } from 'lucide-react';

import * as styles from './UploadErrorModal.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UploadErrorModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.body}>
          <CircleAlert size={24} />
          <p className={styles.heading}>업로드 오류</p>
          <p className={styles.desc}>
            이미지 사이즈를 확인해주세요
            <br />
            가로, 세로 600px 미만 크기의 이미지는 등록
            <br />
            하실 수 없습니다.
          </p>
        </div>
        <button type="button" onClick={onClose} className={styles.confirmBtn}>
          예
        </button>
      </div>
    </div>
  );
}
