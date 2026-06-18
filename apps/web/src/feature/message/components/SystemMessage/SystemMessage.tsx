'use client';

import movitNoti from '@public/noti/movitNoti.svg';
import Image from 'next/image';

import * as styles from './SystemMessage.css';

import type { ChatMessage, MessageRoomOrder } from '@/feature/message/types';
import type { ReactNode } from 'react';

import { formatScheduleDate } from '@/feature/message/utils';

interface Props {
  message: ChatMessage;
  order: MessageRoomOrder | null;
  serviceTitle: string;
  isSeller: boolean;
  isPaying: boolean;
  onPay: (order: MessageRoomOrder) => void;
  onCancelTradeRequest: () => void;
  isCancelingTrade: boolean;
  onChangeSchedule: () => void;
  scheduleChangeDone: boolean;
  onOpenOrderDetail: () => void;
}

function SystemCard({ children }: { children: ReactNode }) {
  return (
    <div className={styles.row}>
      <Image
        src={movitNoti}
        alt=""
        width={32}
        height={32}
        className={styles.avatar}
      />
      <div className={styles.card}>{children}</div>
    </div>
  );
}

function ServiceField({ title }: { title: string }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>서비스명</span>
      <p className={styles.fieldValue}>{title}</p>
    </div>
  );
}

function AmountBreakdown({
  order,
  totalLabel,
}: {
  order: MessageRoomOrder;
  totalLabel: string;
}) {
  return (
    <dl className={styles.amounts}>
      <div className={styles.amountRow}>
        <dt className={styles.amountLabel}>서비스 금액</dt>
        <dd className={styles.amountValue}>
          {order.agreedServicePrice.toLocaleString()}원
        </dd>
      </div>
      <div className={styles.amountRow}>
        <dt className={styles.amountLabel}>무빗 수수료</dt>
        <dd className={styles.amountValue}>
          {order.platformFee.toLocaleString()}원
        </dd>
      </div>
      <div className={styles.amountRow}>
        <dt className={styles.amountLabelTotal}>{totalLabel}</dt>
        <dd className={styles.amountValueTotal}>
          {order.totalAmount.toLocaleString()}원
        </dd>
      </div>
    </dl>
  );
}

// 역할별 금액: 구매자는 수수료+최종 결제금액, 판매자는 수수료 없이 최종 정산예정금액.
function SettlementBreakdown({
  order,
  isSeller,
}: {
  order: MessageRoomOrder;
  isSeller: boolean;
}) {
  return (
    <dl className={styles.amounts}>
      <div className={styles.amountRow}>
        <dt className={styles.amountLabel}>서비스 금액</dt>
        <dd className={styles.amountValue}>
          {order.agreedServicePrice.toLocaleString()}원
        </dd>
      </div>
      {isSeller ? null : (
        <div className={styles.amountRow}>
          <dt className={styles.amountLabel}>무빗 수수료</dt>
          <dd className={styles.amountValue}>
            {order.platformFee.toLocaleString()}원
          </dd>
        </div>
      )}
      <div className={styles.amountRow}>
        <dt className={styles.amountLabelTotal}>
          {isSeller ? '최종 정산예정금액' : '최종 결제금액'}
        </dt>
        <dd className={styles.amountValueTotal}>
          {(isSeller ? order.agreedServicePrice : order.totalAmount).toLocaleString()}
          원
        </dd>
      </div>
    </dl>
  );
}

