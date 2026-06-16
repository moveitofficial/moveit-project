'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// 결제 통합 테스트 전용 페이지.
// 이 폴더(test-payment)만 지우면 다른 코드 영향 없이 깨끗하게 삭제됨.
// ─────────────────────────────────────────────────────────────

const CLIENT_KEY = 'test_ck_EP59LybZ8BJKRm5Z4LKY86GYo7pR';
const API_URL = 'http://localhost:8000';

// 구 플로우용 — Prisma Studio에서 ACTIVE 상태인 service.id 확인 후 교체 가능
const SERVICE_ID = '01a77587-970a-4006-ae6e-528aa98f76cc';
const LEGACY_TOTAL_AMOUNT = 3_374_482;
const LEGACY_ORDER_NAME = 'Tasty Plastic Bike';

type Flow = 'legacy' | 'pending';

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
  const [flow, setFlow] = useState<Flow>('legacy');
  const [pendingOrderId, setPendingOrderId] = useState('');
  const [pendingTotalAmount, setPendingTotalAmount] = useState('');
  const [pendingRoomId, setPendingRoomId] = useState('');
  const [status, setStatus] = useState<string>('대기 중');
  const [output, setOutput] = useState<string>('');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;

    const params = new URLSearchParams(globalThis.location.search);
    const paymentKey = params.get('paymentKey');
    const tossOrderId = params.get('orderId');
    const amount = params.get('amount');
    const savedFlow = params.get('flow') as Flow | null;
    const savedPendingOrderId = params.get('pendingOrderId');
    const savedRoomId = params.get('roomId');

    if (!paymentKey || !tossOrderId || !amount) return;

    calledRef.current = true;
    globalThis.history.replaceState({}, '', globalThis.location.pathname);

    if (savedFlow === 'pending' && savedPendingOrderId) {
      setStatus('Toss 위젯 통과 → 백엔드 payPendingOrder 호출 중...');
      void callPayPendingOrder({
        paymentKey,
        amount: Number(amount),
        pendingOrderId: savedPendingOrderId,
        roomId: savedRoomId ?? undefined,
      });
    } else {
      setStatus('Toss 위젯 통과 → 백엔드 createOrder 호출 중...');
      void callCreateOrder({ paymentKey, orderId: tossOrderId, amount: Number(amount) });
    }
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

  async function callCreateOrder(values: { paymentKey: string; orderId: string; amount: number }) {
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

  async function callPayPendingOrder(values: {
    paymentKey: string;
    amount: number;
    pendingOrderId: string;
    roomId?: string;
  }) {
    try {
      const res = await fetch(`${API_URL}/orders/${values.pendingOrderId}/pay`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentKey: values.paymentKey,
          amount: values.amount,
          ...(values.roomId && { roomId: values.roomId }),
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

    if (flow === 'pending' && !pendingOrderId.trim()) {
      setStatus('PENDING 주문 ID를 입력해주세요.');
      return;
    }
    if (flow === 'pending' && !pendingTotalAmount.trim()) {
      setStatus('결제 금액을 입력해주세요.');
      return;
    }
    if (flow === 'pending' && !pendingRoomId.trim()) {
      setStatus('채팅방 ID를 입력해주세요.');
      return;
    }

    const amount = flow === 'pending' ? Number(pendingTotalAmount) : LEGACY_TOTAL_AMOUNT;
    const orderName = flow === 'pending' ? `거래요청 결제 (${pendingOrderId.slice(0, 8)}...)` : LEGACY_ORDER_NAME;
    const tossOrderId = flow === 'pending' ? pendingOrderId : crypto.randomUUID();
    const customerKey = crypto.randomUUID();

    const base = globalThis.location.origin + globalThis.location.pathname;
    const successUrl =
      flow === 'pending'
        ? `${base}?flow=pending&pendingOrderId=${pendingOrderId}&roomId=${pendingRoomId}`
        : base;

    const tossPayments = TossPayments(CLIENT_KEY);
    const payment = tossPayments.payment({ customerKey });
    try {
      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: amount },
        orderId: tossOrderId,
        orderName,
        successUrl,
        failUrl: `${base}?fail=1`,
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

      <section style={{ border: '1px solid #ddd', padding: 20, marginBottom: 20 }}>
        <h3>1) CLIENT 계정 로그인</h3>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); }}
          style={{ padding: 8, width: 240, marginRight: 8 }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); }}
          style={{ padding: 8, width: 240, marginRight: 8 }}
        />
        <button
          type="button"
          onClick={() => { void login(); }}
          style={{ padding: '8px 16px' }}
        >
          로그인
        </button>
      </section>

      <section style={{ border: '1px solid #ddd', padding: 20, marginBottom: 20 }}>
        <h3>2) 플로우 선택</h3>
        <label style={{ marginRight: 24 }}>
          <input
            type="radio"
            name="flow"
            value="legacy"
            checked={flow === 'legacy'}
            onChange={() => { setFlow('legacy'); }}
            style={{ marginRight: 6 }}
          />
          구 플로우 — POST /users/me/orders (서비스 직접 결제)
        </label>
        <label>
          <input
            type="radio"
            name="flow"
            value="pending"
            checked={flow === 'pending'}
            onChange={() => { setFlow('pending'); }}
            style={{ marginRight: 6 }}
          />
          신규 플로우 — POST /orders/:id/pay (거래요청 결제)
        </label>
      </section>

      <section style={{ border: '1px solid #ddd', padding: 20, marginBottom: 20 }}>
        <h3>3) 결제 진행</h3>

        {flow === 'legacy' && (
          <p style={{ color: '#666', fontSize: 14 }}>
            serviceId: <code>{SERVICE_ID}</code>
            <br />
            totalAmount: {LEGACY_TOTAL_AMOUNT.toLocaleString()}원
          </p>
        )}

        {flow === 'pending' && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
              Swagger에서 POST /chat/rooms/:id/trade-request 호출 후 응답의 orderId와 totalAmount를 입력하세요.
            </p>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>PENDING 주문 ID (orderId)</label>
              <input
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={pendingOrderId}
                onChange={(e) => { setPendingOrderId(e.target.value); }}
                style={{ padding: 8, width: 400 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>결제 금액 (totalAmount, 원)</label>
              <input
                type="number"
                placeholder="0"
                value={pendingTotalAmount}
                onChange={(e) => { setPendingTotalAmount(e.target.value); }}
                style={{ padding: 8, width: 200 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>채팅방 ID (roomId)</label>
              <input
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={pendingRoomId}
                onChange={(e) => { setPendingRoomId(e.target.value); }}
                style={{ padding: 8, width: 400 }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => { void startPay(); }}
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
        ⚠️ 결제 통합 검증용 임시 페이지. 라우트: <code>/test-payment</code>
        <br />
        삭제 시: <code>apps/web/src/app/test-payment/</code> 폴더만 지우면 됨. 다른 코드 영향 없음.
      </p>
    </div>
  );
}
