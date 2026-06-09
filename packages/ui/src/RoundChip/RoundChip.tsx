import { vars } from '@repo/styles/tokens';
import { X } from 'lucide-react';

import * as styles from './RoundChip.css';

interface Props {
  text: string;
  size: 'admin' | 'web';
  color?:
    | 'labelWhite'
    | 'white'
    | 'blue100'
    | 'blue300'
    | 'blue400'
    | 'red200'
    | 'yellow100';
  opacity?: 'full' | 'half';
  close?: boolean;
}

export default function RoundChip({
  text,
  size,
  color,
  opacity,
  close,
}: Props) {
  return (
    <div className={styles.roundContainer({ size, color, opacity })}>
      {text}
      {close && (
        <X size={16} strokeWidth={2} color={vars.color.gray400} aria-hidden />
      )}
    </div>
  );
}
