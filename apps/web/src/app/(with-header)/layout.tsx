import { Suspense } from 'react';

import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
