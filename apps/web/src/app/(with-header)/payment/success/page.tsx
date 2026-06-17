'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { confirmOrder } from '@/feature/payment/api';
import * as styles from '@/feature/payment/result.css';


type Status = 'confirming' | 'success' | 'error';

const COPY: Record<Status, { title: string; description: string }> = {
  confirming: {
    title: '결제 확인 중...',
    description: '주문을 확정하고 있어요. 잠시만 기다려 주세요.',
  },
  success: {
    title: '결제가 완료되었어요',
    description: '주문이 정상적으로 접수되었습니다.',
  },
  error: {
    title: '주문 확정에 실패했어요',
    description:
      '결제는 처리됐지만 주문 확정 중 문제가 발생했습니다. 고객센터로 문의해 주세요.',
  },
};

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<Status>('confirming');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) {
      return;
    }
    calledRef.current = true;

    const params = new URLSearchParams(globalThis.location.search);
    const serviceId = params.get('serviceId');
    const orderId = params.get('orderId');
    const paymentKey = params.get('paymentKey');
    const amount = params.get('amount');

    if (
      serviceId === null ||
      orderId === null ||
      paymentKey === null ||
      amount === null
    ) {
      setStatus('error');
      return;
    }

    void (async () => {
      try {
        await confirmOrder({
          serviceId,
          orderId,
          paymentKey,
          amount: Number(amount),
        });
        setStatus('success');
      } catch {
        setStatus('error');
      }
    })();
  }, []);

  const copy = COPY[status];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.description}>{copy.description}</p>
      {status === 'confirming' ? null : (
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryLink}>
            홈으로
          </Link>
        </div>
      )}
    </div>
  );
}
