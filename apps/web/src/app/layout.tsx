import { nanumSquare } from '@repo/fonts';
import { QueryProvider } from '@repo/providers';
import { themeClass } from '@repo/styles/tokens';
import '@repo/styles/reset';
import '@repo/styles/globals';
import clsx from 'clsx';


import FetcherInit from './FetcherInit';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'moveit',
  description: 'IT 전문가와 함께, 원하는 목표를 시작하세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={clsx(nanumSquare.variable, themeClass)}>
      <body>
        <FetcherInit />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
