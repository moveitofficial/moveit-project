'use client';

import { ConfirmModal } from '@repo/ui/Modal';

import type { ConfirmModalProps } from '@repo/ui/Modal';

import { useScrollbarCompensation } from '@/feature/user/hooks/useScrollbarCompensation';

export default function UserConfirmModal(props: ConfirmModalProps) {
  useScrollbarCompensation(props.isOpen);
  return <ConfirmModal {...props} />;
}
