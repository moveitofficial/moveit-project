import { typography } from '@repo/styles/typography';
import { formatDate, formatPrice } from '@repo/utils';
import clsx from 'clsx';
import Image from 'next/image';

import { RectLabel } from '@repo/ui/RectLabel';

import * as styles from './OrderCard.css';

import type { RectLabelColor } from '@repo/ui/RectLabel';

interface OrderCardAction {
  label: string;
  variant: 'blue' | 'white' | 'red';
  onClick?: () => void;
}

type OrderCardProps = {
  thumbnailUrl: string | null;
  badge: { text: string; color: RectLabelColor };
  title: string;
  startDate: string;
  endDate?: string;
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

  const thumbnailImg = thumbnailUrl ? (
    <Image
      src={thumbnailUrl}
      alt={title}
      width={100}
      height={80}
      className={styles.thumbnail}
    />
  ) : (
    <div className={styles.thumbnailPlaceholder} />
  );

  const showBuyer = props.variant !== 'web';
  const showSeller =
    props.variant === 'admin-orders' || props.variant === 'admin-settlement';
  const showCategory = props.variant !== 'web';

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailWrapper}>{thumbnailImg}</div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <RectLabel text={badge.text} color={badge.color} />
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
          일정: {formatDate(startDate)} ~{' '}
          {endDate === undefined ? '미정' : formatDate(endDate)}
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
                  typography.f12R,
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
