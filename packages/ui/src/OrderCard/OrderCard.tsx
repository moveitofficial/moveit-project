import { typography } from '@repo/styles/typography';
import { formatDate, formatPrice } from '@repo/utils';
import clsx from 'clsx';
import Image from 'next/image';

import * as styles from './OrderCard.css';

import type { ReactNode } from 'react';

interface OrderCardAction {
  label: string;
  variant: 'blue' | 'white' | 'red';
  onClick?: () => void;
}

type OrderCardProps = {
  thumbnailUrl: string;
  badge: ReactNode;
  title: string;
  startDate: string;
  endDate: string;
  amount: number;
  actions?: OrderCardAction[];
} & (
  | { variant: 'web' }
  | { variant: 'admin-seller-service'; buyerName: string; category: string }
  | {
      variant: 'admin-orders';
      buyerName: string;
      sellerName: string;
      category: string;
    }
  | {
      variant: 'admin-settlement';
      buyerName: string;
      sellerName: string;
      category: string;
    }
);

export type { OrderCardAction };

export default function OrderCard(props: OrderCardProps) {
  const { thumbnailUrl, badge, title, startDate, endDate, amount, actions } =
    props;

  const showBuyer = props.variant !== 'web';
  const showSeller =
    props.variant === 'admin-orders' || props.variant === 'admin-settlement';
  const showCategory = props.variant !== 'web';

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <Image
          src={thumbnailUrl}
          alt={title}
          width={100}
          height={80}
          className={styles.thumbnail}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          {badge}
          {showBuyer && (
            <span className={clsx(typography.f14R, styles.buyerText)}>
              구매자 : {props.buyerName}
            </span>
          )}
          {showSeller && (
            <span className={clsx(typography.f14R, styles.metaText)}>
              판매자: {props.sellerName}
            </span>
          )}
          {showCategory && (
            <span className={clsx(typography.f14R, styles.metaText)}>
              {props.category}
            </span>
          )}
        </div>
        <p className={clsx(typography.f16B, styles.title)}>{title}</p>
        <p className={clsx(typography.f14R, styles.date)}>
          일정: {formatDate(startDate)} ~ {formatDate(endDate)}
        </p>
      </div>

      <div className={styles.right}>
        <p className={clsx(typography.f18EB, styles.amount)}>
          {formatPrice(amount)}
        </p>
        {actions !== undefined && actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={clsx(
                  typography.f14R,
                  action.variant === 'blue'
                    ? styles.blueButton
                    : action.variant === 'red'
                      ? styles.redButton
                      : styles.whiteButton,
                )}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
