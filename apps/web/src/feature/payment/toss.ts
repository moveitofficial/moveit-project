import {
  PAYMENT_FAIL_PATH,
  PAYMENT_SUCCESS_PATH,
  TOSS_CLIENT_KEY,
  TOSS_SDK_URL,
} from './constants';

interface TossPaymentsInstance {
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
}

type TossPaymentsFactory = (clientKey: string) => TossPaymentsInstance;

function getTossGlobal(): TossPaymentsFactory | undefined {
  return (globalThis as unknown as { TossPayments?: TossPaymentsFactory })
    .TossPayments;
}

let loadPromise: Promise<TossPaymentsFactory> | null = null;

// 바로구매를 누른 시점에 한 번만 SDK를 로드한다.
function loadTossPayments(): Promise<TossPaymentsFactory> {
  const existing = getTossGlobal();
  if (existing) {
    return Promise.resolve(existing);
  }

  loadPromise ??= new Promise<TossPaymentsFactory>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TOSS_SDK_URL;
    script.async = true;
    script.addEventListener('load', () => {
      const factory = getTossGlobal();
      if (factory) {
        resolve(factory);
      } else {
        reject(new Error('결제 모듈을 불러오지 못했습니다.'));
      }
    });
    script.addEventListener('error', () => {
      reject(new Error('결제 모듈을 불러오지 못했습니다.'));
    });
    document.head.append(script);
  });

  return loadPromise;
}

interface RequestServicePaymentParams {
  serviceId: string;
  orderName: string;
  amount: number;
}

// Toss 결제창을 띄운다. 성공 시 successUrl로, 취소/실패 시 reject 또는 failUrl로 이동한다.
export async function requestServicePayment(
  params: RequestServicePaymentParams,
): Promise<void> {
  const TossPayments = await loadTossPayments();
  const tossPayments = TossPayments(TOSS_CLIENT_KEY);
  const payment = tossPayments.payment({ customerKey: crypto.randomUUID() });

  const { origin } = globalThis.location;
  await payment.requestPayment({
    method: 'CARD',
    amount: { currency: 'KRW', value: params.amount },
    orderId: crypto.randomUUID(),
    orderName: params.orderName,
    successUrl: `${origin}${PAYMENT_SUCCESS_PATH}?serviceId=${params.serviceId}`,
    failUrl: `${origin}${PAYMENT_FAIL_PATH}`,
    card: {
      useEscrow: false,
      flowMode: 'DEFAULT',
      useCardPoint: false,
      useAppCardOnly: false,
    },
  });
}
