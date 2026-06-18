'use client';

import { Modal } from '@repo/ui/Modal';

import type { ModalProps } from '@repo/ui/Modal';

import { useScrollbarCompensation } from '@/feature/user/hooks/useScrollbarCompensation';


export default function UserModal(props: ModalProps) {
  useScrollbarCompensation(props.isOpen);
  return <Modal {...props} />;
}
