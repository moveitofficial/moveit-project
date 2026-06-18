import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getMe, getMyPortfolios } from '@/feature/signup/api';
import { ExpertPortfolio } from '@/feature/signup/components/ExpertPortfolio';

export default async function ExpertPortfolioPage() {
  // 서버에서 미리 받아 첫 화면부터 데이터가 보이게(새로고침 깜빡임 방지)
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['me'], queryFn: getMe }),
    queryClient.prefetchQuery({
      queryKey: ['my-portfolios'],
      queryFn: getMyPortfolios,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExpertPortfolio />
    </HydrationBoundary>
  );
}
