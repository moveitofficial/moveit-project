'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { confirmOrder, payOrder } from '@/feature/payment/api';
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
  // 채팅 결제였으면 끝나고 그 방으로 돌아간다.
  const [returnRoomId, setReturnRoomId] = useState<string | null>(null);
  const router = useRouter();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) {
      return;
    }
    calledRef.current = true;

    const params = new URLSearchParams(globalThis.location.search);
    const paymentKey = params.get('paymentKey');
    const amount = params.get('amount');
    // 채팅 거래요청 결제(기존 주문) 식별자
    const payOrderId = params.get('payOrderId');
    const roomId = params.get('roomId');
    // 서비스 상세 직접구매 식별자
    const serviceId = params.get('serviceId');
    const orderId = params.get('orderId');

    if (paymentKey === null || amount === null) {
      setStatus('error');
      return;
    }

    void (async () => {
      try {
        if (payOrderId !== null) {
          await payOrder(payOrderId, {
            paymentKey,
            amount: Number(amount),
            roomId: roomId ?? undefined,
          });
          setReturnRoomId(roomId);
        } else if (serviceId !== null && orderId !== null) {
          await confirmOrder({
            serviceId,
            orderId,
            paymentKey,
            amount: Number(amount),
          });
        } else {
          setStatus('error');
          return;
        }
        setStatus('success');
      } catch {
        setStatus('error');
      }
    })();
  }, []);

  // 채팅 결제 성공 시 잠시 후 그 방으로 이동.
  useEffect(() => {
    if (status !== 'success' || returnRoomId === null) {
      return;
    }
    const timer = setTimeout(() => {
      router.replace(`/service/message?roomId=${returnRoomId}`);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [status, returnRoomId, router]);

  const copy = COPY[status];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.description}>{copy.description}</p>
      {status === 'confirming' ? null : (
        <div className={styles.actions}>
          {returnRoomId === null ? (
            <Link href="/" className={styles.primaryLink}>
              홈으로
            </Link>
          ) : (
            <Link
              href={{
                pathname: '/service/message',
                query: { roomId: returnRoomId },
              }}
              className={styles.primaryLink}
            >
              채팅으로 돌아가기
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
