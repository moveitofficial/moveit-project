import { EmailCredentials } from '@/feature/signup/components/EmailCredentials';

interface Props {
  searchParams: Promise<{ role?: string }>;
}

export default async function EmailCredentialsPage({ searchParams }: Props) {
  const { role } = await searchParams;

  return <EmailCredentials role={role === 'EXPERT' ? 'EXPERT' : 'CLIENT'} />;
}
