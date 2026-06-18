'use client';

import { useEffect, useReducer, useRef, useState } from 'react';

import {
  AGREE_AND_CONNECT_LABEL,
  AGREE_LABEL,
  AUTO_REPLIES,
  AWAIT_INPUT_TEXT,
  BACK_TO_MENU_LABEL,
  BACK_TO_START_LABEL,
  BOT_MENUS,
  CONNECT_AGENT_LABEL,
  CONSENT_LINK_LABEL,
  CONSENT_TEXT,
  CS_BRAND,
  DISAGREE_LABEL,
  DISAGREE_TEXT,
  MENU_GREETING_BODY,
} from '../../constants';
import { formatStamp } from '../../csTime';
import { useCsLiveChat } from '../../useCsLiveChat';
import { CsChatInput } from '../CsChatInput';
import { CsMessageList } from '../CsMessageList';

import * as styles from './CsBotFlow.css';

import type { CsBotChoice, CsBotEntry } from '../../types';

interface BotState {
  seq: number;
  entries: CsBotEntry[];
  choices: CsBotChoice[];
  inputEnabled: boolean;
}

const MENU_CHOICES: CsBotChoice[] = [
  ...BOT_MENUS.map(
    ({ menu, label }): CsBotChoice => ({
      label,
      action: { type: 'autoReply', menu },
    }),
  ),
  { label: CONNECT_AGENT_LABEL, action: { type: 'connect' } },
];

const AFTER_AUTO_REPLY_CHOICES: CsBotChoice[] = [
  { label: CONNECT_AGENT_LABEL, action: { type: 'connect' } },
  { label: BACK_TO_MENU_LABEL, action: { type: 'menu' } },
  { label: BACK_TO_START_LABEL, action: { type: 'backToStart' } },
];

const CONSENT_CHOICES: CsBotChoice[] = [
  { label: AGREE_LABEL, action: { type: 'agree' } },
  { label: DISAGREE_LABEL, action: { type: 'disagree' } },
];

const DISAGREE_CHOICES: CsBotChoice[] = [
  { label: AGREE_AND_CONNECT_LABEL, action: { type: 'agree' } },
  { label: BACK_TO_START_LABEL, action: { type: 'backToStart' } },
];

const CONSENT_BUBBLE = `${CONSENT_TEXT}\n\n${CONSENT_LINK_LABEL}`;

function createInitialState(): BotState {
  return {
    seq: 1,
    entries: [{ id: 'cs-bot-0', role: 'bot', text: '', lines: MENU_GREETING_BODY }],
    choices: MENU_CHOICES,
    inputEnabled: false,
  };
}

function appendDialog(
  state: BotState,
  userText: string,
  botText: string,
  choices: CsBotChoice[],
  inputEnabled: boolean,
): BotState {
  const userEntry: CsBotEntry = {
    id: `cs-bot-${state.seq}`,
    role: 'user',
    text: userText,
  };
  const botEntry: CsBotEntry = {
    id: `cs-bot-${state.seq + 1}`,
    role: 'bot',
    text: botText,
    caption: CS_BRAND,
  };
  return {
    seq: state.seq + 2,
    entries: [...state.entries, userEntry, botEntry],
    choices,
    inputEnabled,
  };
}

function reducer(state: BotState, choice: CsBotChoice): BotState {
  const { action, label } = choice;
  switch (action.type) {
    case 'backToStart': {
      return createInitialState();
    }
    case 'menu': {
      return { ...state, choices: MENU_CHOICES, inputEnabled: false };
    }
    case 'autoReply': {
      return appendDialog(
        state,
        label,
        AUTO_REPLIES[action.menu],
        AFTER_AUTO_REPLY_CHOICES,
        false,
      );
    }
    case 'connect': {
      return appendDialog(state, label, CONSENT_BUBBLE, CONSENT_CHOICES, false);
    }
    case 'agree': {
      return appendDialog(state, label, AWAIT_INPUT_TEXT, [], true);
    }
    case 'disagree': {
      return appendDialog(state, label, DISAGREE_TEXT, DISAGREE_CHOICES, false);
    }
  }
}

export default function CsBotFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [today] = useState(() => formatStamp(new Date().toISOString()).date);
  const { roomId, items, assigned, send, isCreating } = useCsLiveChat(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [state.entries, state.choices, items]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.transcript}>
        {state.entries.map((entry) =>
          entry.role === 'bot' ? (
            <div key={entry.id} className={styles.botMessage}>
              {entry.lines ? (
                <div className={styles.botLines}>
                  {entry.lines.map((line, index) => (
                    <p
                      key={line.text || `blank-${index}`}
                      className={line.bold ? styles.botTextBold : styles.botText}
                    >
                      {line.text === '' ? ' ' : line.text}
                    </p>
                  ))}
                </div>
              ) : (
                <p className={styles.botText}>{entry.text}</p>
              )}
              {entry.caption ? (
                <div className={styles.meta}>
                  <span className={styles.metaAvatar} aria-hidden>
                    m
                  </span>
                  <span>{entry.caption}</span>
                  <span>{today}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <div key={entry.id} className={styles.userRow}>
              <span className={styles.userPill}>{entry.text}</span>
            </div>
          ),
        )}

        {state.choices.length > 0 ? (
          <div className={styles.choices}>
            {state.choices.map((choice) => (
              <button
                key={choice.label}
                type="button"
                className={styles.chip}
                onClick={() => {
                  dispatch(choice);
                }}
              >
                {choice.label}
              </button>
            ))}
          </div>
        ) : null}

        <CsMessageList items={items} showConnecting={!!roomId && !assigned} />

        <div ref={bottomRef} />
      </div>

      {state.inputEnabled ? (
        <CsChatInput disabled={isCreating} onSubmit={send} />
      ) : null}
    </div>
  );
}
