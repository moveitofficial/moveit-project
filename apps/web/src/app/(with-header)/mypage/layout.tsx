import type { Metadata } from 'next';

import { MypageLayout } from '@/feature/user/components/MypageLayout';
import { mockCurrentUser } from '@/mocks/user';

export const metadata: Metadata = {
  title: '마이페이지 | moveit',
};

export default function MypageRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MypageLayout user={mockCurrentUser}>{children}</MypageLayout>;
}
