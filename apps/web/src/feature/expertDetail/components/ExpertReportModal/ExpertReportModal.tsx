'use client';

import { useState } from 'react';

import { createExpertReport, uploadReportImages } from '../../api';

import type { ExpertReportReason } from '../../types';

import { ReportModal } from '@/feature/message/components/ReportModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
}

// 신고 UI는 메시지 신고 모달과 동일하게 재사용하고, 전문가 신고 API만 연결한다.
export default function ExpertReportModal({
  isOpen,
  onClose,
  reportedUserId,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = ({
    reason,
    detail,
    files,
  }: {
    reason: ExpertReportReason;
    detail: string;
    files: File[];
  }) => {
    setIsSubmitting(true);

    void (async () => {
      try {
        let reportId: string | undefined;
        let imageUrls: string[] | undefined;

        if (files.length > 0) {
          const uploadResult = await uploadReportImages(files);
          reportId = uploadResult.reportId;
          imageUrls = uploadResult.images.map((image) => image.url);
        }

        await createExpertReport({
          reportId,
          reportedUserId,
          reason,
          detail,
          imageUrls,
        });

        onClose();
      } catch {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
