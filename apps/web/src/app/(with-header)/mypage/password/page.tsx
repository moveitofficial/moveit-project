import type { Metadata } from 'next';

import { ChangePasswordView } from '@/feature/user/components/ChangePasswordView';

export const metadata: Metadata = {
  title: '비밀번호 변경 | moveit',
};

export default function PasswordPage() {
  return <ChangePasswordView />;
}
