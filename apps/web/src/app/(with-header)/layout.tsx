import { Suspense } from 'react';

import type { Role } from '@/types/enums';

import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { getMe } from '@/feature/signup/api';


interface HeaderUser {
  role: Role;
  displayName: string;
}

// 요청 쿠키로 로그인 여부를 서버에서 판단해 헤더를 처음부터 올바르게 렌더한다.
// 이름: 일반=유저명 + '고객님', 판매자=회사명 + '전문가'(회사명 없으면 '전문가').
async function getHeaderUser(): Promise<HeaderUser | null> {
  try {
    const { data } = await getMe();
    const displayName =
      data.role === 'EXPERT'
        ? `${data.expertProfile?.businessName ?? ''} 전문가`.trim()
        : `${data.name ?? ''} 고객님`.trim();
    return { role: data.role, displayName };
  } catch {
    return null;
  }
}

export default async function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getHeaderUser();

  return (
    <>
      <Suspense fallback={null}>
        <Header role={user?.role ?? null} displayName={user?.displayName ?? null} />
      </Suspense>
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
