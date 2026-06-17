'use client';

import { Paperclip } from 'lucide-react';
import { useRef, useState } from 'react';

import {
  ATTACH_LABEL,
  COMPLETE_LABEL,
  INPUT_PLACEHOLDER,
  SEND_LABEL,
} from '../../constants';

import * as styles from './CsAdminChatInput.css';

import type { ChangeEvent, KeyboardEvent } from 'react';

interface CsAdminChatInputProps {
  disabled?: boolean;
  onSend: (content: string) => void;
  onComplete: () => void;
  onAttach: (file: File) => void;
}

export default function CsAdminChatInput({
  disabled,
  onSend,
  onComplete,
  onAttach,
}: CsAdminChatInputProps) {
  const [value, setValue] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const canSend = !disabled && value.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 IME 조합 중 Enter는 전송하지 않는다
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onAttach(file);
    event.target.value = '';
  };

  return (
    <div className={styles.bar}>
      <textarea
        className={styles.input}
        value={value}
        placeholder={INPUT_PLACEHOLDER}
        disabled={disabled}
        rows={1}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.actions}>
        <div className={styles.leftActions}>
          <button
            type="button"
            className={styles.outlineButton}
            disabled={disabled}
            onClick={() => fileRef.current?.click()}
          >
            <Paperclip size={16} />
            {ATTACH_LABEL}
          </button>
          <button
            type="button"
            className={styles.outlineButton}
            disabled={disabled}
            onClick={onComplete}
          >
            {COMPLETE_LABEL}
          </button>
        </div>
        <button
          type="button"
          className={styles.sendButton}
          disabled={!canSend}
          onClick={submit}
        >
          {SEND_LABEL}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        hidden
        onChange={handleFile}
      />
    </div>
  );
}
