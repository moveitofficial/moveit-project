'use client';

import clsx from 'clsx';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import * as styles from './RichTextEditor.css';

import type { LucideIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  // 지정 시 본문 영역 높이를 고정(px). 미지정이면 기본 min/max 자동.
  bodyHeight?: number;
}

// 서식 버튼 그룹: B/I/U, 정렬, 리스트. (색상 기능 없음)
const COMMAND_GROUPS: { icon: LucideIcon; command: string; label: string }[][] =
  [
    [
      { icon: Bold, command: 'bold', label: '굵게' },
      { icon: Italic, command: 'italic', label: '기울임' },
      { icon: Underline, command: 'underline', label: '밑줄' },
    ],
    [
      { icon: AlignLeft, command: 'justifyLeft', label: '왼쪽 정렬' },
      { icon: AlignCenter, command: 'justifyCenter', label: '가운데 정렬' },
      { icon: AlignRight, command: 'justifyRight', label: '오른쪽 정렬' },
    ],
    [
      { icon: List, command: 'insertUnorderedList', label: '글머리 기호' },
      { icon: ListOrdered, command: 'insertOrderedList', label: '번호 매기기' },
    ],
  ];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  bodyHeight,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});

  // 현재 선택/커서 기준으로 각 서식 버튼의 활성 상태를 갱신.
  const refreshActive = () => {
    const next: Record<string, boolean> = {};
    for (const groupItems of COMMAND_GROUPS) {
      for (const { command } of groupItems) {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        next[command] = document.queryCommandState(command);
      }
    }
    setActive(next);
  };

  // 외부 value가 현재 내용과 다를 때만 반영(입력 중엔 동일 → 커서 유지).
  useEffect(() => {
    const element = editorRef.current;
    if (element !== null && element.innerHTML !== value) {
      element.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    // execCommand는 deprecated지만 경량 서식 편집엔 충분(외부 라이브러리 불필요).
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand(command, false, commandValue);
    const element = editorRef.current;
    if (element !== null) {
      element.focus();
      onChange(element.innerHTML);
    }
    refreshActive();
  };

  const handleInput = () => {
    const element = editorRef.current;
    if (element === null) {
      return;
    }
    // 빈 상태의 <br>은 제거해 placeholder(:empty)가 보이도록 한다.
    if (element.innerHTML === '<br>') {
      element.innerHTML = '';
    }
    onChange(element.innerHTML);
  };

  return (
    <div className={styles.editor}>
      {/* 툴바 — onMouseDown + preventDefault로 에디터 선택 영역을 유지한다. */}
      <div className={styles.toolbar}>
        {COMMAND_GROUPS.map((groupItems, groupIndex) => (
          <div key={groupIndex} className={styles.group}>
            {groupItems.map(({ icon: Icon, command, label }) => (
              <button
                key={command}
                type="button"
                className={clsx(
                  styles.button,
                  active[command] && styles.buttonActive,
                )}
                aria-label={label}
                aria-pressed={active[command] ?? false}
                onMouseDown={(event) => {
                  event.preventDefault();
                  runCommand(command);
                }}
              >
                <Icon size={18} aria-hidden />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* 본문 — contentEditable */}
      <div
        ref={editorRef}
        className={styles.area}
        style={
          bodyHeight === undefined
            ? undefined
            : { height: bodyHeight, minHeight: bodyHeight, maxHeight: bodyHeight }
        }
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyUp={refreshActive}
        onMouseUp={refreshActive}
        onFocus={refreshActive}
      />
    </div>
  );
}
