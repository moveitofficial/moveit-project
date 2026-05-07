import { nanumSquare } from '@repo/fonts';
import { QueryProvider } from '@repo/providers';
import { themeClass } from '@repo/styles/tokens';
import clsx from 'clsx';
import '@repo/styles/reset';
import '@repo/styles/globals';

import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'moveIt Admin',
  description: 'moveIt admin dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={clsx(nanumSquare.variable, themeClass)}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
