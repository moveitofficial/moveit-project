import * as style from './page.css';

import { RoleSelector } from '@/feature/signup/components/RoleSelector';

interface Props {
  searchParams: Promise<{ social?: string }>;
}

export default async function SignupPage({ searchParams }: Props) {
  const { social } = await searchParams;

  return (
    <main className={style.SignUpContainer}>
      <RoleSelector isSocial={social === 'true'} />
    </main>
  );
}
