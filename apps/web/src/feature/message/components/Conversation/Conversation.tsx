'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Paperclip,
  Presentation,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { OrderDetailModal } from '../OrderDetailModal';
import { ScheduleModal } from '../ScheduleModal';
import { SystemMessage } from '../SystemMessage';
import { TradeRequestModal } from '../TradeRequestModal';

import * as styles from './Conversation.css';

import type {
  ChatMessage,
  MessageAttachment,
  MessageRoomCounterpart,
  MessageRoomOrder,
} from '@/feature/message/types';
import type { ChangeEvent, KeyboardEvent } from 'react';

import { useAttachmentStore } from '@/feature/message/attachmentStore';
import {
  useCreateTradeRequest,
  useRequestScheduleChange,
  useRoomService,
  useUpdateSchedule,
  useUploadRoomFile,
} from '@/feature/message/useMessage';
import { useMessageChat } from '@/feature/message/useMessageChat';
import {
  formatMessageTime,
  formatScheduleDate,
  getCounterpartInitials,
} from '@/feature/message/utils';
import { requestOrderPayment } from '@/feature/payment/toss';

interface Props {
  roomId: string;
  myId: string | null;
  counterpart: MessageRoomCounterpart | null;
  isSeller: boolean;
}

export default function Conversation({
  roomId,
  myId,
  counterpart,
  isSeller,
}: Props) {
  const {
    messages,
    room,
    isLoading,
    sendText,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessageChat(roomId);
  const { data: serviceInfo } = useRoomService(room?.currentService.id ?? null);
  const tradeRequest = useCreateTradeRequest(roomId);
  const scheduleMutation = useUpdateSchedule(room?.order?.id ?? '');
  const scheduleChangeRequest = useRequestScheduleChange(room?.order?.id ?? '');
  const uploadMutation = useUploadRoomFile(roomId);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  // 구매자가 이번 변경 요청에 대해 일정을 바꿨는지(버튼 비활성화용).
  const [scheduleChangeDone, setScheduleChangeDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 이전 메시지 prepend 직전 스크롤 높이(위치 보존용).
  const prevScrollHeightRef = useRef<number | null>(null);
  // 바닥 고정 여부(사용자 스크롤로만 갱신).
  const pinBottomRef = useRef(true);
  // 마지막으로 프로그램이 설정한 scrollTop(우리가 만든 scroll 이벤트 식별용).
  const lastProgrammaticTopRef = useRef(-1);

  const scrollToBottom = () => {
    const element = scrollRef.current;
    if (element === null) {
      return;
    }
    element.scrollTop = element.scrollHeight;
    // 클램프된 실제 값을 기록 → 이 스크롤 이벤트는 사용자 동작이 아님.
    lastProgrammaticTopRef.current = element.scrollTop;
  };

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element === null) {
      return;
    }
    // 우리가 방금 설정한 scrollTop이면 사용자 스크롤이 아니므로 고정 상태 유지.
    if (Math.abs(element.scrollTop - lastProgrammaticTopRef.current) <= 1) {
      return;
    }
    pinBottomRef.current =
      element.scrollHeight - element.scrollTop - element.clientHeight < 80;
    // 맨 위로 스크롤하면 이전 메시지 로드.
    if (hasNextPage && !isFetchingNextPage && element.scrollTop <= 80) {
      prevScrollHeightRef.current = element.scrollHeight;
      void fetchNextPage();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    // 업로드된 FILE 메시지는 소켓으로 도착한다.
    if (file !== undefined) {
      // 내가 보낸 파일이므로 위로 올려둔 상태여도 바닥으로 내려간다.
      pinBottomRef.current = true;
      uploadMutation.mutate(file);
    }
  };

  // 마지막 메시지 id — 페이지 크기가 고정이라 새 메시지가 와도 length가
  // 안 변할 수 있어, 바닥 갱신 판단은 마지막 id로 한다(길이는 prepend 감지용).
  const lastMessageId = messages.at(-1)?.id ?? null;
  // 새 메시지/진입 → 바닥, 이전 메시지 로드(prepend) → 위치 보존.
  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (element === null) {
      return;
    }
    if (prevScrollHeightRef.current === null) {
      if (pinBottomRef.current) {
        scrollToBottom();
      }
    } else {
      element.scrollTop = element.scrollHeight - prevScrollHeightRef.current;
      lastProgrammaticTopRef.current = element.scrollTop;
      prevScrollHeightRef.current = null;
    }
  }, [messages.length, lastMessageId]);

  // 이미지·카드가 늦게 로드돼 높이가 늘면, 바닥 근처였을 때 다시 바닥으로.
  useEffect(() => {
    const element = scrollRef.current;
    const contentEl = contentRef.current;
    if (element === null || contentEl === null) {
      return;
    }
    const observer = new ResizeObserver(() => {
      if (prevScrollHeightRef.current === null && pinBottomRef.current) {
        scrollToBottom();
      }
    });
    observer.observe(contentEl);
    return () => {
      observer.disconnect();
    };
  }, []);

  // 새 일정 변경 요청이 오면 변경 버튼을 다시 활성화.
  let lastChangeRequestId: string | null = null;
  for (const message of messages) {
    if (message.systemType === 'SCHEDULE_CHANGE_REQUEST') {
      lastChangeRequestId = message.id;
    }
  }
  useEffect(() => {
    setScheduleChangeDone(false);
  }, [lastChangeRequestId]);

  const canSend = draft.trim().length > 0;
  // 결제요청은 판매자이고, 진행 중인 주문이 없을 때만.
  // 만료된 거래요청(TRADE_REQUEST_EXPIRED)은 order가 남아있어도 죽은 주문이라 재요청 허용.
  const order = room?.order ?? null;
  const canRequestPayment =
    isSeller &&
    room !== null &&
    (order === null || order.status === 'TRADE_REQUEST_EXPIRED');
  // 결제 완료 후 주문은 NEGOTIATING(논의중) — 이때 판매자가 일정 최초 등록.
  const canRegisterSchedule =
    isSeller &&
    order !== null &&
    order.status === 'NEGOTIATING' &&
    order.endDate === null;
  const canRequestScheduleChange =
    isSeller &&
    order !== null &&
    order.status === 'IN_PROGRESS' &&
    order.endDate !== null;
  const hasSchedule = (order?.endDate ?? null) !== null;

  const handleRequestScheduleChange = () => {
    scheduleChangeRequest.mutate(roomId);
  };

  const handlePay = (order: MessageRoomOrder) => {
    setIsPaying(true);
    // 성공 시 토스 결제창으로 이동, 취소·실패 시 reset.
    void requestOrderPayment({
      orderId: order.id,
      roomId,
      orderName: room?.currentService.title ?? '',
      amount: order.totalAmount,
    }).catch(() => {
      setIsPaying(false);
    });
  };

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    // 내가 보낸 메시지는 위로 올려둔 상태여도 항상 바닥으로 내려간다.
    pinBottomRef.current = true;
    sendText(draft.trim());
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    // 한글 IME 조합 중 Enter는 조합 확정용 → 무시(마지막 글자 분리·중복 전송 방지).
    if (event.nativeEvent.isComposing) {
      return;
    }

    // Ctrl/Cmd + Enter → 커서 위치에 줄바꿈 삽입
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setDraft((prev) => `${prev.slice(0, start)}\n${prev.slice(end)}`);
      requestAnimationFrame(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1;
      });
      return;
    }

    // Enter → 전송
    event.preventDefault();
    handleSend();
  };

  return (
    <div className={styles.conversation}>
      <div
        ref={scrollRef}
        className={styles.messageScroll}
        onScroll={handleScroll}
      >
        <div ref={contentRef} className={styles.messageContent}>
        {isLoading ? (
          <p className={styles.stateText}>대화를 불러오는 중...</p>
        ) : (
          messages.map((message) =>
            message.type === 'SYSTEM' ? (
              <SystemMessage
                key={message.id}
                message={message}
                order={room?.order ?? null}
                serviceTitle={room?.currentService.title ?? ''}
                isSeller={isSeller}
                isPaying={isPaying}
                onPay={handlePay}
                onChangeSchedule={() => {
                  setIsScheduleOpen(true);
                }}
                scheduleChangeDone={scheduleChangeDone}
                onOpenOrderDetail={() => {
                  setIsOrderDetailOpen(true);
                }}
              />
            ) : (
              <MessageRow
                key={message.id}
                message={message}
                myId={myId}
                counterpart={counterpart}
              />
            ),
          )
        )}
        </div>
      </div>

      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요 (Enter: 전송 / Ctrl + Enter: 줄바꿈)"
        />
        <div className={styles.inputBottom}>
          <div className={styles.actionGroup}>
            <button
              type="button"
              className={styles.attachButton}
              onClick={handleAttachClick}
              disabled={uploadMutation.isPending}
            >
              <Paperclip size={16} aria-hidden />
              파일 첨부
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.xls,.xlsx,.ppt,.pptx,.doc,.docx"
              hidden
              onChange={handleFileChange}
            />
            {isSeller ? (
              <>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => {
                    setIsTradeOpen(true);
                  }}
                  disabled={!canRequestPayment}
                >
                  결제 요청
                </button>
                {hasSchedule ? (
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={handleRequestScheduleChange}
                    disabled={
                      !canRequestScheduleChange || scheduleChangeRequest.isPending
                    }
                  >
                    일정 변경 요청
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                      setIsScheduleOpen(true);
                    }}
                    disabled={!canRegisterSchedule}
                  >
                    일정 등록
                  </button>
                )}
              </>
            ) : null}
          </div>
          <button
            type="button"
            className={clsx(
              styles.sendButton,
              canSend ? undefined : styles.sendButtonDisabled,
            )}
            onClick={handleSend}
            disabled={!canSend}
          >
            전송
          </button>
        </div>
      </div>

      {isSeller && room !== null ? (
        <TradeRequestModal
          isOpen={isTradeOpen}
          onClose={() => {
            setIsTradeOpen(false);
          }}
          service={{
            ...room.currentService,
            thumbnailUrl: serviceInfo?.thumbnailUrl,
          }}
          isSubmitting={tradeRequest.isPending}
          onSubmit={(amount) => {
            tradeRequest.mutate(amount, {
              onSuccess: () => {
                setIsTradeOpen(false);
              },
            });
          }}
        />
      ) : null}

      {order === null ? null : (
        <OrderDetailModal
          isOpen={isOrderDetailOpen}
          onClose={() => {
            setIsOrderDetailOpen(false);
          }}
          order={order}
          isSeller={isSeller}
        />
      )}

      {order === null ? null : (
        <ScheduleModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
          }}
          title={isSeller ? '일정 등록' : '일정 변경'}
          submitLabel={isSeller ? '일정 등록하기' : '일정 변경하기'}
          isSubmitting={scheduleMutation.isPending}
          onSubmit={(endDate) => {
            scheduleMutation.mutate(
              { endDate, roomId },
              {
                onSuccess: () => {
                  setIsScheduleOpen(false);
                  // 변경된 일정(order)을 즉시 반영(등록된 일정 패널·카드).
                  void queryClient.invalidateQueries({
                    queryKey: ['messageHistory', roomId],
                  });
                  // 구매자의 일정 변경은 알릴 시스템 메시지가 없어 텍스트로 알린다.
                  if (!isSeller) {
                    setScheduleChangeDone(true);
                    pinBottomRef.current = true;
                    sendText(
                      `일정이 ${formatScheduleDate(endDate)}로 변경되었습니다.`,
                    );
                  }
                },
              },
            );
          }}
        />
      )}
    </div>
  );
}

