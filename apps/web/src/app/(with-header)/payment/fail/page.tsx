import Link from 'next/link';

import * as styles from '@/feature/payment/result.css';

interface Props {
  searchParams: Promise<{ message?: string }>;
}

export default async function PaymentFailPage({ searchParams }: Props) {
  const { message } = await searchParams;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>결제에 실패했어요</h1>
      <p className={styles.description}>
        {message ?? '결제가 취소되었거나 처리 중 문제가 발생했습니다.'}
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.secondaryLink}>
          홈으로
        </Link>
      </div>
    </div>
  );
}