export default function SystemMessage({
  message,
  order,
  serviceTitle,
  isSeller,
  isPaying,
  onPay,
  onCancelTradeRequest,
  isCancelingTrade,
  onChangeSchedule,
  scheduleChangeDone,
  onOpenOrderDetail,
}: Props) {
  const { systemType } = message;

  if (systemType === 'TRADE_REQUEST' && order !== null) {
    return (
      <SystemCard>
        <p className={styles.title}>
          {isSeller ? '고객에게 거래를 요청했어요' : '전문가가 거래를 요청했어요'}
        </p>
        <p className={styles.desc}>
          {isSeller
            ? '고객이 요청을 확인하고 있어요. 고객이 결제를 완료하면 서비스를 진행해 주세요.'
            : '금액이 맞는지 확인하고 결제를 진행해 주세요.'}
        </p>
        <ServiceField title={serviceTitle} />
        <SettlementBreakdown order={order} isSeller={isSeller} />
        {order.status === 'PENDING' && isSeller ? (
          <button
            type="button"
            className={styles.payButton}
            onClick={onCancelTradeRequest}
            disabled={isCancelingTrade}
          >
            결제 요청 취소
          </button>
        ) : null}
        {order.status === 'PENDING' && !isSeller ? (
          <button
            type="button"
            className={styles.payButton}
            onClick={() => {
              onPay(order);
            }}
            disabled={isPaying}
          >
            결제 하기
          </button>
        ) : null}
      </SystemCard>
    );
  }

  if (systemType === 'PAYMENT_COMPLETED' && order !== null) {
    return (
      <SystemCard>
        <p className={styles.title}>결제가 완료되었습니다.</p>
        <ServiceField title={serviceTitle} />
        <SettlementBreakdown order={order} isSeller={isSeller} />
        <p className={styles.desc}>
          {isSeller
            ? '고객과 협의 후 반드시 일정을 등록해 주세요. 일정을 등록하지 않으면 구매 확정을 진행할 수 없습니다. 또한, 등록된 일정 내에 작업을 완료하지 못할 경우 고객이 환불을 요청하면 전액 환불될 수 있습니다.'
            : '일정 등록 요청해주세요. 일정을 등록하지 않으면 구매 확정을 진행할 수 없습니다. 일정 내 작업 미완료시 전액 무료환불이 가능해요.'}
        </p>
        {isSeller ? (
          <button
            type="button"
            className={styles.payButton}
            onClick={onChangeSchedule}
          >
            일정등록하기
          </button>
        ) : null}
      </SystemCard>
    );
  }

  if (systemType === 'PAYMENT_HELD') {
    return (
      <SystemCard>
        <p className={styles.title}>
          무빗이 결제 금액을 안전하게 보관하고있어요
        </p>
        <p className={styles.desc}>
          최종 결과물을 받고 거래확정 버튼을 눌러주세요. 거래를 확정하면
          전문가에게 결제금액이 송금됩니다.
        </p>
        <button
          type="button"
          className={styles.payButton}
          onClick={onOpenOrderDetail}
        >
          거래 상세보기
        </button>
      </SystemCard>
    );
  }

  if (systemType === 'SCHEDULE_REQUEST') {
    return (
      <SystemCard>
        <p className={styles.title}>
          {isSeller ? '일정을 등록해주세요' : '일정을 등록요청해주세요'}
        </p>
        <p className={styles.desc}>
          {isSeller
            ? '일정을 등록해주세요. 일정을 등록하지 않으면 구매 확정을 진행할 수 없습니다. 일정 내 작업 미완료시 전액 무료환불 가능합니다.'
            : '판매자에게 일정을 등록요청해주세요. 일정을 등록하지 않으면 구매 확정을 진행할 수 없습니다. 일정 내 작업 미완료시 전액 무료환불 가능합니다.'}
        </p>
        {isSeller ? (
          <button
            type="button"
            className={styles.payButton}
            onClick={onChangeSchedule}
          >
            일정등록하기
          </button>
        ) : null}
      </SystemCard>
    );
  }

  if (systemType === 'SCHEDULE_REGISTERED' && order !== null) {
    return (
      <SystemCard>
        <p className={styles.title}>일정 등록이 완료되었습니다.</p>
        <ServiceField title={serviceTitle} />
        <div className={styles.field}>
          <span className={styles.fieldLabel}>시작일</span>
          <p className={styles.fieldValueStrong}>
            {order.startDate === null ? '-' : formatScheduleDate(order.startDate)}
          </p>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>마감일</span>
          <p className={styles.fieldValueStrong}>
            {order.endDate === null ? '-' : formatScheduleDate(order.endDate)}
          </p>
        </div>
        <p className={styles.desc}>
          마감일 미준수 시 구매자 요청에 따라 100% 환불이 진행됩니다. 일정
          변경시 반드시 고객님과 상의 후 일정을 변경하세요.
        </p>
      </SystemCard>
    );
  }

  if (systemType === 'SCHEDULE_CHANGE_REQUEST') {
    return (
      <SystemCard>
        <p className={styles.title}>일정변경요청</p>
        <ServiceField title={serviceTitle} />
        <p className={styles.desc}>판매자님이 일정변경 요청 하였습니다.</p>
        {isSeller ? null : (
          <button
            type="button"
            className={styles.payButton}
            onClick={onChangeSchedule}
            disabled={scheduleChangeDone}
          >
            일정 변경하기
          </button>
        )}
      </SystemCard>
    );
  }

  if (systemType === 'TRADE_CANCELED' && order !== null) {
    return (
      <SystemCard>
        <p className={styles.title}>거래가 취소되었어요</p>
        <ServiceField title={serviceTitle} />
        <AmountBreakdown order={order} totalLabel="환불 금액" />
      </SystemCard>
    );
  }

  if (systemType === 'TRADE_REQUEST_CANCELED') {
    return (
      <SystemCard>
        <p className={styles.title}>거래 요청이 취소되었어요</p>
        <p className={styles.desc}>전문가가 거래 요청을 취소했습니다.</p>
        <ServiceField title={serviceTitle} />
      </SystemCard>
    );
  }

  if (systemType === 'TRADE_REQUEST_EXPIRED') {
    return (
      <SystemCard>
        <p className={styles.title}>거래 요청이 만료되었어요</p>
        <p className={styles.desc}>
          3일 이내 결제가 이뤄지지 않아 거래 요청이 만료되었습니다.
        </p>
        <ServiceField title={serviceTitle} />
      </SystemCard>
    );
  }

  return (
    <SystemCard>
      <p className={styles.title}>{message.content}</p>
    </SystemCard>
  );
}
