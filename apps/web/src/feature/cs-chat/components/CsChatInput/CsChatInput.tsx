'use client';

import { Send } from 'lucide-react';
import { useRef, useState } from 'react';

import { INPUT_MAX_HEIGHT, INPUT_PLACEHOLDER } from '../../constants';

import * as styles from './CsChatInput.css';

import type { ChangeEvent, KeyboardEvent } from 'react';

interface CsChatInputProps {
  disabled?: boolean;
  onSubmit: (content: string) => void;
}

// 박스 패딩(16*2)을 제외한 textarea 최대 높이
const TEXTAREA_MAX_HEIGHT = INPUT_MAX_HEIGHT - 32;

export default function CsChatInput({ disabled, onSubmit }: CsChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = !disabled && value.trim().length > 0;

  const resize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    resize(event.target);
  };

  const submit = () => {
    if (!canSend) return;
    onSubmit(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 등 IME 조합 중 Enter는 조합 확정용이므로 전송하지 않는다
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.outer}>
      <div className={styles.box}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          placeholder={INPUT_PLACEHOLDER}
          disabled={disabled}
          rows={1}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={styles.sendButton}
          disabled={!canSend}
          onClick={submit}
          aria-label="문의 내용 전송"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
