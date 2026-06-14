'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// 결제 통합 테스트 전용 페이지.
// 이 폴더(test-payment)만 지우면 다른 코드 영향 없이 깨끗하게 삭제됨.
// ─────────────────────────────────────────────────────────────

const CLIENT_KEY = 'test_ck_EP59LybZ8BJKRm5Z4LKY86GYo7pR';
const API_URL = 'http://localhost:8000';

// 테스트할 서비스 — Prisma Studio에서 ACTIVE 상태인 service.id 확인 후 교체 가능
const SERVICE_ID = '01a77587-970a-4006-ae6e-528aa98f76cc';
const TOTAL_AMOUNT = 3_374_482;
const ORDER_NAME = 'Tasty Plastic Bike';

type TossPaymentsFactory = (clientKey: string) => {
  payment: (opts: { customerKey: string }) => {
    requestPayment: (opts: {
      method: 'CARD';
      amount: { currency: string; value: number };
      orderId: string;
      orderName: string;
      successUrl: string;
      failUrl: string;
      card?: {
        useEscrow?: boolean;
        flowMode?: 'DEFAULT' | 'DIRECT';
        useCardPoint?: boolean;
        useAppCardOnly?: boolean;
      };
    }) => Promise<void>;
  };
};

function getTossPayments(): TossPaymentsFactory | undefined {
  const w = globalThis as unknown as { TossPayments?: TossPaymentsFactory };
  return w.TossPayments;
}

export default function TestPaymentPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string>('대기 중');
  const [output, setOutput] = useState<string>('');
  const calledRef = useRef(false);

  useEffect(() => {
    // StrictMode 이중 마운트 방지
    if (calledRef.current) return;

    const params = new URLSearchParams(globalThis.location.search);
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');

    if (!paymentKey || !orderId || !amount) return;

    calledRef.current = true;
    // 새로고침/뒤로가기로 재호출되지 않도록 쿼리스트링 즉시 제거
    globalThis.history.replaceState({}, '', globalThis.location.pathname);

    setStatus('Toss 위젯 통과 → 백엔드 createOrder 호출 중...');
    void callCreateOrder({
      paymentKey,
      orderId,
      amount: Number(amount),
    });
  }, []);

  async function login() {
    setStatus('로그인 중...');
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json: unknown = await res.json();
      setStatus(`로그인 응답: ${String(res.status)}`);
      setOutput(JSON.stringify(json, null, 2));
    } catch (error: unknown) {
      setStatus('로그인 실패');
      setOutput(error instanceof Error ? error.message : String(error));
    }
  }

  async function callCreateOrder(values: {
    paymentKey: string;
    orderId: string;
    amount: number;
  }) {
    try {
      const res = await fetch(`${API_URL}/users/me/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: SERVICE_ID,
          orderId: values.orderId,
          paymentKey: values.paymentKey,
          amount: values.amount,
        }),
      });
      const json: unknown = await res.json();
      setStatus(`백엔드 응답: ${String(res.status)}`);
      setOutput(JSON.stringify(json, null, 2));
    } catch (error: unknown) {
      setStatus('백엔드 호출 실패');
      setOutput(error instanceof Error ? error.message : String(error));
    }
  }

  async function startPay() {
    const TossPayments = getTossPayments();
    if (!TossPayments) {
      setStatus('Toss SDK 아직 로드 안 됨. 1-2초 후 다시 시도.');
      return;
    }
    const orderId = crypto.randomUUID();
    const customerKey = crypto.randomUUID();
    const tossPayments = TossPayments(CLIENT_KEY);
    const payment = tossPayments.payment({ customerKey });
    try {
      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: TOTAL_AMOUNT },
        orderId,
        orderName: ORDER_NAME,
        successUrl: globalThis.location.origin + globalThis.location.pathname,
        failUrl: `${globalThis.location.origin}${globalThis.location.pathname}?fail=1`,
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error: unknown) {
      setStatus(
        `결제 취소/실패: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800 }}>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="afterInteractive"
      />
      <h2>결제 통합 테스트 (임시)</h2>

      <section
        style={{ border: '1px solid #ddd', padding: 20, marginBottom: 20 }}
      >
        <h3>1) CLIENT 계정 로그인</h3>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          style={{ padding: 8, width: 240, marginRight: 8 }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          style={{ padding: 8, width: 240, marginRight: 8 }}
        />
        <button
          type="button"
          onClick={() => {
            void login();
          }}
          style={{ padding: '8px 16px' }}
        >
          로그인
        </button>
      </section>

      <section
        style={{ border: '1px solid #ddd', padding: 20, marginBottom: 20 }}
      >
        <h3>2) 결제 진행</h3>
        <p style={{ color: '#666', fontSize: 14 }}>
          serviceId: <code>{SERVICE_ID}</code>
          <br />
          totalAmount: {TOTAL_AMOUNT.toLocaleString()}원
        </p>
        <button
          type="button"
          onClick={() => {
            void startPay();
          }}
          style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}
        >
          결제하기
        </button>
      </section>

      <section>
        <h3>응답</h3>
        <p>상태: {status}</p>
        <pre
          style={{
            background: '#222',
            color: '#0f0',
            padding: 16,
            overflow: 'auto',
            minHeight: 200,
          }}
        >
          {output || '(결제 완료 후 응답이 여기 표시됩니다)'}
        </pre>
      </section>

      <hr style={{ margin: '40px 0' }} />
      <p style={{ color: '#999', fontSize: 12 }}>
        ⚠️ 결제 통합 검증용 임시 페이지. 라우트:{' '}
        <code>/test-payment</code>
        <br />
        삭제 시: <code>apps/web/src/app/test-payment/</code> 폴더만 지우면 됨.
        다른 코드 영향 없음.
      </p>
    </div>
  );
}
