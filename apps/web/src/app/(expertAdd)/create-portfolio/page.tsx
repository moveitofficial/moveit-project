import { ExpertPortfolioCreate } from '@/feature/signup/components/ExpertPortfolioCreate';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function ExpertPortfolioCreatePage({
  searchParams,
}: Props) {
  const { id } = await searchParams;
  return <ExpertPortfolioCreate portfolioId={id} />;
}
