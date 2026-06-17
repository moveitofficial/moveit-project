'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Palette,
  Underline,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import * as styles from './RichTextEditor.css';

import type { LucideIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// 텍스트 색상 팔레트(사용자 선택용 임의 색상 — 테마 토큰 아님).
const COLORS = [
  '#000000',
  '#FF0000',
  '#FF8800',
  '#FFCC00',
  '#00CC00',
  '#0066FF',
  '#9933FF',
  '#FF3399',
];

// 서식 버튼 그룹: B/I/U, 정렬, 리스트.
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

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isColorOpen, setIsColorOpen] = useState(false);

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

  const handleColorSelect = (color: string) => {
    runCommand('foreColor', color);
    setIsColorOpen(false);
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
                className={styles.button}
                aria-label={label}
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

        <div className={styles.colorWrapper}>
          <button
            type="button"
            className={styles.button}
            aria-label="글자 색상"
            onMouseDown={(event) => {
              event.preventDefault();
              setIsColorOpen((prev) => !prev);
            }}
          >
            <Palette size={18} aria-hidden />
          </button>
          {isColorOpen ? (
            <div className={styles.colorPicker}>
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={styles.swatch}
                  style={{ backgroundColor: color }}
                  aria-label={`색상 ${color}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleColorSelect(color);
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* 본문 — contentEditable */}
      <div
        ref={editorRef}
        className={styles.area}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        onInput={handleInput}
      />
    </div>
  );
}
