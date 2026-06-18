import type { Metadata } from 'next';

import { MypageLayout } from '@/feature/user/components/MypageLayout';

export const metadata: Metadata = {
  title: '마이페이지 | moveit',
};

export default function MypageRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MypageLayout>{children}</MypageLayout>;
}
