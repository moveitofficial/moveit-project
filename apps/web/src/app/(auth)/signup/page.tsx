import * as style from './page.css';

import { RoleSelector } from '@/feature/signup/components/RoleSelector';

export default function SignupPage() {
  return (
    <main className={style.SignUpContainer}>
      <RoleSelector />
    </main>
  );
}
