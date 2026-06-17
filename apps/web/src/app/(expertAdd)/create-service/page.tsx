import { redirect } from 'next/navigation';

import { ExpertServiceCreate } from '@/feature/expertService/components/ExpertServiceCreate';
import { getMyUser } from '@/feature/user/api';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

// 승인된 전문가(판매자)만 접근. 비로그인 → 로그인, 그 외 → 홈. ?id가 있으면 편집.
export default async function ExpertServiceCreatePage({ searchParams }: Props) {
  const me = await getMyUser().catch(() => null);

  if (me === null) {
    redirect('/login');
  }

  const isApprovedExpert =
    me.data.role === 'EXPERT' && (me.data.expertProfile?.isApproved ?? false);

  if (!isApprovedExpert) {
    redirect('/');
  }

  const { id } = await searchParams;

  return <ExpertServiceCreate serviceId={id} />;
}