interface MessageRowProps {
  message: ChatMessage;
  myId: string | null;
  counterpart: MessageRoomCounterpart | null;
}

function MessageRow({ message, myId, counterpart }: MessageRowProps) {
  const isMine = message.senderId !== null && message.senderId === myId;
  const time = formatMessageTime(message.createdAt);
  // 내역 API엔 attachments가 없으므로 소켓 때 캐시해둔 값으로 폴백.
  const cached = useAttachmentStore((state) => state.byMessageId[message.id]);
  const attachments = message.attachments ?? cached ?? [];

  const bubble = (
    <div className={styles.bubbleGroup}>
      {/* 파일 메시지는 "파일을 보냈습니다." 텍스트 대신 첨부로만 표현. */}
      {message.content.length > 0 && attachments.length === 0 ? (
        <p
          className={clsx(
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleOther,
          )}
        >
          {message.content}
        </p>
      ) : null}
      {attachments.map((attachment) =>
        attachment.fileType.startsWith('image/') ? (
          <a
            key={attachment.id}
            href={attachment.fileUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.imageAttachment}
          >
            <Image
              src={attachment.fileUrl}
              alt={attachment.fileName}
              width={200}
              height={200}
              unoptimized
              className={styles.attachmentImage}
            />
          </a>
        ) : (
          <FileChip key={attachment.id} attachment={attachment} />
        ),
      )}
    </div>
  );

  if (isMine) {
    return (
      <div className={clsx(styles.messageRow, styles.messageRowMine)}>
        <span className={styles.time}>{time}</span>
        {bubble}
      </div>
    );
  }

  const avatarUrl = counterpart?.profileImageUrl ?? null;

  return (
    <div className={styles.messageRow}>
      {avatarUrl === null ? (
        <span className={styles.avatarFallback}>
          {getCounterpartInitials(counterpart?.name ?? '?')}
        </span>
      ) : (
        <Image
          src={avatarUrl}
          alt=""
          width={40}
          height={40}
          unoptimized
          className={styles.avatar}
        />
      )}
      {bubble}
      <span className={styles.time}>{time}</span>
    </div>
  );
}

// 파일 종류별 lucide 아이콘.
function getFileIcon(fileType: string, fileName: string) {
  const ext = fileName.split('.').at(-1)?.toLowerCase() ?? '';
  if (
    fileType.includes('spreadsheet') ||
    fileType.includes('excel') ||
    ext === 'xlsx' ||
    ext === 'xls' ||
    ext === 'csv'
  ) {
    return FileSpreadsheet;
  }
  if (
    fileType.includes('presentation') ||
    fileType.includes('powerpoint') ||
    ext === 'pptx' ||
    ext === 'ppt'
  ) {
    return Presentation;
  }
  return FileText;
}

function FileChip({ attachment }: { attachment: MessageAttachment }) {
  const Icon = getFileIcon(attachment.fileType, attachment.fileName);
  return (
    <a
      href={attachment.fileUrl}
      target="_blank"
      rel="noreferrer"
      className={styles.fileChip}
    >
      <Icon size={28} aria-hidden className={styles.fileIcon} />
      <span className={styles.fileMeta}>
        <span className={styles.fileName}>{attachment.fileName}</span>
        <span className={styles.fileSub}>파일을 보냈습니다.</span>
      </span>
      <Download size={16} aria-hidden className={styles.fileIcon} />
    </a>
  );
}
